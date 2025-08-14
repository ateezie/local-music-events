import { NextRequest, NextResponse } from 'next/server'

// Interface for parsed ICS event data
interface ICSEvent {
  uid: string
  summary: string
  description?: string
  dtstart: string
  dtend?: string
  location?: string
  organizer?: string
  url?: string
  categories?: string[]
}

// Parse .ics file content
function parseICSContent(icsContent: string): ICSEvent[] {
  const events: ICSEvent[] = []
  
  // Split by VEVENT blocks
  const eventBlocks = icsContent.split('BEGIN:VEVENT')
  
  for (let i = 1; i < eventBlocks.length; i++) {
    const eventBlock = eventBlocks[i]
    const endIndex = eventBlock.indexOf('END:VEVENT')
    
    if (endIndex === -1) continue
    
    const eventContent = eventBlock.substring(0, endIndex)
    const event = parseEventBlock(eventContent)
    
    if (event) {
      events.push(event)
    }
  }
  
  return events
}

function parseEventBlock(eventContent: string): ICSEvent | null {
  const lines = eventContent.split('\n')
  const event: Partial<ICSEvent> = {}
  
  let currentProperty = ''
  let currentValue = ''
  
  for (const line of lines) {
    const trimmedLine = line.trim()
    
    if (!trimmedLine) continue
    
    // Handle line continuations (lines starting with space or tab)
    if (trimmedLine.startsWith(' ') || trimmedLine.startsWith('\t')) {
      currentValue += trimmedLine.substring(1)
      continue
    }
    
    // Process previous property if we have one
    if (currentProperty) {
      processProperty(event, currentProperty, currentValue)
    }
    
    // Parse new property
    const colonIndex = trimmedLine.indexOf(':')
    if (colonIndex === -1) continue
    
    currentProperty = trimmedLine.substring(0, colonIndex)
    currentValue = trimmedLine.substring(colonIndex + 1)
  }
  
  // Process the last property
  if (currentProperty) {
    processProperty(event, currentProperty, currentValue)
  }
  
  // Validate required fields
  if (!event.uid || !event.summary || !event.dtstart) {
    return null
  }
  
  return event as ICSEvent
}

function processProperty(event: Partial<ICSEvent>, property: string, value: string) {
  // Remove parameters from property name (e.g., "DTSTART;TZID=..." becomes "DTSTART")
  const propName = property.split(';')[0]
  
  switch (propName) {
    case 'UID':
      event.uid = value
      break
    case 'SUMMARY':
      event.summary = unescapeText(value)
      break
    case 'DESCRIPTION':
      event.description = unescapeText(value)
      break
    case 'DTSTART':
      event.dtstart = parseDateTime(value)
      break
    case 'DTEND':
      event.dtend = parseDateTime(value)
      break
    case 'LOCATION':
      event.location = unescapeText(value)
      break
    case 'ORGANIZER':
      // Extract organizer name from "CN=Name" format or email
      const cnMatch = value.match(/CN=([^;:]+)/)
      if (cnMatch) {
        event.organizer = unescapeText(cnMatch[1])
      } else if (value.startsWith('mailto:')) {
        event.organizer = value.substring(7)
      } else {
        event.organizer = unescapeText(value)
      }
      break
    case 'URL':
      event.url = value
      break
    case 'CATEGORIES':
      event.categories = value.split(',').map(cat => cat.trim())
      break
  }
}

function unescapeText(text: string): string {
  return text
    .replace(/\\n/g, '\n')
    .replace(/\\t/g, '\t')
    .replace(/\\r/g, '\r')
    .replace(/\\,/g, ',')
    .replace(/\\;/g, ';')
    .replace(/\\\\/g, '\\')
}

