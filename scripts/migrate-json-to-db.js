#!/usr/bin/env node

/**
 * Migration script to transfer JSON data to the database
 * This script migrates events, venues, and artists from JSON files to the new Prisma database
 */

const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()

// Read JSON data files
const eventsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/events.json'), 'utf8')).events
const venuesData = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/venues.json'), 'utf8')).venues
const artistsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/artists.json'), 'utf8')).artists

// Create a default admin user for authoring
const DEFAULT_ADMIN = {
  id: 'admin-migration',
  name: 'Migration Admin',
  email: 'admin@localmusicevents.com',
  password: '$2a$10$placeholder', // This will need to be updated with real hash
  role: 'ADMIN'
}

// Predefined music genres with colors
const MUSIC_GENRES = [
  { id: 'rock', name: 'Rock', description: 'Rock music genre', color: '#FF6B35' },
  { id: 'indie-rock', name: 'Indie Rock', description: 'Independent rock music', color: '#E83F6F' },
  { id: 'punk', name: 'Punk', description: 'Punk rock music', color: '#FF1493' },
  { id: 'jazz', name: 'Jazz', description: 'Jazz music genre', color: '#FFD700' },
  { id: 'electronic', name: 'Electronic', description: 'Electronic dance music', color: '#00FFFF' },
  { id: 'hip-hop', name: 'Hip-Hop', description: 'Hip-hop and rap music', color: '#9370DB' },
  { id: 'blues', name: 'Blues', description: 'Blues music genre', color: '#4169E1' },
  { id: 'folk', name: 'Folk', description: 'Folk and acoustic music', color: '#CD853F' },
  { id: 'acoustic', name: 'Acoustic', description: 'Acoustic and singer-songwriter', color: '#8FBC8F' }
]

// Predefined event categories
const EVENT_CATEGORIES = [
  { id: 'concert', name: 'Concert', description: 'Live music concerts', emoji: '🎵' },
  { id: 'festival', name: 'Festival', description: 'Music festivals', emoji: '🎪' },
  { id: 'dj-set', name: 'DJ Set', description: 'DJ performances', emoji: '🎧' },
  { id: 'acoustic', name: 'Acoustic Show', description: 'Acoustic performances', emoji: '🎸' },
  { id: 'open-mic', name: 'Open Mic', description: 'Open mic nights', emoji: '🎤' },
  { id: 'album-release', name: 'Album Release', description: 'Album release parties', emoji: '💿' }
]

async function createAdminUser() {
  console.log('Creating default admin user...')
  
  const existingAdmin = await prisma.user.findUnique({
    where: { email: DEFAULT_ADMIN.email }
  })

  if (!existingAdmin) {
    await prisma.user.create({
      data: DEFAULT_ADMIN
    })
    console.log('✅ Default admin user created')
  } else {
    console.log('ℹ️  Admin user already exists')
  }
}

async function createGenresAndCategories() {
  console.log('Creating music genres and event categories...')
  
  // Create music genres
  for (const genre of MUSIC_GENRES) {
    const existing = await prisma.musicGenre.findUnique({
      where: { id: genre.id }
    })
    
    if (!existing) {
      await prisma.musicGenre.create({
        data: {
          ...genre
        }
      })
      console.log(`✅ Genre created: ${genre.name}`)
    } else {
      console.log(`ℹ️  Genre already exists: ${genre.name}`)
    }
  }

  // Create event categories
  for (const category of EVENT_CATEGORIES) {
    const existing = await prisma.eventCategory.findUnique({
      where: { id: category.id }
    })
    
    if (!existing) {
      await prisma.eventCategory.create({
        data: {
          ...category
        }
      })
      console.log(`✅ Category created: ${category.name}`)
    } else {
      console.log(`ℹ️  Category already exists: ${category.name}`)
    }
  }
}

async function migrateVenues() {
  console.log('Migrating venues...')
  
  for (const venue of venuesData) {
    const existing = await prisma.venue.findUnique({
      where: { id: venue.id }
    })
    
    if (!existing) {
      await prisma.venue.create({
        data: {
          id: venue.id,
          name: venue.name,
          address: venue.address,
          city: venue.city,
          state: venue.state,
          zipCode: venue.zipCode,
          capacity: venue.capacity,
          website: venue.website || null,
          phone: venue.phone || null,
          email: venue.email || null,
          description: venue.description || null,
          image: venue.image || null,
          facebook: venue.socialMedia?.facebook || null,
          instagram: venue.socialMedia?.instagram || null,
          twitter: venue.socialMedia?.twitter || null,
          latitude: venue.coordinates?.lat || null,
          longitude: venue.coordinates?.lng || null,
          amenities: JSON.stringify(venue.amenities || []),
          accessibility: JSON.stringify(venue.accessibility || []),
          authorId: DEFAULT_ADMIN.id
        }
      })
      console.log(`✅ Venue migrated: ${venue.name}`)
    } else {
      console.log(`ℹ️  Venue already exists: ${venue.name}`)
    }
  }
}

