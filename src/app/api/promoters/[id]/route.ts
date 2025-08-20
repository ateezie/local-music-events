import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

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

// GET /api/promoters/[id] - Get specific promoter
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify authentication
    const user = verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // In a real app, you would fetch from database:
    // const promoter = await prisma.promoter.findUnique({
    //   where: { id },
    //   include: {
    //     _count: {
    //       select: { events: true }
    //     }
    //   }
    // })
    
    // For demo, find in mock data
    const mockPromoters = [
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
        eventCount: 15
      }
    ]
    
    const promoter = mockPromoters.find(p => p.id === id)
    
    if (!promoter) {
      return NextResponse.json({ error: 'Promoter not found' }, { status: 404 })
    }

    return NextResponse.json({ 
      success: true, 
      promoter 
    })

  } catch (error) {
    console.error('Error fetching promoter:', error)
    return NextResponse.json(
      { error: 'Failed to fetch promoter' },
      { status: 500 }
    )
  }
}

// PUT /api/promoters/[id] - Update promoter
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify authentication
    const user = verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { name, description, website, email, phone, image, facebook, instagram, twitter } = body

    if (!name || name.trim() === '') {
      return NextResponse.json({ error: 'Promoter name is required' }, { status: 400 })
    }

    // In a real app, you would update in database:
    // const promoter = await prisma.promoter.update({
    //   where: { id },
    //   data: {
    //     name: name.trim(),
    //     description: description?.trim(),
    //     website: website?.trim(),
    //     email: email?.trim(),
    //     phone: phone?.trim(),
    //     image: image?.trim(),
    //     facebook: facebook?.trim(),
    //     instagram: instagram?.trim(),
    //     twitter: twitter?.trim(),
    //     updatedAt: new Date()
    //   }
    // })

    // For demo, return updated data
    const updatedPromoter = {
      id,
      name: name.trim(),
      description: description?.trim() || undefined,
      website: website?.trim() || undefined,
      email: email?.trim() || undefined,
      phone: phone?.trim() || undefined,
      image: image?.trim() || undefined,
      facebook: facebook?.trim() || undefined,
      instagram: instagram?.trim() || undefined,
      twitter: twitter?.trim() || undefined,
      eventCount: 0, // Would be calculated from actual events
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json({ 
      success: true, 
      promoter: updatedPromoter 
    })

  } catch (error) {
    console.error('Error updating promoter:', error)
    return NextResponse.json(
      { error: 'Failed to update promoter' },
      { status: 500 }
    )
  }
}

// DELETE /api/promoters/[id] - Delete promoter
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify authentication
    const user = verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // In a real app, you would delete from database:
    // const promoter = await prisma.promoter.delete({
    //   where: { id }
    // })

    return NextResponse.json({ 
      success: true, 
      message: 'Promoter deleted successfully' 
    })

  } catch (error) {
    console.error('Error deleting promoter:', error)
    return NextResponse.json(
      { error: 'Failed to delete promoter' },
      { status: 500 }
    )
  }
}