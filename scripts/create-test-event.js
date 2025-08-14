const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function createTestEvent() {
  try {
    // Create test user
    const user = await prisma.user.upsert({
      where: { email: 'admin@test.com' },
      update: {},
      create: {
        id: 'test-user-1',
        email: 'admin@test.com',
        password: 'hashed-password',
        name: 'Test Admin',
        role: 'admin'
      }
    })

    // Create test venue
    const venue = await prisma.venue.upsert({
      where: { id: 'test-venue-1' },
      update: {},
      create: {
        id: 'test-venue-1',
        name: 'Test Venue',
        address: '123 Test St',
        city: 'Test City',
        state: 'TS',
        authorId: user.id
      }
    })

    // Create test artist
    const artist = await prisma.artist.upsert({
      where: { id: 'test-artist-1' },
      update: {},
      create: {
        id: 'test-artist-1',
        name: 'Test Artist',
        genre: 'electronic',
        authorId: user.id
      }
    })

    // Create test event
    const event = await prisma.event.upsert({
      where: { id: 'test-event-1' },
      update: {},
      create: {
        id: 'test-event-1',
        title: 'Test Multi-Genre Event',
        description: 'A test event to verify hero functionality',
        date: '2025-12-31',
        time: '23:00',
        genre: 'multi-genre',
        subGenres: '["house", "electronic"]',
        category: 'dj-set',
        venueId: venue.id,
        featured: false,
        hero: false,
        status: 'upcoming',
        authorId: user.id
      }
    })

    // Create event-artist relationship
    await prisma.eventArtist.upsert({
      where: {
        eventId_artistId: {
          eventId: event.id,
          artistId: artist.id
        }
      },
      update: {},
      create: {
        eventId: event.id,
        artistId: artist.id
      }
    })

    console.log('✅ Test event created successfully:', event.id)
    console.log('📍 Access at: http://localhost:3000/admin/events/test-event-1/edit')
    
  } catch (error) {
    console.error('❌ Error creating test event:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createTestEvent()