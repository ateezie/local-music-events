import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { generateEventSlug } from '@/lib/slug'

// Helper function to find event by ID or slug
async function findEventByIdOrSlug(identifier: string) {
  // Try to find by ID first (exact match)
  let event = await prisma.event.findUnique({
    where: { id: identifier },
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

  // If not found by ID, try by slug
  if (!event) {
    event = await prisma.event.findUnique({
      where: { slug: identifier },
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
  }

  return event
}

// Validation schema for updating events
const UpdateEventSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  slug: z.string().min(1, 'Slug is required').optional(),
  description: z.string().min(1, 'Description is required').optional(),
  date: z.string().min(1, 'Date is required').optional(),
  time: z.string().min(1, 'Time is required').optional(),
  endTime: z.string().optional(),
  venueId: z.string().min(1, 'Venue is required').optional(),
  artistIds: z.array(z.string()).min(1, 'At least one artist is required').optional(),
  genre: z.string().min(1, 'Genre is required').optional(),
  subGenres: z.array(z.string()).optional(),
  category: z.enum(['concert', 'festival', 'dj-set', 'acoustic', 'open-mic', 'album-release']).optional(),
  promoter: z.string().optional(),
  ticketUrl: z.string().url().optional().or(z.literal('')),
  facebookEvent: z.string().url().optional().or(z.literal('')),
  instagramPost: z.string().url().optional().or(z.literal('')),
  flyer: z.string().optional(),
  bannerImage: z.string().optional(),
  price: z.string().optional(),
  ageRestriction: z.string().optional(),
  featured: z.boolean().optional(),
  hero: z.boolean().optional(),
  status: z.enum(['upcoming', 'cancelled', 'postponed', 'sold-out', 'past']).optional(),
  tags: z.array(z.string()).optional()
})

// GET /api/events/[id] - Get single event (supports both ID and slug)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const event = await findEventByIdOrSlug(id)

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
      subGenres: event.subGenres ? JSON.parse(event.subGenres) : [],
      artists: event.artists.map(ea => ea.artist)
    }

    return NextResponse.json({ event: transformedEvent })

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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
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

    // Check if event exists (by ID or slug)
    const existingEvent = await findEventByIdOrSlug(id)

    if (!existingEvent) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    const body = await request.json()
    console.log('Received body:', body)
    
    // Clean up the data before validation
    const cleanedBody = {
      ...body,
      // Convert null values to empty strings or appropriate defaults
      endTime: body.endTime || undefined,
      ageRestriction: body.ageRestriction || '',
      ticketUrl: body.ticketUrl || '',
      facebookEvent: body.facebookEvent || '',
      instagramPost: body.instagramPost || '',
      flyer: body.flyer || '',
      slug: body.slug || undefined, // Convert null to undefined
      bannerImage: body.bannerImage || undefined, // Convert null to undefined
      // Set all events to "dj-set" category
      category: 'dj-set',
      // Remove read-only fields
      createdAt: undefined,
      updatedAt: undefined,
      author: undefined,
      artists: undefined
    }
    
    // Handle the edit page format which includes venue data directly
    if (cleanedBody.venue && typeof cleanedBody.venue === 'object') {
      // First update the venue
      await prisma.venue.update({
        where: { id: cleanedBody.venue.id },
        data: {
          name: cleanedBody.venue.name,
          address: cleanedBody.venue.address || '',
          city: cleanedBody.venue.city || '',
          state: cleanedBody.venue.state || '',
          zipCode: cleanedBody.venue.zipCode || '',
          capacity: cleanedBody.venue.capacity
        }
      })
      
      // Remove venue from body and just keep venueId
      cleanedBody.venueId = cleanedBody.venue.id
      delete cleanedBody.venue
    }
    
    const validatedData = UpdateEventSchema.parse(cleanedBody)

    // Generate slug if title changed but no custom slug provided
    if (validatedData.title && !validatedData.slug) {
      const venue = existingEvent.venue
      validatedData.slug = generateEventSlug(
        validatedData.title, 
        validatedData.date || existingEvent.date,
        venue?.name
      )
      
      // Ensure slug uniqueness
      let finalSlug = validatedData.slug
      let counter = 1
      while (true) {
        const existing = await prisma.event.findFirst({
          where: { 
            slug: finalSlug,
            id: { not: existingEvent.id } // Exclude current event
          }
        })
        
        if (!existing) break
        
        finalSlug = `${validatedData.slug}-${counter}`
        counter++
      }
      
      validatedData.slug = finalSlug
    }

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
    
    // Handle subGenres - only include if it has values, otherwise remove completely
    if (validatedData.subGenres && validatedData.subGenres.length > 0) {
      updateData.subGenres = JSON.stringify(validatedData.subGenres)
    } else {
      delete updateData.subGenres
    }

    // Remove fields that are handled separately or not allowed in update data
    delete updateData.artistIds
    delete updateData.venueId

    const event = await prisma.event.update({
      where: { id: existingEvent.id }, // Use the actual ID from the found event
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
        where: { eventId: existingEvent.id }
      })

      // Create new relationships
      await prisma.eventArtist.createMany({
        data: validatedData.artistIds.map(artistId => ({
          eventId: existingEvent.id,
          artistId
        }))
      })

      // Re-fetch with updated relations
      const updatedEvent = await prisma.event.findUnique({
        where: { id: existingEvent.id },
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
          subGenres: updatedEvent.subGenres ? JSON.parse(updatedEvent.subGenres) : [],
          artists: updatedEvent.artists.map(ea => ea.artist)
        }

        return NextResponse.json(transformedEvent)
      }
    }

    // Transform response
    const transformedEvent = {
      ...event,
      tags: event.tags ? JSON.parse(event.tags) : [],
      subGenres: event.subGenres ? JSON.parse(event.subGenres) : [],
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
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

    // Check if event exists (by ID or slug)
    const existingEvent = await findEventByIdOrSlug(id)

    if (!existingEvent) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    // Delete event (artist relationships will be deleted due to cascade)
    await prisma.event.delete({
      where: { id: existingEvent.id }
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