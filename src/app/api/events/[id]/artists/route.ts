import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

// Validation schema
const ArtistAssignmentSchema = z.object({
  artistId: z.string().min(1, 'Artist ID is required')
})

// POST /api/events/[id]/artists - Assign artist to event
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: eventId } = await params
    
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
    const { artistId } = ArtistAssignmentSchema.parse(body)

    // Check if event exists
    const event = await prisma.event.findUnique({
      where: { id: eventId }
    })

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    // Check if artist exists
    const artist = await prisma.artist.findUnique({
      where: { id: artistId }
    })

    if (!artist) {
      return NextResponse.json(
        { error: 'Artist not found' },
        { status: 404 }
      )
    }

    // Check if assignment already exists
    const existingAssignment = await prisma.eventArtist.findUnique({
      where: {
        eventId_artistId: {
          eventId: eventId,
          artistId: artistId
        }
      }
    })

    if (existingAssignment) {
      return NextResponse.json(
        { error: 'Artist is already assigned to this event' },
        { status: 409 }
      )
    }

    // Create the assignment
    await prisma.eventArtist.create({
      data: {
        eventId: eventId,
        artistId: artistId
      }
    })

    return NextResponse.json(
      { message: 'Artist assigned to event successfully' },
      { status: 201 }
    )

  } catch (error) {
    console.error('Assign artist to event error:', error)
    
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

// DELETE /api/events/[id]/artists - Remove artist from event
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: eventId } = await params
    
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
    const { artistId } = ArtistAssignmentSchema.parse(body)

    // Check if assignment exists
    const existingAssignment = await prisma.eventArtist.findUnique({
      where: {
        eventId_artistId: {
          eventId: eventId,
          artistId: artistId
        }
      }
    })

    if (!existingAssignment) {
      return NextResponse.json(
        { error: 'Artist is not assigned to this event' },
        { status: 404 }
      )
    }

    // Remove the assignment
    await prisma.eventArtist.delete({
      where: {
        eventId_artistId: {
          eventId: eventId,
          artistId: artistId
        }
      }
    })

    return NextResponse.json(
      { message: 'Artist removed from event successfully' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Remove artist from event error:', error)
    
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