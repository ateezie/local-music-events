import { NextRequest, NextResponse } from 'next/server'
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

// GET /api/events/json - Get events from JSON file
export async function GET(request: NextRequest) {
  try {
    const eventsPath = join(process.cwd(), 'src/data/events.json')
    const eventsData = JSON.parse(readFileSync(eventsPath, 'utf8'))
    
    // Handle both flat array and {events: []} structure
    const events = Array.isArray(eventsData) ? eventsData : (eventsData.events || [])
    
    return NextResponse.json({
      events,
      count: events.length
    })
    
  } catch (error) {
    console.error('Error loading events from JSON:', error)
    return NextResponse.json(
      { error: 'Failed to load events' },
      { status: 500 }
    )
  }
}

// DELETE /api/events/json - Delete event from JSON file by ID  
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const eventId = searchParams.get('id')
    
    if (!eventId) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      )
    }

    const eventsPath = join(process.cwd(), 'src/data/events.json')
    const eventsData = JSON.parse(readFileSync(eventsPath, 'utf8'))
    
    // Handle both flat array and {events: []} structure
    const events = Array.isArray(eventsData) ? eventsData : (eventsData.events || [])
    
    // Find event index
    const eventIndex = events.findIndex((event: any) => event.id === eventId)
    
    if (eventIndex === -1) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    // Remove event
    events.splice(eventIndex, 1)
    
    // Save back to file with correct structure
    const dataToSave = Array.isArray(eventsData) ? events : { events }
    writeFileSync(eventsPath, JSON.stringify(dataToSave, null, 2))
    
    console.log('Event deleted from JSON:', eventId)
    
    return NextResponse.json({ success: true })
    
  } catch (error) {
    console.error('Error deleting event from JSON:', error)
    return NextResponse.json(
      { error: 'Failed to delete event' },
      { status: 500 }
    )
  }
}

// PUT /api/events/json - Update event in JSON file (for featured toggle, etc)
export async function PUT(request: NextRequest) {
  try {
    const { eventId, action, featured } = await request.json()
    
    if (!eventId) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      )
    }

    const eventsPath = join(process.cwd(), 'src/data/events.json')
    const eventsData = JSON.parse(readFileSync(eventsPath, 'utf8'))
    
    // Handle both flat array and {events: []} structure
    const events = Array.isArray(eventsData) ? eventsData : (eventsData.events || [])
    
    // Find event
    const eventIndex = events.findIndex((event: any) => event.id === eventId)
    
    if (eventIndex === -1) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    // Update event based on action
    if (action === 'toggleFeatured') {
      events[eventIndex].featured = featured
      console.log(`Event featured status updated: ${eventId} -> ${featured}`)
    } else {
      return NextResponse.json(
        { error: 'Unsupported action' },
        { status: 400 }
      )
    }

    // Save back to file with correct structure
    const dataToSave = Array.isArray(eventsData) ? events : { events }
    writeFileSync(eventsPath, JSON.stringify(dataToSave, null, 2))
    
    return NextResponse.json({ 
      success: true,
      event: events[eventIndex]
    })
    
  } catch (error) {
    console.error('Error updating event in JSON:', error)
    return NextResponse.json(
      { error: 'Failed to update event' },
      { status: 500 }
    )
  }
}