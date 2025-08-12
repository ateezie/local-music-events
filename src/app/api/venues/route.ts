import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

// Validation schema for creating venues
const CreateVenueSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  name: z.string().min(1, 'Name is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z.string().optional(),
  capacity: z.number().int().positive().optional(),
  website: z.string().url().optional().or(z.literal('')),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  description: z.string().optional(),
  image: z.string().optional(),
  facebook: z.string().url().optional().or(z.literal('')),
  instagram: z.string().url().optional().or(z.literal('')),
  twitter: z.string().url().optional().or(z.literal('')),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  amenities: z.array(z.string()).default([]),
  accessibility: z.array(z.string()).default([])
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
    const validatedData = CreateVenueSchema.parse(body)

    // Check if venue ID already exists
    const existingVenue = await prisma.venue.findUnique({
      where: { id: validatedData.id }
    })

    if (existingVenue) {
      return NextResponse.json(
        { error: 'Venue with this ID already exists' },
        { status: 409 }
      )
    }

    // Create venue
    const venue = await prisma.venue.create({
      data: {
        id: validatedData.id,
        name: validatedData.name,
        address: validatedData.address,
        city: validatedData.city,
        state: validatedData.state,
        zipCode: validatedData.zipCode,
        capacity: validatedData.capacity,
        website: validatedData.website,
        phone: validatedData.phone,
        email: validatedData.email,
        description: validatedData.description,
        image: validatedData.image,
        facebook: validatedData.facebook,
        instagram: validatedData.instagram,
        twitter: validatedData.twitter,
        latitude: validatedData.latitude,
        longitude: validatedData.longitude,
        amenities: JSON.stringify(validatedData.amenities),
        accessibility: JSON.stringify(validatedData.accessibility),
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