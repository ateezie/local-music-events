import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

// Validation schema for creating artists
const CreateArtistSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  name: z.string().min(1, 'Name is required'),
  genre: z.string().min(1, 'Genre is required'),
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
  members: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([])
})

// GET /api/artists - Get all artists with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const genre = searchParams.get('genre')
    const hometown = searchParams.get('hometown')
    const search = searchParams.get('search')

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    
    if (genre && genre !== 'all') {
      where.genre = genre
    }
    
    if (hometown) {
      where.hometown = { contains: hometown, mode: 'insensitive' }
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { bio: { contains: search, mode: 'insensitive' } },
        { genre: { contains: search, mode: 'insensitive' } },
        { hometown: { contains: search, mode: 'insensitive' } }
      ]
    }

    const [artists, total] = await Promise.all([
      prisma.artist.findMany({
        where,
        include: {
          events: {
            include: {
              event: {
                include: {
                  venue: true
                }
              }
            },
            where: {
              event: {
                status: 'upcoming',
                date: {
                  gte: new Date().toISOString().split('T')[0]
                }
              }
            },
            orderBy: {
              event: {
                date: 'asc'
              }
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
      prisma.artist.count({ where })
    ])

    // Transform the data to match frontend expectations
    const transformedArtists = artists.map(artist => ({
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
      upcomingEvents: artist.events.map(ea => ({
        ...ea.event,
        tags: ea.event.tags ? JSON.parse(ea.event.tags) : []
      })),
      totalEventsCount: artist._count.events
    }))

    return NextResponse.json({
      artists: transformedArtists,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Get artists error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/artists - Create new artist (admin only)
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
    const validatedData = CreateArtistSchema.parse(body)

    // Check if artist ID already exists
    const existingArtist = await prisma.artist.findUnique({
      where: { id: validatedData.id }
    })

    if (existingArtist) {
      return NextResponse.json(
        { error: 'Artist with this ID already exists' },
        { status: 409 }
      )
    }

    // Create artist
    const artist = await prisma.artist.create({
      data: {
        id: validatedData.id,
        name: validatedData.name,
        genre: validatedData.genre,
        bio: validatedData.bio,
        image: validatedData.image,
        website: validatedData.website,
        hometown: validatedData.hometown,
        formed: validatedData.formed,
        facebook: validatedData.facebook,
        instagram: validatedData.instagram,
        twitter: validatedData.twitter,
        tiktok: validatedData.tiktok,
        youtube: validatedData.youtube,
        spotify: validatedData.spotify,
        bandcamp: validatedData.bandcamp,
        soundcloud: validatedData.soundcloud,
        members: JSON.stringify(validatedData.members),
        tags: JSON.stringify(validatedData.tags),
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

    return NextResponse.json(transformedArtist, { status: 201 })

  } catch (error) {
    console.error('Create artist error:', error)
    
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