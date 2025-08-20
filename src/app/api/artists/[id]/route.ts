import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

// Validation schema for updating artists
const UpdateArtistSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  genre: z.string().min(1, 'Genre is required').optional(),
  bio: z.string().optional(),
  image: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  hometown: z.string().optional(),
  formed: z.string().optional(),
  facebook: z.string().url().optional().or(z.literal('')),
  instagram: z.string().url().optional().or(z.literal('')),
  twitter: z.string().url().optional().or(z.literal('')),
  tiktok: z.string().url().optional().or(z.literal('')),
  youtube: z.string().url().optional().or(z.literal('')),
  spotify: z.string().url().optional().or(z.literal('')),
  bandcamp: z.string().url().optional().or(z.literal('')),
  soundcloud: z.string().url().optional().or(z.literal('')),
  members: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional()
})

// GET /api/artists/[id] - Get single artist
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const artist = await prisma.artist.findUnique({
      where: { id },
      include: {
        events: {
          include: {
            event: {
              include: {
                venue: true
              }
            }
          },
          orderBy: {
            event: {
              date: 'asc'
            }
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

    if (!artist) {
      return NextResponse.json(
        { error: 'Artist not found' },
        { status: 404 }
      )
    }

    // Transform the data to match frontend expectations
    const transformedArtist = {
      ...artist,
      members: artist.members ? JSON.parse(artist.members) : [],
      tags: artist.tags ? JSON.parse(artist.tags) : [],
      socialMedia: {
        facebook: artist.facebook,
        instagram: artist.instagram,
        twitter: artist.twitter,
        tiktok: artist.tiktok,
        youtube: artist.youtube,
        spotify: artist.spotify,
        bandcamp: artist.bandcamp,
        soundcloud: artist.soundcloud,
        website: artist.website
      },
      mediaLinks: {
        spotify: artist.spotify,
        youtube: artist.youtube,
        bandcamp: artist.bandcamp,
        soundcloud: artist.soundcloud
      },
      events: artist.events.map(ea => ({
        ...ea.event,
        tags: ea.event.tags ? JSON.parse(ea.event.tags) : []
      })),
      totalEventsCount: artist._count.events
    }

    return NextResponse.json(transformedArtist)

  } catch (error) {
    console.error('Get artist error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/artists/[id] - Update artist (admin only)
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

    // Check if artist exists
    const existingArtist = await prisma.artist.findUnique({
      where: { id }
    })

    if (!existingArtist) {
      return NextResponse.json(
        { error: 'Artist not found' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const validatedData = UpdateArtistSchema.parse(body)

    // Update artist
    const updateData: any = {
      ...validatedData,
      members: validatedData.members ? JSON.stringify(validatedData.members) : undefined,
      tags: validatedData.tags ? JSON.stringify(validatedData.tags) : undefined
    }

    const artist = await prisma.artist.update({
      where: { id },
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
    const transformedArtist = {
      ...artist,
      members: artist.members ? JSON.parse(artist.members) : [],
      tags: artist.tags ? JSON.parse(artist.tags) : [],
      socialMedia: {
        facebook: artist.facebook,
        instagram: artist.instagram,
        twitter: artist.twitter,
        tiktok: artist.tiktok,
        youtube: artist.youtube,
        spotify: artist.spotify,
        bandcamp: artist.bandcamp,
        soundcloud: artist.soundcloud,
        website: artist.website
      },
      mediaLinks: {
        spotify: artist.spotify,
        youtube: artist.youtube,
        bandcamp: artist.bandcamp,
        soundcloud: artist.soundcloud
      },
      totalEventsCount: artist._count.events
    }

    return NextResponse.json(transformedArtist)

  } catch (error) {
    console.error('Update artist error:', error)
    
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

// DELETE /api/artists/[id] - Delete artist (admin only)
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

    // Check if artist exists
    const existingArtist = await prisma.artist.findUnique({
      where: { id }
    })

    if (!existingArtist) {
      return NextResponse.json(
        { error: 'Artist not found' },
        { status: 404 }
      )
    }

    // Check if artist has events
    const eventCount = await prisma.eventArtist.count({
      where: { artistId: id }
    })

    if (eventCount > 0) {
      return NextResponse.json(
        { error: 'Cannot delete artist with existing events' },
        { status: 409 }
      )
    }

    // Delete artist
    await prisma.artist.delete({
      where: { id }
    })

    return NextResponse.json(
      { message: 'Artist deleted successfully' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Delete artist error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}