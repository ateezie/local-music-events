import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

// Validation schema for updating events
const UpdateEventSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  description: z.string().min(1, 'Description is required').optional(),
  date: z.string().min(1, 'Date is required').optional(),
  time: z.string().min(1, 'Time is required').optional(),
  endTime: z.string().optional(),
  venueId: z.string().min(1, 'Venue is required').optional(),
  artistIds: z.array(z.string()).min(1, 'At least one artist is required').optional(),
  genre: z.string().min(1, 'Genre is required').optional(),
  category: z.string().min(1, 'Category is required').optional(),
  promoter: z.string().optional(),
  ticketUrl: z.string().url().optional().or(z.literal('')),
  facebookEvent: z.string().url().optional().or(z.literal('')),
  instagramPost: z.string().url().optional().or(z.literal('')),
  flyer: z.string().optional(),
  price: z.string().optional(),
  ageRestriction: z.string().optional(),
  featured: z.boolean().optional(),
  status: z.enum(['upcoming', 'cancelled', 'postponed', 'sold-out', 'past']).optional(),
  tags: z.array(z.string()).optional()
})

// GET /api/events/[id] - Get single event
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const event = await prisma.event.findUnique({
      where: { id: params.id },
      include: {
        venue: true,
        artists: {
          include: {
            artist: true
          }
        },
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    // Transform the data to match frontend expectations
    const transformedEvent = {
      ...event,
      tags: event.tags ? JSON.parse(event.tags) : [],
      artists: event.artists.map(ea => ea.artist)
    }

    return NextResponse.json(transformedEvent)

  } catch (error) {
    console.error('Get event error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/events/[id] - Update event (admin only)
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

    // Check if event exists
    const existingEvent = await prisma.event.findUnique({
      where: { id: params.id }
    })

    if (!existingEvent) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const validatedData = UpdateEventSchema.parse(body)

    // Verify venue exists if provided
    if (validatedData.venueId) {
      const venue = await prisma.venue.findUnique({
        where: { id: validatedData.venueId }
      })

      if (!venue) {
        return NextResponse.json(
          { error: 'Venue not found' },
          { status: 404 }
        )
      }
    }

    // Verify all artists exist if provided
    if (validatedData.artistIds) {
      const artists = await prisma.artist.findMany({
        where: { id: { in: validatedData.artistIds } }
      })

      if (artists.length !== validatedData.artistIds.length) {
        return NextResponse.json(
          { error: 'One or more artists not found' },
          { status: 404 }
        )
      }
    }

    // Update event
    const updateData: any = {
      ...validatedData,
      tags: validatedData.tags ? JSON.stringify(validatedData.tags) : undefined
    }

    // Remove artistIds from update data since it's handled separately
    delete updateData.artistIds

    const event = await prisma.event.update({
      where: { id: params.id },
      data: updateData,
      include: {
        venue: true,
        artists: {
          include: {
            artist: true
          }
        },
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    // Update artist relationships if provided
    if (validatedData.artistIds) {
      // Delete existing relationships
      await prisma.eventArtist.deleteMany({
        where: { eventId: params.id }
      })

      // Create new relationships
      await prisma.eventArtist.createMany({
        data: validatedData.artistIds.map(artistId => ({
          eventId: params.id,
          artistId
        }))
      })

      // Re-fetch with updated relations
      const updatedEvent = await prisma.event.findUnique({
        where: { id: params.id },
        include: {
          venue: true,
          artists: {
            include: {
              artist: true
            }
          },
          author: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      })

      if (updatedEvent) {
        const transformedEvent = {
          ...updatedEvent,
          tags: updatedEvent.tags ? JSON.parse(updatedEvent.tags) : [],
          artists: updatedEvent.artists.map(ea => ea.artist)
        }

        return NextResponse.json(transformedEvent)
      }
    }

    // Transform response
    const transformedEvent = {
      ...event,
      tags: event.tags ? JSON.parse(event.tags) : [],
      artists: event.artists.map(ea => ea.artist)
    }

    return NextResponse.json(transformedEvent)

  } catch (error) {
    console.error('Update event error:', error)
    
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

// DELETE /api/events/[id] - Delete event (admin only)
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

    // Check if event exists
    const existingEvent = await prisma.event.findUnique({
      where: { id: params.id }
    })

    if (!existingEvent) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    // Delete event (artist relationships will be deleted due to cascade)
    await prisma.event.delete({
      where: { id: params.id }
    })

    return NextResponse.json(
      { message: 'Event deleted successfully' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Delete event error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}