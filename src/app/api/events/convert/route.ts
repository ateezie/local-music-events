import { NextRequest, NextResponse } from 'next/server'
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

// POST /api/events/convert - Convert JSON event to database
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

    const { eventId } = await request.json()
    
    if (!eventId) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      )
    }

    // Load event from JSON
    const eventsPath = join(process.cwd(), 'src/data/events.json')
    const eventsData = JSON.parse(readFileSync(eventsPath, 'utf8'))
    const events = Array.isArray(eventsData) ? eventsData : (eventsData.events || [])
    
    const jsonEvent = events.find((event: any) => event.id === eventId)
    if (!jsonEvent) {
      return NextResponse.json(
        { error: 'Event not found in JSON' },
        { status: 404 }
      )
    }

    console.log('Converting JSON event to database:', jsonEvent.title)

    // Create or find venue
    let venue = await prisma.venue.findFirst({
      where: { name: jsonEvent.venue.name }
    })

    if (!venue) {
      venue = await prisma.venue.create({
        data: {
          id: `venue-${Date.now()}`,
          name: jsonEvent.venue.name,
          address: jsonEvent.venue.address || '',
          city: jsonEvent.venue.city || '',
          state: jsonEvent.venue.state || '',
          zipCode: jsonEvent.venue.zipCode || '',
          capacity: jsonEvent.venue.capacity || null,
          description: `Venue for ${jsonEvent.title}`,
          website: null,
          phone: null,
          email: null,
          accessibility: '{}',
          amenities: '{}',
          authorId: payload.userId
        }
      })
      console.log('Created venue:', venue.name)
    }

    // Create or find artists
    const artistIds = []
    if (jsonEvent.artists && jsonEvent.artists.length > 0) {
      for (const artistData of jsonEvent.artists) {
        const artistName = artistData.name || artistData
        let artist = await prisma.artist.findFirst({
          where: { name: artistName }
        })

        if (!artist) {
          artist = await prisma.artist.create({
            data: {
              id: `artist-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              name: artistName,
              genre: artistData.genre || jsonEvent.genre || 'other',
              bio: `Artist performing at ${jsonEvent.title}`,
              hometown: '',
              website: null,
              authorId: payload.userId
            }
          })
          console.log('Created artist:', artist.name)
        }
        artistIds.push(artist.id)
      }
    } else if (jsonEvent.promoter) {
      // Use promoter as artist if no artists specified
      let artist = await prisma.artist.findFirst({
        where: { name: jsonEvent.promoter }
      })

      if (!artist) {
        artist = await prisma.artist.create({
          data: {
            id: `artist-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: jsonEvent.promoter,
            genre: jsonEvent.genre || 'other',
            bio: `Promoter/Artist for ${jsonEvent.title}`,
            hometown: '',
            website: null,
            authorId: payload.userId
          }
        })
        console.log('Created artist from promoter:', artist.name)
      }
      artistIds.push(artist.id)
    }

    // Create event in database
    const dbEvent = await prisma.event.create({
      data: {
        id: `db-${Date.now()}`,
        title: jsonEvent.title,
        description: jsonEvent.description || `Live music event featuring ${jsonEvent.promoter}`,
        date: jsonEvent.date,
        time: jsonEvent.time,
        endTime: jsonEvent.endTime,
        genre: jsonEvent.genre || 'other',
        category: jsonEvent.category || 'concert',
        promoter: jsonEvent.promoter,
        ticketUrl: jsonEvent.tickets?.url || jsonEvent.ticketUrl || '',
        facebookEvent: '',
        instagramPost: '',
        flyer: '',
        price: typeof jsonEvent.price === 'object' 
          ? `$${jsonEvent.price.min}${jsonEvent.price.max ? `-$${jsonEvent.price.max}` : ''}` 
          : jsonEvent.price || '',
        ageRestriction: jsonEvent.ageRestriction || '',
        featured: jsonEvent.featured || false,
        status: jsonEvent.status === 'published' ? 'upcoming' : (jsonEvent.status || 'upcoming'),
        tags: JSON.stringify(jsonEvent.tags || [jsonEvent.genre]),
        venueId: venue.id,
        authorId: payload.userId,
        artists: {
          create: artistIds.map(artistId => ({
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
        }
      }
    })

    // Remove from JSON file
    const updatedEvents = events.filter((event: any) => event.id !== eventId)
    const dataToSave = Array.isArray(eventsData) ? updatedEvents : { events: updatedEvents }
    writeFileSync(eventsPath, JSON.stringify(dataToSave, null, 2))

    console.log('Event converted to database and removed from JSON:', dbEvent.id)

    return NextResponse.json({ 
      success: true, 
      event: dbEvent,
      message: 'Event converted to database successfully'
    })

  } catch (error) {
    console.error('Error converting event to database:', error)
    return NextResponse.json(
      { error: 'Failed to convert event', details: error.message },
      { status: 500 }
    )
  }
}