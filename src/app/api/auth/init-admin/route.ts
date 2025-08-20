import { NextRequest, NextResponse } from 'next/server'
import { createDefaultAdmin } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    // Only allow this in development
    if (process.env.NODE_ENV !== 'development') {
      return NextResponse.json(
        { error: 'Admin initialization only available in development' },
        { status: 403 }
      )
    }

    console.log('Initializing admin user...')
    const admin = await createDefaultAdmin()

    return NextResponse.json({
      message: 'Admin user initialized successfully',
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      }
    })

  } catch (error) {
    console.error('Error initializing admin:', error)
    return NextResponse.json(
      { error: 'Failed to initialize admin user', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  // Check if admin already exists
  try {
    const { prisma } = await import('@/lib/prisma')
    const adminEmail = process.env.ADMIN_EMAIL
    
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail }
    })

    return NextResponse.json({
      exists: !!existingAdmin,
      email: adminEmail,
      message: existingAdmin ? 'Admin user exists' : 'Admin user does not exist'
    })

  } catch (error) {
    console.error('Error checking admin:', error)
    return NextResponse.json(
      { error: 'Failed to check admin user' },
      { status: 500 }
    )
  }
}