function parseDateTime(dateTime: string): string {
  // Handle various datetime formats
  // 20250815T200000Z (UTC)
  // 20250815T200000 (local)
  // 20250815 (date only)
  
  const cleanDateTime = dateTime.replace(/[^0-9T]/g, '')
  
  if (cleanDateTime.length >= 8) {
    const year = cleanDateTime.substring(0, 4)
    const month = cleanDateTime.substring(4, 6)
    const day = cleanDateTime.substring(6, 8)
    
    if (cleanDateTime.length >= 15 && cleanDateTime.includes('T')) {
      const hour = cleanDateTime.substring(9, 11)
      const minute = cleanDateTime.substring(11, 13)
      const second = cleanDateTime.substring(13, 15) || '00'
      
      return `${year}-${month}-${day}T${hour}:${minute}:${second}`
    } else {
      return `${year}-${month}-${day}`
    }
  }
  
  return dateTime
}

// Convert ICS event to our event format
function convertToEventFormat(icsEvent: ICSEvent) {
  // Extract date and time from datetime string
  let eventDate = ''
  let eventTime = ''
  
  if (icsEvent.dtstart) {
    if (icsEvent.dtstart.includes('T')) {
      const [datePart, timePart] = icsEvent.dtstart.split('T')
      eventDate = datePart
      eventTime = timePart.substring(0, 5) // HH:MM format
    } else {
      eventDate = icsEvent.dtstart
    }
  }
  
  // Auto-detect genre from event content
  const content = (icsEvent.summary + ' ' + (icsEvent.description || '') + ' ' + (icsEvent.categories?.join(' ') || '')).toLowerCase()
  
  const genreKeywords = {
    'house': ['house', 'deep house', 'tech house', 'progressive house'],
    'drum-and-bass': ['drum and bass', 'dnb', 'liquid', 'neurofunk'],
    'ukg': ['uk garage', 'garage', 'ukg', '2-step'],
    'dubstep': ['dubstep', 'bass music', 'riddim', 'future bass'],
    'trance': ['trance', 'progressive trance', 'uplifting', 'psytrance'],
    'techno': ['techno', 'minimal', 'industrial', 'detroit techno']
  }
  
  let detectedGenre = 'other'
  for (const [genre, keywords] of Object.entries(genreKeywords)) {
    if (keywords.some(keyword => content.includes(keyword))) {
      detectedGenre = genre
      break
    }
  }
  
  return {
    source: 'ics_upload',
    event_title: icsEvent.summary,
    event_date: eventDate,
    event_time: eventTime,
    venue_name: icsEvent.location || '',
    promoter: icsEvent.organizer || '',
    genre: detectedGenre,
    description: icsEvent.description || '',
    ticket_url: icsEvent.url || '',
    uid: icsEvent.uid,
    categories: icsEvent.categories || [],
    imported_at: new Date().toISOString()
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('icsFile') as File
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      )
    }
    
    // Validate file type
    if (!file.name.endsWith('.ics')) {
      return NextResponse.json(
        { error: 'Please upload a .ics calendar file' },
        { status: 400 }
      )
    }
    
    // Read file content
    const fileContent = await file.text()
    
    if (!fileContent.includes('BEGIN:VCALENDAR')) {
      return NextResponse.json(
        { error: 'Invalid .ics file format' },
        { status: 400 }
      )
    }
    
    // Parse events from ICS content
    const icsEvents = parseICSContent(fileContent)
    
    if (icsEvents.length === 0) {
      return NextResponse.json(
        { error: 'No events found in the .ics file' },
        { status: 400 }
      )
    }
    
    // Convert to our event format
    const convertedEvents = icsEvents.map(convertToEventFormat)
    
    // Here you would typically save to your import review system
    // For now, we'll return the parsed events for review
    
    console.log(`Successfully parsed ${convertedEvents.length} events from .ics file`)
    
    return NextResponse.json({
      success: true,
      message: `Successfully parsed ${convertedEvents.length} events from .ics file`,
      events: convertedEvents,
      filename: file.name,
      fileSize: file.size
    })
    
  } catch (error) {
    console.error('Error processing .ics file:', error)
    return NextResponse.json(
      { 
        error: 'Failed to process .ics file', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}