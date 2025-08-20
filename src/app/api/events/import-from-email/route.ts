import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateEventSlug } from '@/lib/slug'

// Interface for Mailparser webhook payload
interface MailparserEventData {
  // Common event fields that Mailparser will extract
  event_title?: string
  event_date?: string
  event_time?: string
  venue_name?: string
  venue_address?: string
  artists?: string
  genre?: string
  price?: string
  ticket_url?: string
  promoter?: string
  promoters?: string[] // Array of promoters for Facebook extension
  description?: string
  image_url?: string
  // Raw email content for fallback
  email_subject?: string
  email_body?: string
  from_email?: string
}

// Temporary storage for imported events (before manual review)
interface ImportedEvent {
  id: string
  status: 'pending_review' | 'approved' | 'rejected'
  source: 'mailparser' | 'facebook_extension' | 'facebook_bookmarklet'
  imported_at: string
  raw_data: MailparserEventData
  parsed_event?: {
    title: string
    date: string
    time: string
    venue: string
    artists: string[]
    genre: string
    price: string
    promoter: string
    promoters?: string[] // Array of available promoters for selection
    ticket_url?: string
    description?: string
    image_url?: string
  }
}

import { writeFileSync, readFileSync, existsSync } from 'fs'
import { join } from 'path'

// File-based storage for persistent data across server restarts
const IMPORT_DATA_FILE = join(process.cwd(), 'src/data/imported-events.json')

function loadImportedEvents(): ImportedEvent[] {
  try {
    if (existsSync(IMPORT_DATA_FILE)) {
      const data = readFileSync(IMPORT_DATA_FILE, 'utf8')
      return JSON.parse(data)
    }
  } catch (error) {
    console.error('Error loading imported events:', error)
  }
  return []
}

function saveImportedEvents(events: ImportedEvent[]) {
  try {
    writeFileSync(IMPORT_DATA_FILE, JSON.stringify(events, null, 2))
  } catch (error) {
    console.error('Error saving imported events:', error)
  }
}

// Add CORS headers for cross-origin requests from Facebook
function addCorsHeaders(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  return response
}

export async function OPTIONS(request: NextRequest) {
  return addCorsHeaders(new NextResponse(null, { status: 200 }))
}

export async function POST(request: NextRequest) {
  try {
    const data: MailparserEventData = await request.json()
    
    console.log('Received event import:', data)
    
    // Create imported event record
    const importedEvent: ImportedEvent = {
      id: generateId(),
      status: 'pending_review',
      source: data.source || 'mailparser',
      imported_at: new Date().toISOString(),
      raw_data: data,
      parsed_event: parseEventData(data)
    }
    
    // Load existing events and add new one
    const importedEvents = loadImportedEvents()
    importedEvents.push(importedEvent)
    saveImportedEvents(importedEvents)
    
    console.log('Event imported for review:', importedEvent.id)
    
    const response = NextResponse.json({ 
      success: true, 
      message: 'Event imported successfully',
      event_id: importedEvent.id
    })
    
    return addCorsHeaders(response)
    
  } catch (error) {
    console.error('Error processing event import:', error)
    const response = NextResponse.json(
      { error: 'Failed to process event import' },
      { status: 500 }
    )
    return addCorsHeaders(response)
  }
}

export async function GET(request: NextRequest) {
  // Return imported events for review dashboard
  const url = new URL(request.url)
  const status = url.searchParams.get('status') || 'pending_review'
  
  const importedEvents = loadImportedEvents()
  const filteredEvents = importedEvents.filter(event => 
    status === 'all' || event.status === status
  )
  
  return NextResponse.json({
    events: filteredEvents,
    count: filteredEvents.length
  })
}

export async function PUT(request: NextRequest) {
  // Handle approval/rejection of imported events
  try {
    const { eventId, action } = await request.json()
    console.log('Processing approval request:', { eventId, action })
    
    const importedEvents = loadImportedEvents()
    const eventIndex = importedEvents.findIndex(event => event.id === eventId)
    
    if (eventIndex === -1) {
      console.error('Event not found:', eventId)
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }
    
    const event = importedEvents[eventIndex]
    console.log('Found event for processing:', event.id)
    
    if (action === 'approve' && event.parsed_event) {
      console.log('Approving event, saving to main database...')
      // Save to main events database (events.json)
      await saveApprovedEventToDatabase(event)
      event.status = 'approved'
      console.log('Event approved and saved to main database:', event.id)
    } else if (action === 'reject') {
      event.status = 'rejected'
      console.log('Event rejected:', event.id)
    }
    
    importedEvents[eventIndex] = event
    saveImportedEvents(importedEvents)
    
    return NextResponse.json({ success: true, event })
    
  } catch (error) {
    console.error('Error updating event status:', error)
    console.error('Error details:', error.message, error.stack)
    return NextResponse.json({ 
      error: 'Failed to update event', 
      details: error.message 
    }, { status: 500 })
  }
}

