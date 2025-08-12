import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

// Validation schema for updating venues
const UpdateVenueSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  address: z.string().min(1, 'Address is required').optional(),
  city: z.string().min(1, 'City is required').optional(),
  state: z.string().min(1, 'State is required').optional(),
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
  amenities: z.array(z.string()).optional(),
  accessibility: z.array(z.string()).optional()
})

// GET /api/venues/[id] - Get single venue
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const venue = await prisma.venue.findUnique({
      where: { id: params.id },
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
  { params }: { params: { id: string } }
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

    // Check if venue exists
    const existingVenue = await prisma.venue.findUnique({
      where: { id: params.id }
    })

    if (!existingVenue) {
      return NextResponse.json(
        { error: 'Venue not found' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const validatedData = UpdateVenueSchema.parse(body)

    // Update venue
    const updateData: any = {
      ...validatedData,
      amenities: validatedData.amenities ? JSON.stringify(validatedData.amenities) : undefined,
      accessibility: validatedData.accessibility ? JSON.stringify(validatedData.accessibility) : undefined
    }

    const venue = await prisma.venue.update({
      where: { id: params.id },
      data: updateData,
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
  { params }: { params: { id: string } }
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

    // Check if venue exists
    const existingVenue = await prisma.venue.findUnique({
      where: { id: params.id }
    })

    if (!existingVenue) {
      return NextResponse.json(
        { error: 'Venue not found' },
        { status: 404 }
      )
    }

    // Check if venue has events
    const eventCount = await prisma.event.count({
      where: { venueId: params.id }
    })

    if (eventCount > 0) {
      return NextResponse.json(
        { error: 'Cannot delete venue with existing events' },
        { status: 409 }
      )
    }

    // Delete venue
    await prisma.venue.delete({
      where: { id: params.id }
    })

    return NextResponse.json(
      { message: 'Venue deleted successfully' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Delete venue error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}