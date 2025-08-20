import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

interface Promoter {
  id: string
  name: string
  description?: string
  website?: string
  email?: string
  phone?: string
  image?: string
  facebook?: string
  instagram?: string
  twitter?: string
  eventCount?: number
  createdAt?: string
  updatedAt?: string
}

// Helper function to verify admin authentication
function verifyAuth(request: NextRequest) {
  const authorization = request.headers.get('Authorization')
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return null
  }

  const token = authorization.replace('Bearer ', '')
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any
    return decoded
  } catch (error) {
    return null
  }
}

// Mock promoters data (in a real app, this would be from a database)
const mockPromoters: Promoter[] = [
  {
    id: 'promoter-1',
    name: 'Mississippi Underground',
    description: 'Premier underground music venue and event promoter in St. Louis',
    website: 'https://mississippiunderground.com',
    email: 'info@mississippiunderground.com',
    phone: '(314) 555-0123',
    image: '/images/promoters/mississippi-underground.jpg',
    facebook: 'https://facebook.com/mississippiunderground',
    instagram: 'https://instagram.com/mississippiunderground',
    twitter: 'https://twitter.com/mississippiunderground',
    eventCount: 15,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'promoter-2',
    name: 'Downright Entertainment',
    description: 'Bringing the best electronic music events to St. Louis',
    website: 'https://downrightentertainment.com',
    email: 'booking@downrightentertainment.com',
    phone: '(314) 555-0456',
    facebook: 'https://facebook.com/downrightentertainment',
    instagram: 'https://instagram.com/downrightentertainment',
    eventCount: 8,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'promoter-3',
    name: 'Downtown Music Collective',
    description: 'Supporting local and touring artists in downtown St. Louis',
    email: 'events@downtownmusiccollective.com',
    phone: '(314) 555-0789',
    instagram: 'https://instagram.com/downtownmusiccollective',
    eventCount: 12,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'promoter-4',
    name: 'Bassline Events',
    description: 'Electronic music events with a focus on bass music',
    website: 'https://basslineevents.com',
    email: 'info@basslineevents.com',
    facebook: 'https://facebook.com/basslineevents',
    instagram: 'https://instagram.com/basslineevents',
    twitter: 'https://twitter.com/basslineevents',
    eventCount: 6,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  }
]

// GET /api/promoters - Get all promoters
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const user = verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch promoters from database
    const promoters = await prisma.promoter.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { events: true }
        }
      }
    })

    // Format the response to include event count
    const formattedPromoters = promoters.map(promoter => ({
      ...promoter,
      eventCount: promoter._count.events
    }))

    return NextResponse.json({ 
      success: true, 
      promoters: formattedPromoters 
    })

  } catch (error) {
    console.error('Error fetching promoters:', error)
    return NextResponse.json(
      { error: 'Failed to fetch promoters' },
      { status: 500 }
    )
  }
}

// POST /api/promoters - Create new promoter
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const user = verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, website, email, phone, image, facebook, instagram, twitter } = body

    if (!name || name.trim() === '') {
      return NextResponse.json({ error: 'Promoter name is required' }, { status: 400 })
    }

    // Generate slug from name
    const slug = name.trim().toLowerCase()
      .replace(/[^a-z0-9 -]/g, '') // Remove special characters
      .replace(/\s+/g, '-')        // Replace spaces with hyphens
      .replace(/-+/g, '-')         // Replace multiple hyphens with single hyphen
      .trim()

    // Create promoter in database
    const promoter = await prisma.promoter.create({
      data: {
        name: name.trim(),
        slug,
        description: description?.trim() || null,
        website: website?.trim() || null,
        email: email?.trim() || null,
        phone: phone?.trim() || null,
        image: image?.trim() || null,
        facebook: facebook?.trim() || null,
        instagram: instagram?.trim() || null,
        twitter: twitter?.trim() || null,
        authorId: user.userId
      },
      include: {
        _count: {
          select: { events: true }
        }
      }
    })

    // Format the response
    const newPromoter = {
      ...promoter,
      eventCount: promoter._count.events
    }

    return NextResponse.json({ 
      success: true, 
      promoter: newPromoter 
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating promoter:', error)
    return NextResponse.json(
      { error: 'Failed to create promoter' },
      { status: 500 }
    )
  }
}