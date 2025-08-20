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

    // Find promoter by either slug or ID
    const promoter = await prisma.promoter.findFirst({
      where: {
        OR: [
          { id },
          { slug: id }
        ]
      },
      include: {
        _count: {
          select: { events: true }
        }
      }
    })
    
    if (!promoter) {
      return NextResponse.json({ error: 'Promoter not found' }, { status: 404 })
    }

    // Format the response to include event count
    const formattedPromoter = {
      ...promoter,
      eventCount: promoter._count.events
    }

    return NextResponse.json(formattedPromoter)

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

    // Generate slug if name has changed
    const slug = name.trim().toLowerCase()
      .replace(/[^a-z0-9 -]/g, '') // Remove special characters
      .replace(/\s+/g, '-')        // Replace spaces with hyphens
      .replace(/-+/g, '-')         // Replace multiple hyphens with single hyphen
      .trim()

    // Update promoter in database
    const promoter = await prisma.promoter.update({
      where: { id },
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
        updatedAt: new Date()
      },
      include: {
        _count: {
          select: { events: true }
        }
      }
    })

    // Format the response
    const updatedPromoter = {
      ...promoter,
      eventCount: promoter._count.events
    }

    return NextResponse.json(updatedPromoter)

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

    // Delete promoter from database
    await prisma.promoter.delete({
      where: { id }
    })

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