async function migrateArtists() {
  console.log('Migrating artists...')
  
  for (const artist of artistsData) {
    const existing = await prisma.artist.findUnique({
      where: { id: artist.id }
    })
    
    if (!existing) {
      await prisma.artist.create({
        data: {
          id: artist.id,
          name: artist.name,
          genre: artist.genre,
          bio: artist.bio || null,
          image: artist.image || null,
          website: artist.socialMedia?.website || null,
          hometown: artist.hometown || null,
          formed: artist.formed || null,
          facebook: artist.socialMedia?.facebook || null,
          instagram: artist.socialMedia?.instagram || null,
          twitter: artist.socialMedia?.twitter || null,
          tiktok: artist.socialMedia?.tiktok || null,
          youtube: artist.mediaLinks?.youtube || null,
          spotify: artist.mediaLinks?.spotify || null,
          bandcamp: artist.mediaLinks?.bandcamp || null,
          soundcloud: artist.mediaLinks?.soundcloud || null,
          members: JSON.stringify(artist.members || []),
          tags: JSON.stringify(artist.tags || []),
          authorId: DEFAULT_ADMIN.id
        }
      })
      console.log(`✅ Artist migrated: ${artist.name}`)
    } else {
      console.log(`ℹ️  Artist already exists: ${artist.name}`)
    }
  }
}

async function migrateEvents() {
  console.log('Migrating events...')
  
  for (const event of eventsData) {
    const existing = await prisma.event.findUnique({
      where: { id: event.id }
    })
    
    if (!existing) {
      // Create the event
      const createdEvent = await prisma.event.create({
        data: {
          id: event.id,
          title: event.title,
          description: event.description,
          date: event.date,
          time: event.time,
          endTime: event.endTime || null,
          genre: event.genre,
          category: event.category,
          promoter: event.promoter || null,
          ticketUrl: event.ticketUrl || null,
          facebookEvent: event.facebookEvent || null,
          instagramPost: event.instagramPost || null,
          flyer: event.flyer || null,
          price: event.price || null,
          ageRestriction: event.ageRestriction || null,
          featured: event.featured || false,
          status: event.status || 'upcoming',
          tags: JSON.stringify(event.tags || []),
          venueId: typeof event.venue === 'string' ? event.venue : event.venue.id,
          authorId: DEFAULT_ADMIN.id
        }
      })

      // Create artist relationships
      if (event.artists && Array.isArray(event.artists)) {
        for (const artist of event.artists) {
          const artistId = typeof artist === 'string' ? artist : artist.id
          await prisma.eventArtist.create({
            data: {
              eventId: event.id,
              artistId: artistId
            }
          })
        }
      }

      console.log(`✅ Event migrated: ${event.title}`)
    } else {
      console.log(`ℹ️  Event already exists: ${event.title}`)
    }
  }
}

async function main() {
  try {
    console.log('🚀 Starting JSON to Database migration...\n')

    await createAdminUser()
    console.log()

    await createGenresAndCategories()
    console.log()

    await migrateVenues()
    console.log()

    await migrateArtists()
    console.log()

    await migrateEvents()
    console.log()

    console.log('✅ Migration completed successfully!')
    console.log('\n📊 Migration Summary:')
    
    const eventCount = await prisma.event.count()
    const venueCount = await prisma.venue.count()
    const artistCount = await prisma.artist.count()
    const genreCount = await prisma.musicGenre.count()
    const categoryCount = await prisma.eventCategory.count()

    console.log(`   Events: ${eventCount}`)
    console.log(`   Venues: ${venueCount}`)
    console.log(`   Artists: ${artistCount}`)
    console.log(`   Genres: ${genreCount}`)
    console.log(`   Categories: ${categoryCount}`)

    console.log('\n📝 Next steps:')
    console.log('1. Start your development server: npm run dev')
    console.log('2. Visit http://localhost:3005/admin to login')
    console.log('3. Use credentials: admin@localmusicevents.com / (set password)')
    console.log('4. Your music events are now available via API endpoints!')

  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })