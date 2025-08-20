import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { generateVenueSlug } from '@/lib/eventUtils'

// Validation schema for creating venues
const CreateVenueSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  address: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  zipCode: z.string().optional().nullable(),
  capacity: z.number().int().positive().optional().nullable(),
  website: z.union([z.string().url(), z.literal(''), z.null()]).optional(),
  phone: z.union([z.string(), z.null()]).optional(),
  email: z.union([z.string().email(), z.literal(''), z.null()]).optional(),
  description: z.union([z.string(), z.null()]).optional(),
  facebook: z.union([z.string().url(), z.literal(''), z.null()]).optional(),
  instagram: z.union([z.string().url(), z.literal(''), z.null()]).optional(),
  twitter: z.union([z.string().url(), z.literal(''), z.null()]).optional()
})

// GET /api/venues - Get all venues with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const city = searchParams.get('city')
    const state = searchParams.get('state')
    const search = searchParams.get('search')

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    
    if (city) {
      where.city = { contains: city, mode: 'insensitive' }
    }
    
    if (state) {
      where.state = { contains: state, mode: 'insensitive' }
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } }
      ]
    }

    const [venues, total] = await Promise.all([
      prisma.venue.findMany({
        where,
        include: {
          events: {
            where: {
              status: 'upcoming',
              date: {
                gte: new Date().toISOString().split('T')[0]
              }
            },
            orderBy: {
              date: 'asc'
            },
            take: 5
          },
          author: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          _count: {
            select: {
              events: true
            }
          }
        },
        orderBy: {
          name: 'asc'
        },
        skip,
        take: limit
      }),
      prisma.venue.count({ where })
    ])

    // Transform the data to match frontend expectations
    const transformedVenues = venues.map(venue => ({
      ...venue,
      amenities: venue.amenities ? JSON.parse(venue.amenities) : [],
      accessibility: venue.accessibility ? JSON.parse(venue.accessibility) : [],
      socialMedia: {
        facebook: venue.facebook,
        instagram: venue.instagram,
        twitter: venue.twitter,
        website: venue.website
      },
      coordinates: venue.latitude && venue.longitude ? {
        lat: venue.latitude,
        lng: venue.longitude
      } : undefined,
      upcomingEventsCount: venue._count.events
    }))

    return NextResponse.json({
      venues: transformedVenues,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Get venues error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/venues - Create new venue (admin only)
export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    const body = await request.json()

    // Clean the data before validation
    const cleanedData = {
      ...body,
      website: body.website?.trim() || null,
      phone: body.phone?.trim() || null,
      email: body.email?.trim() || null,
      description: body.description?.trim() || null,
      facebook: body.facebook?.trim() || null,
      instagram: body.instagram?.trim() || null,
      twitter: body.twitter?.trim() || null,
      address: body.address?.trim() || null,
      city: body.city?.trim() || null,
      state: body.state?.trim() || null,
      zipCode: body.zipCode?.trim() || null,
      capacity: body.capacity ? parseInt(body.capacity) : null
    }

    const validatedData = CreateVenueSchema.parse(cleanedData)

    // Generate venue ID and slug
    const venueId = `venue-${Date.now()}`
    let baseSlug = generateVenueSlug(validatedData.name, validatedData.city || undefined)
    
    // Ensure slug is unique
    let slug = baseSlug
    let counter = 1
    while (await prisma.venue.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`
      counter++
    }

    // Create venue
    const venue = await prisma.venue.create({
      data: {
        id: venueId,
        name: validatedData.name,
        slug,
        address: validatedData.address || '',
        city: validatedData.city || '',
        state: validatedData.state || '',
        zipCode: validatedData.zipCode || '',
        capacity: validatedData.capacity,
        website: validatedData.website || null,
        phone: validatedData.phone || null,
        email: validatedData.email || null,
        description: validatedData.description || null,
        image: null,
        facebook: validatedData.facebook || null,
        instagram: validatedData.instagram || null,
        twitter: validatedData.twitter || null,
        latitude: null,
        longitude: null,
        amenities: '{}',
        accessibility: '{}',
        authorId: payload.userId
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        _count: {
          select: {
            events: true
          }
        }
      }
    })

    // Transform response
    const transformedVenue = {
      ...venue,
      amenities: venue.amenities ? JSON.parse(venue.amenities) : [],
      accessibility: venue.accessibility ? JSON.parse(venue.accessibility) : [],
      socialMedia: {
        facebook: venue.facebook,
        instagram: venue.instagram,
        twitter: venue.twitter,
        website: venue.website
      },
      coordinates: venue.latitude && venue.longitude ? {
        lat: venue.latitude,
        lng: venue.longitude
      } : undefined,
      upcomingEventsCount: venue._count.events
    }

    return NextResponse.json(transformedVenue, { status: 201 })

  } catch (error) {
    console.error('Create venue error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}