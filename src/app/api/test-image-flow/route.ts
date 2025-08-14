import { NextRequest, NextResponse } from 'next/server'

// Test endpoint to verify the complete image flow
export async function POST(request: NextRequest) {
  try {
    // Create a test event with a known working image URL
    const testImageUrl = 'https://telegra.ph/file/d5fb5c5f5f5f5f5f5f5f5.jpg' // Replace with actual test image
    
    const testEventData = {
      source: 'facebook_extension',
      event_title: 'TEST: Image Flow Verification Event',
      event_date: '2025-08-15',
      event_time: '8:00 PM',
      venue_name: 'Test Venue',
      promoter: 'Test Promoter',
      genre: 'electronic',
      description: 'This is a test event to verify the image flow works correctly.',
      image_url: testImageUrl,
      ticket_url: 'https://example.com/tickets',
      facebook_url: 'https://facebook.com/events/test123',
      extracted_at: new Date().toISOString()
    }
    
    console.log('TEST: Creating test import with image:', testImageUrl)
    
    // Step 1: Import to review system
    const importResponse = await fetch(`${request.nextUrl.origin}/api/events/import-from-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testEventData)
    })
    
    if (!importResponse.ok) {
      throw new Error('Failed to import test event')
    }
    
    const importData = await importResponse.json()
    console.log('TEST: Import successful, event ID:', importData.event_id)
    
    // Step 2: Auto-approve the test event
    const approveResponse = await fetch(`${request.nextUrl.origin}/api/events/import-from-email`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        eventId: importData.event_id, 
        action: 'approve' 
      })
    })
    
    if (!approveResponse.ok) {
      throw new Error('Failed to approve test event')
    }
    
    const approveData = await approveResponse.json()
    console.log('TEST: Approval successful, checking final event...')
    
    // Step 3: Verify the event was created with correct image
    const verifyResponse = await fetch(`${request.nextUrl.origin}/api/events/json`)
    if (verifyResponse.ok) {
      const eventsData = await verifyResponse.json()
      const events = eventsData.events || []
      const testEvent = events.find((e: any) => e.title.includes('TEST: Image Flow Verification'))
      
      if (testEvent) {
        console.log('TEST: Event found in database:', {
          id: testEvent.id,
          title: testEvent.title,
          flyer: testEvent.flyer,
          hasImage: !!testEvent.flyer
        })
        
        return NextResponse.json({
          success: true,
          message: 'Image flow test completed successfully',
          testEvent: {
            id: testEvent.id,
            title: testEvent.title,
            flyer: testEvent.flyer,
            hasImage: !!testEvent.flyer,
            imageWorking: testEvent.flyer === testImageUrl
          }
        })
      }
    }
    
    return NextResponse.json({
      success: false,
      message: 'Test event not found in final database'
    })
    
  } catch (error) {
    console.error('TEST: Image flow test failed:', error)
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}

// Get endpoint to check the current test events
export async function GET() {
  try {
    const response = await fetch('http://localhost:3002/api/events/json')
    if (response.ok) {
      const data = await response.json()
      const testEvents = (data.events || []).filter((e: any) => 
        e.title?.includes('TEST: Image Flow Verification')
      )
      
      return NextResponse.json({
        success: true,
        testEvents: testEvents.map((e: any) => ({
          id: e.id,
          title: e.title,
          flyer: e.flyer,
          hasImage: !!e.flyer,
          createdAt: e.createdAt
        }))
      })
    }
    
    return NextResponse.json({ success: false, error: 'Failed to fetch events' })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message })
  }
}