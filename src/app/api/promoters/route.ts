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

    // In a real app, you would fetch from database:
    // const promoters = await prisma.promoter.findMany({
    //   orderBy: { name: 'asc' },
    //   include: {
    //     _count: {
    //       select: { events: true }
    //     }
    //   }
    // })

    return NextResponse.json({ 
      success: true, 
      promoters: mockPromoters 
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

    // Create new promoter
    const newPromoter: Promoter = {
      id: `promoter-${Date.now()}`,
      name: name.trim(),
      description: description?.trim() || undefined,
      website: website?.trim() || undefined,
      email: email?.trim() || undefined,
      phone: phone?.trim() || undefined,
      image: image?.trim() || undefined,
      facebook: facebook?.trim() || undefined,
      instagram: instagram?.trim() || undefined,
      twitter: twitter?.trim() || undefined,
      eventCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // In a real app, you would save to database:
    // const promoter = await prisma.promoter.create({
    //   data: {
    //     id: newPromoter.id,
    //     name: newPromoter.name,
    //     description: newPromoter.description,
    //     website: newPromoter.website,
    //     email: newPromoter.email,
    //     phone: newPromoter.phone,
    //     image: newPromoter.image,
    //     facebook: newPromoter.facebook,
    //     instagram: newPromoter.instagram,
    //     twitter: newPromoter.twitter,
    //     authorId: user.id
    //   }
    // })

    // For demo purposes, add to mock data
    mockPromoters.push(newPromoter)

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