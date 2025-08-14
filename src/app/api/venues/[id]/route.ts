import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

// Validation schema for updating venues
const UpdateVenueSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
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

// GET /api/venues/[id] - Get single venue
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const venue = await prisma.venue.findUnique({
      where: { id },
      include: {
        events: {
          include: {
            artists: {
              include: {
                artist: true
              }
            }
          },
          orderBy: {
            date: 'asc'
          }
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
      }
    })

    if (!venue) {
      return NextResponse.json(
        { error: 'Venue not found' },
        { status: 404 }
      )
    }

    // Transform the data to match frontend expectations
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
      events: venue.events.map(event => ({
        ...event,
        tags: event.tags ? JSON.parse(event.tags) : [],
        artists: event.artists.map(ea => ea.artist)
      }))
    }

    return NextResponse.json(transformedVenue)

  } catch (error) {
    console.error('Get venue error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/venues/[id] - Update venue (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params

    // Check if venue exists
    const existingVenue = await prisma.venue.findUnique({
      where: { id }
    })

    if (!existingVenue) {
      return NextResponse.json(
        { error: 'Venue not found' },
        { status: 404 }
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

    const validatedData = UpdateVenueSchema.parse(cleanedData)

    // Update venue
    const venue = await prisma.venue.update({
      where: { id },
      data: {
        ...validatedData,
        updatedAt: new Date().toISOString()
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
      } : undefined
    }

    return NextResponse.json(transformedVenue)

  } catch (error) {
    console.error('Update venue error:', error)
    
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

// DELETE /api/venues/[id] - Delete venue (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params

    // Check if venue exists
    const existingVenue = await prisma.venue.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            events: true
          }
        }
      }
    })

    if (!existingVenue) {
      return NextResponse.json(
        { error: 'Venue not found' },
        { status: 404 }
      )
    }

    // Check if venue has events
    if (existingVenue._count.events > 0) {
      return NextResponse.json(
        { error: 'Cannot delete venue with existing events' },
        { status: 400 }
      )
    }

    // Delete venue
    await prisma.venue.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Delete venue error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}