async function saveApprovedEventToDatabase(importedEvent: ImportedEvent) {
  try {
    console.log('saveApprovedEventToDatabase: Starting approval process for:', importedEvent.id)
    console.log('saveApprovedEventToDatabase: Raw data image_url:', importedEvent.raw_data?.image_url)
    console.log('saveApprovedEventToDatabase: Parsed event image_url:', importedEvent.parsed_event?.image_url)
    
    // Use imported Prisma client for database operations
    
    try {
      const parsedEvent = importedEvent.parsed_event!
      const rawData = importedEvent.raw_data
      
      const finalImageUrl = rawData?.image_url || parsedEvent.image_url
      console.log('saveApprovedEventToDatabase: Final image URL to use:', finalImageUrl)
      
      // Create or find venue
      let venue = await prisma.venue.findFirst({
        where: { name: parsedEvent.venue }
      })
      
      if (!venue) {
        venue = await prisma.venue.create({
          data: {
            id: `venue-${Date.now()}`,
            name: parsedEvent.venue,
            address: '',
            city: '',
            state: '',
            zipCode: '',
            capacity: null,
            description: `Venue for ${parsedEvent.title}`,
            website: null,
            phone: null,
            email: null,
            accessibility: '{}',
            amenities: '{}'
          }
        })
        console.log('Created venue:', venue.name)
      }
      
      // Create or find artists
      const artistIds = []
      if (parsedEvent.artists && parsedEvent.artists.length > 0) {
        for (const artistData of parsedEvent.artists) {
          const artistName = artistData.name || artistData
          let artist = await prisma.artist.findFirst({
            where: { name: artistName }
          })
          
          if (!artist) {
            artist = await prisma.artist.create({
              data: {
                id: `artist-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                name: artistName,
                genre: artistData.genre || parsedEvent.genre || 'other',
                bio: `Artist performing at ${parsedEvent.title}`,
                hometown: '',
                website: null
              }
            })
            console.log('Created artist:', artist.name)
          }
          artistIds.push(artist.id)
        }
      } else if (parsedEvent.promoter) {
        // Use promoter as artist if no artists specified
        let artist = await prisma.artist.findFirst({
          where: { name: parsedEvent.promoter }
        })
        
        if (!artist) {
          artist = await prisma.artist.create({
            data: {
              id: `artist-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              name: parsedEvent.promoter,
              genre: parsedEvent.genre || 'other',
              bio: `Promoter/Artist for ${parsedEvent.title}`,
              hometown: '',
              website: null
            }
          })
          console.log('Created artist from promoter:', artist.name)
        }
        artistIds.push(artist.id)
      }
      
      // Create event in database with unique slug
      let eventSlug = generateEventSlug(parsedEvent.title, parsedEvent.date, parsedEvent.venue)
      
      // Check if slug already exists and append number if needed
      let slugSuffix = 1;
      let uniqueSlug = eventSlug;
      while (true) {
        const existingEvent = await prisma.event.findUnique({
          where: { slug: uniqueSlug }
        });
        
        if (!existingEvent) {
          eventSlug = uniqueSlug;
          break;
        }
        
        uniqueSlug = `${eventSlug}-${slugSuffix}`;
        slugSuffix++;
      }
      
      console.log('saveApprovedEventToDatabase: Using unique slug:', eventSlug);
      
      const dbEvent = await prisma.event.create({
        data: {
          id: `db-${Date.now()}`,
          title: parsedEvent.title,
          slug: eventSlug,
          description: rawData?.description || parsedEvent.description || 
            `Join us for an exciting live music event at ${parsedEvent.venue}. ${parsedEvent.artists && parsedEvent.artists.length > 0 ? `Featuring performances by ${parsedEvent.artists.join(', ')}.` : ''} Organized by ${parsedEvent.promoters && parsedEvent.promoters.length > 0 ? parsedEvent.promoters.join(', ') : parsedEvent.promoter}.`,
          date: convertDateFormat(parsedEvent.date),
          time: convertTimeFormat(parsedEvent.time),
          endTime: null,
          genre: parsedEvent.genre || 'other',
          category: 'concert',
          promoter: parsedEvent.promoters && parsedEvent.promoters.length > 0 
            ? parsedEvent.promoters.join(', ') 
            : (parsedEvent.promoter || ''),
          ticketUrl: parsedEvent.ticket_url || '',
          facebookEvent: rawData?.facebook_url || '',
          instagramPost: '',
          flyer: finalImageUrl || '',
          price: parsedEvent.price || '',
          ageRestriction: '',
          featured: false,
          status: 'upcoming',
          tags: JSON.stringify([parsedEvent.genre]),
          venueId: venue.id,
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
      
      console.log('saveApprovedEventToDatabase: Event saved to PostgreSQL database:', {
        id: dbEvent.id,
        title: dbEvent.title,
        flyer: dbEvent.flyer,
        venue: dbEvent.venue.name,
        artistCount: dbEvent.artists.length
      })
      
      return dbEvent
      
    } finally {
      await prisma.$disconnect()
    }
    
  } catch (error) {
    console.error('Error saving event to PostgreSQL database:', error)
    throw error
  }
}

function convertDateFormat(dateString: string): string {
  try {
    // Handle empty or invalid date strings
    if (!dateString || dateString.trim() === '') {
      console.log('Empty date string, using today as fallback')
      return new Date().toISOString().split('T')[0]
    }
    
    // Convert "Friday, October 31, 2025" to "2025-10-31"
    const date = new Date(dateString)
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.error('Invalid date string:', dateString)
      return new Date().toISOString().split('T')[0]
    }
    
    return date.toISOString().split('T')[0]
  } catch (error) {
    console.error('Error converting date:', error)
    return new Date().toISOString().split('T')[0] // Fallback to today
  }
}

function convertTimeFormat(timeString: string): string {
  try {
    // Handle empty or invalid time strings
    if (!timeString || timeString.trim() === '') {
      console.log('Empty time string, using default 8pm')
      return '20:00'
    }
    
    // If the time string is very long (malformed data), use default
    if (timeString.length > 50) {
      console.log('Malformed time string (too long):', timeString.substring(0, 50) + '...')
      return '20:00'
    }
    
    // Convert "8pm" to "20:00"
    if (timeString.toLowerCase().includes('pm')) {
      const hour = parseInt(timeString.replace(/[^\d]/g, ''))
      if (isNaN(hour) || hour < 1 || hour > 12) {
        return '20:00' // Default fallback
      }
      return hour === 12 ? '12:00' : `${hour + 12}:00`
    } else if (timeString.toLowerCase().includes('am')) {
      const hour = parseInt(timeString.replace(/[^\d]/g, ''))
      if (isNaN(hour) || hour < 1 || hour > 12) {
        return '08:00' // Default fallback
      }
      return hour === 12 ? '00:00' : `${hour.toString().padStart(2, '0')}:00`
    }
    
    // Try to parse HH:MM format
    if (timeString.match(/^\d{1,2}:\d{2}$/)) {
      return timeString
    }
    
    console.log('Unrecognized time format:', timeString)
    return '20:00' // Default to 8pm
  } catch (error) {
    console.error('Error converting time:', error)
    return '20:00' // Default to 8pm
  }
}

function extractPriceNumber(priceString: string): number {
  const match = priceString.match(/\$?(\d+)/)
  return match ? parseInt(match[1]) : 0
}

function generateEventId(): string {
  return 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
}

// Helper function to parse data into structured event (handles both Mailparser and Facebook extension data)
function parseEventData(data: any) {
  try {
    // Handle Facebook extension data format
    if (data.source === 'facebook_extension' || data.source === 'facebook_bookmarklet') {
      const parsed = {
        title: data.event_title || 'Untitled Event',
        date: data.event_date || '',
        time: data.event_time || '',
        venue: data.venue_name || '',
        artists: data.artists ? parseArtists(data.artists) : [data.event_title || 'Unknown Artist'],
        genre: data.genre || 'other',
        price: data.price || '',
        promoter: data.promoter || '',
        promoters: data.promoters || [], // Include promoters array for dashboard selection
        ticket_url: data.ticket_url || '',
        image_url: data.image_url || ''
      }
      return parsed
    }
    
    // Handle Mailparser email data format
    const parsed = {
      title: data.event_title || extractTitleFromSubject(data.email_subject),
      date: data.event_date || extractDateFromContent(data.email_body),
      time: data.event_time || extractTimeFromContent(data.email_body),
      venue: data.venue_name || extractVenueFromContent(data.email_body),
      artists: parseArtists(data.artists || ''),
      genre: mapGenre(data.genre || inferGenreFromContent(data.email_body)),
      price: data.price || extractPriceFromContent(data.email_body),
      promoter: data.promoter || inferPromoterFromEmail(data.from_email),
      ticket_url: data.ticket_url || extractTicketUrlFromContent(data.email_body),
      image_url: data.image_url || ''
    }
    
    return parsed
  } catch (error) {
    console.error('Error parsing event data:', error)
    return null
  }
}

// Helper functions for data extraction
function extractTitleFromSubject(subject?: string): string {
  if (!subject) return 'Untitled Event'
  // Remove common email prefixes
  return subject
    .replace(/^(event alert|upcoming show):/i, '')
    .trim()
}

function extractDateFromContent(content?: string): string {
  if (!content) return ''
  
  // Common date patterns in emails
  const datePatterns = [
    /(\w+day,?\s+\w+\s+\d{1,2})/i,
    /(\d{1,2}\/\d{1,2}\/\d{4})/,
    /(\d{4}-\d{2}-\d{2})/
  ]
  
  for (const pattern of datePatterns) {
    const match = content.match(pattern)
    if (match) return match[1]
  }
  
  return ''
}

function extractTimeFromContent(content?: string): string {
  if (!content) return ''
  
  const timePatterns = [
    /(\d{1,2}:\d{2}\s*(?:AM|PM))/i,
    /(\d{1,2}\s*(?:AM|PM))/i
  ]
  
  for (const pattern of timePatterns) {
    const match = content.match(pattern)
    if (match) return match[1]
  }
  
  return ''
}

function extractVenueFromContent(content?: string): string {
  if (!content) return ''
  
  // Look for venue patterns
  const venuePatterns = [
    /(?:at|@)\s+([A-Z][^,\n]+)/i,
    /venue:\s*([^\n]+)/i
  ]
  
  for (const pattern of venuePatterns) {
    const match = content.match(pattern)
    if (match) return match[1].trim()
  }
  
  return ''
}

function parseArtists(artistString: string): string[] {
  if (!artistString) return []
  
  // Split by common separators
  return artistString
    .split(/[,+&]|\s+ft\.?\s+|\s+feat\.?\s+|\s+with\s+/i)
    .map(artist => artist.trim())
    .filter(artist => artist.length > 0)
}

function mapGenre(genre: string): string {
  const genreMap: Record<string, string> = {
    'house': 'house',
    'deep house': 'house',
    'tech house': 'house',
    'drum and bass': 'drum-and-bass',
    'dnb': 'drum-and-bass',
    'uk garage': 'ukg',
    'garage': 'ukg',
    'dubstep': 'dubstep',
    'trance': 'trance',
    'progressive trance': 'trance',
    'techno': 'techno',
    'electronic': 'other'
  }
  
  const lowerGenre = genre.toLowerCase()
  return genreMap[lowerGenre] || 'other'
}

function inferGenreFromContent(content?: string): string {
  if (!content) return 'other'
  
  const contentLower = content.toLowerCase()
  
  if (contentLower.includes('house')) return 'house'
  if (contentLower.includes('drum') && contentLower.includes('bass')) return 'drum-and-bass'
  if (contentLower.includes('garage')) return 'ukg'
  if (contentLower.includes('dubstep')) return 'dubstep'
  if (contentLower.includes('trance')) return 'trance'
  if (contentLower.includes('techno')) return 'techno'
  
  return 'other'
}

function extractPriceFromContent(content?: string): string {
  if (!content) return ''
  
  const pricePatterns = [
    /\$\d+(?:-\$?\d+)?/,
    /free/i,
    /no cover/i
  ]
  
  for (const pattern of pricePatterns) {
    const match = content.match(pattern)
    if (match) return match[0]
  }
  
  return ''
}

function extractTicketUrlFromContent(content?: string): string {
  if (!content) return ''
  
  const urlPattern = /https?:\/\/[^\s<>"{}|\\^`[\]]+/g
  const urls = content.match(urlPattern) || []
  
  // Look for ticket-related URLs
  const ticketUrls = urls.filter(url => 
    /ticket|event|buy|purchase/i.test(url)
  )
  
  return ticketUrls[0] || ''
}

function inferPromoterFromEmail(email?: string): string {
  if (!email) return ''
  
  const domain = email.split('@')[1]?.toLowerCase()
  
  // Map email domains to promoters
  const promoterMap: Record<string, string> = {
    'downtownmusic.com': 'Downtown Music Collective',
    'undergroundcollective.com': 'Underground Music Collective',
    'basslineevents.com': 'Bassline Events',
    'clubcircuit.com': 'Club Circuit',
    'communitycollective.com': 'Community Collective'
  }
  
  return promoterMap[domain] || ''
}

function generateId(): string {
  return 'import_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
}