import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

// Validation schema for creating events
const CreateEventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  endTime: z.string().optional(),
  venueId: z.string().min(1, 'Venue is required'),
  artistIds: z.array(z.string()).min(1, 'At least one artist is required'),
  genre: z.string().min(1, 'Genre is required'),
  category: z.string().min(1, 'Category is required'),
  promoter: z.string().optional(),
  ticketUrl: z.string().url().optional().or(z.literal('')),
  facebookEvent: z.string().url().optional().or(z.literal('')),
  instagramPost: z.string().url().optional().or(z.literal('')),
  flyer: z.string().optional(),
  price: z.string().optional(),
  ageRestriction: z.string().optional(),
  featured: z.boolean().default(false),
  status: z.enum(['upcoming', 'cancelled', 'postponed', 'sold-out', 'past']).default('upcoming'),
  tags: z.array(z.string()).default([])
})

// GET /api/events - Get all events with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const genre = searchParams.get('genre')
    const category = searchParams.get('category')
    const venue = searchParams.get('venue')
    const featured = searchParams.get('featured')
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    
    if (genre && genre !== 'all') {
      where.genre = genre
    }
    
    if (category && category !== 'all') {
      where.category = category
    }
    
    if (venue) {
      where.venueId = venue
    }
    
    if (featured === 'true') {
      where.featured = true
    }
    
    if (status) {
      where.status = status
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { genre: { contains: search, mode: 'insensitive' } }
      ]
    }

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
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
        },
        orderBy: [
          { featured: 'desc' },
          { date: 'asc' }
        ],
        skip,
        take: limit
      }),
      prisma.event.count({ where })
    ])

    // Transform the data to match frontend expectations
    const transformedEvents = events.map(event => ({
      ...event,
      tags: event.tags ? JSON.parse(event.tags) : [],
      artists: event.artists.map(ea => ea.artist)
    }))

    return NextResponse.json({
      events: transformedEvents,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Get events error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/events - Create new event (admin only)
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
    const validatedData = CreateEventSchema.parse(body)

    // Verify venue exists
    const venue = await prisma.venue.findUnique({
      where: { id: validatedData.venueId }
    })

    if (!venue) {
      return NextResponse.json(
        { error: 'Venue not found' },
        { status: 404 }
      )
    }

    // Verify all artists exist
    const artists = await prisma.artist.findMany({
      where: { id: { in: validatedData.artistIds } }
    })

    if (artists.length !== validatedData.artistIds.length) {
      return NextResponse.json(
        { error: 'One or more artists not found' },
        { status: 404 }
      )
    }

    // Create event with relations
    const event = await prisma.event.create({
      data: {
        id: `${validatedData.genre}-${Date.now()}`,
        title: validatedData.title,
        description: validatedData.description,
        date: validatedData.date,
        time: validatedData.time,
        endTime: validatedData.endTime,
        genre: validatedData.genre,
        category: validatedData.category,
        promoter: validatedData.promoter,
        ticketUrl: validatedData.ticketUrl,
        facebookEvent: validatedData.facebookEvent,
        instagramPost: validatedData.instagramPost,
        flyer: validatedData.flyer,
        price: validatedData.price,
        ageRestriction: validatedData.ageRestriction,
        featured: validatedData.featured,
        status: validatedData.status,
        tags: JSON.stringify(validatedData.tags),
        venueId: validatedData.venueId,
        authorId: payload.userId,
        artists: {
          create: validatedData.artistIds.map(artistId => ({
            artistId
          }))
        }
      },
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

    // Transform response
    const transformedEvent = {
      ...event,
      tags: event.tags ? JSON.parse(event.tags) : [],
      artists: event.artists.map(ea => ea.artist)
    }

    return NextResponse.json(transformedEvent, { status: 201 })

  } catch (error) {
    console.error('Create event error:', error)
    
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