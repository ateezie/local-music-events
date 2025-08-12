import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { z } from 'zod'

const MusicGenreSchema = z.object({
  id: z.string().min(1, 'Genre ID is required'),
  name: z.string().min(1, 'Genre name is required'),
  description: z.string().min(1, 'Genre description is required'),
  color: z.string().min(1, 'Genre color is required')
})

const EventCategorySchema = z.object({
  id: z.string().min(1, 'Category ID is required'),
  name: z.string().min(1, 'Category name is required'),
  description: z.string().min(1, 'Category description is required'),
  emoji: z.string().min(1, 'Category emoji is required')
})

// GET /api/categories - Get genres and event categories
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // 'genres', 'categories', or both

    const result: any = {}

    // Get music genres
    if (!type || type === 'genres' || type === 'all') {
      const genres = await prisma.musicGenre.findMany({
        orderBy: { name: 'asc' },
        include: {
          _count: {
            select: { events: true }
          }
        }
      })

      result.genres = genres.map(genre => ({
        id: genre.id,
        name: genre.name,
        description: genre.description,
        color: genre.color,
        count: genre._count.events
      }))
    }

    // Get event categories
    if (!type || type === 'categories' || type === 'all') {
      const categories = await prisma.eventCategory.findMany({
        orderBy: { name: 'asc' },
        include: {
          _count: {
            select: { events: true }
          }
        }
      })

      result.categories = categories.map(category => ({
        id: category.id,
        name: category.name,
        description: category.description,
        emoji: category.emoji,
        count: category._count.events
      }))
    }

    return NextResponse.json(result)

  } catch (error) {
    console.error('Error fetching categories/genres:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/categories - Create new genre or category (Admin only)
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
    const { type, ...data } = body

    if (type === 'genre') {
      const validatedData = MusicGenreSchema.parse(data)

      // Check if genre ID already exists
      const existingGenre = await prisma.musicGenre.findUnique({
        where: { id: validatedData.id }
      })

      if (existingGenre) {
        return NextResponse.json(
          { error: 'Genre with this ID already exists' },
          { status: 409 }
        )
      }

      const genre = await prisma.musicGenre.create({
        data: {
          id: validatedData.id,
          name: validatedData.name,
          description: validatedData.description,
          color: validatedData.color,
          authorId: payload.userId
        }
      })

      return NextResponse.json(
        { message: 'Genre created successfully', genre },
        { status: 201 }
      )

    } else if (type === 'category') {
      const validatedData = EventCategorySchema.parse(data)

      // Check if category ID already exists
      const existingCategory = await prisma.eventCategory.findUnique({
        where: { id: validatedData.id }
      })

      if (existingCategory) {
        return NextResponse.json(
          { error: 'Category with this ID already exists' },
          { status: 409 }
        )
      }

      const category = await prisma.eventCategory.create({
        data: {
          id: validatedData.id,
          name: validatedData.name,
          description: validatedData.description,
          emoji: validatedData.emoji,
          authorId: payload.userId
        }
      })

      return NextResponse.json(
        { message: 'Category created successfully', category },
        { status: 201 }
      )

    } else {
      return NextResponse.json(
        { error: 'Invalid type. Must be "genre" or "category"' },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('Error creating genre/category:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}