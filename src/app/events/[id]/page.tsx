'use client'

import { useState, useEffect, useMemo } from 'react'
import { useParams } from 'next/navigation'
import Layout from '@/components/Layout'
import { Event } from '@/types'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import EventCard from '@/components/EventCard'
import EventImage from '@/components/EventImage'
import { formatEventDateSafe, formatEventTime } from '@/lib/dateUtils'
import { 
  generateICSFile, 
  downloadICSFile, 
  parseEventDateTime, 
  shareEvent, 
  generateSocialShareUrls,
  generateCalendarUrls,
  type CalendarEvent 
} from '@/lib/eventUtils'

export default function EventDetailPage() {
  const { id } = useParams()
  const [event, setEvent] = useState<Event | null>(null)
  const [relatedEvents, setRelatedEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      loadEvent(id as string)
    }
  }, [id])

  const loadEvent = async (eventId: string) => {
    try {
      // Try to load from API first
      const response = await fetch(`/api/events/${eventId}`)
      if (response.ok) {
        const data = await response.json()
        setEvent(data.event)
        
        // Load related events from the same genre or venue
        loadRelatedEvents(data.event)
      } else {
        console.error('Event not found')
        notFound()
      }
    } catch (error) {
      console.error('Error loading event:', error)
      notFound()
    } finally {
      setLoading(false)
    }
  }

  const loadRelatedEvents = async (currentEvent: Event) => {
    try {
      let combinedEvents: Event[] = []
      
      // Load JSON events
      try {
        const jsonResponse = await fetch('/api/events/json')
        if (jsonResponse.ok) {
          const jsonData = await jsonResponse.json()
          combinedEvents.push(...(jsonData.events || []))
        }
      } catch (error) {
        console.error('Error loading JSON events:', error)
      }
      
      // Load database events
      try {
        const dbResponse = await fetch('/api/events?limit=50')
        if (dbResponse.ok) {
          const dbData = await dbResponse.json()
          combinedEvents.push(...(dbData.events || []))
        }
      } catch (error) {
        console.error('Error loading database events:', error)
      }
      
      // Filter related events (same genre or venue, excluding current event)
      const related = combinedEvents
        .filter(e => e.id !== currentEvent.id)
        .filter(e => 
          e.genre === currentEvent.genre || 
          e.venue?.id === currentEvent.venue?.id ||
          e.category === currentEvent.category
        )
        .slice(0, 3)
      
      setRelatedEvents(related)
    } catch (error) {
      console.error('Error loading related events:', error)
    }
  }

  // Move useMemo before any conditional returns
  const { isUpcoming, isPast } = useMemo(() => {
    if (!event) return { isUpcoming: false, isPast: true }
    const eventDate = new Date(event.date)
    const now = new Date()
    const upcoming = eventDate > now
    return { isUpcoming: upcoming, isPast: !upcoming }
  }, [event?.date])

  // Add to Calendar handler
  const handleAddToCalendar = () => {
    if (!event) return

    try {
      const { startDate, endDate } = parseEventDateTime(event.date, event.time || '')
      
      const calendarEvent: CalendarEvent = {
        title: event.title,
        description: event.description || '',
        startDate,
        endDate,
        location: `${event.venue.name}, ${event.venue.address || ''}`,
        url: window.location.href
      }

      // Generate ICS file
      const icsContent = generateICSFile(calendarEvent)
      const filename = `${event.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ics`
      
      // Download the file
      downloadICSFile(icsContent, filename)
      
      console.log('Calendar file downloaded successfully')
    } catch (error) {
      console.error('Error generating calendar file:', error)
      
      // Fallback: show calendar service options
      const { startDate, endDate } = parseEventDateTime(event.date, event.time || '')
      const calendarEvent: CalendarEvent = {
        title: event.title,
        description: event.description || '',
        startDate,
        endDate,
        location: `${event.venue.name}, ${event.venue.address || ''}`,
        url: window.location.href
      }
      
      const urls = generateCalendarUrls(calendarEvent)
      
      // Open Google Calendar as fallback
      window.open(urls.google, '_blank')
    }
  }

  // Share Event handler
  const handleShareEvent = async () => {
    if (!event) return

    const eventData = {
      title: event.title,
      description: event.description || `Join us for ${event.title} at ${event.venue.name}`,
      url: window.location.href
    }

    try {
      const shared = await shareEvent(eventData)
      
      if (!shared) {
        // If sharing failed, show social media options
        const socialUrls = generateSocialShareUrls(eventData)
        
        // Create a simple popup with sharing options
        const shareWindow = window.open('', 'share-popup', 'width=400,height=500,scrollbars=yes')
        if (shareWindow) {
          shareWindow.document.write(`
            <html>
              <head><title>Share Event</title></head>
              <body style="font-family: Arial, sans-serif; padding: 20px;">
                <h3>Share this event</h3>
                <div style="margin-bottom: 10px;">
                  <a href="${socialUrls.facebook}" target="_blank" style="display: block; padding: 10px; margin: 5px 0; background: #1877f2; color: white; text-decoration: none; border-radius: 5px;">Share on Facebook</a>
                </div>
                <div style="margin-bottom: 10px;">
                  <a href="${socialUrls.twitter}" target="_blank" style="display: block; padding: 10px; margin: 5px 0; background: #1da1f2; color: white; text-decoration: none; border-radius: 5px;">Share on Twitter</a>
                </div>
                <div style="margin-bottom: 10px;">
                  <a href="${socialUrls.whatsapp}" target="_blank" style="display: block; padding: 10px; margin: 5px 0; background: #25d366; color: white; text-decoration: none; border-radius: 5px;">Share on WhatsApp</a>
                </div>
                <div style="margin-bottom: 10px;">
                  <a href="${socialUrls.email}" style="display: block; padding: 10px; margin: 5px 0; background: #666; color: white; text-decoration: none; border-radius: 5px;">Share via Email</a>
                </div>
                <div style="margin-top: 20px;">
                  <input type="text" value="${eventData.url}" readonly style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 5px;">
                  <button onclick="navigator.clipboard.writeText('${eventData.url}').then(() => alert('Link copied!'))" style="margin-top: 10px; padding: 10px; background: #007cba; color: white; border: none; border-radius: 5px; cursor: pointer;">Copy Link</button>
                </div>
              </body>
            </html>
          `)
        }
      }
    } catch (error) {
      console.error('Error sharing event:', error)
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-music-neutral-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
              <div className="h-64 bg-music-neutral-200"></div>
              <div className="p-6">
                <div className="h-8 bg-music-neutral-200 rounded mb-4"></div>
                <div className="h-4 bg-music-neutral-200 rounded mb-2"></div>
                <div className="h-4 bg-music-neutral-200 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  if (!event) {
    notFound()
  }

  return (
    <Layout>
      <div className="min-h-screen bg-music-neutral-50">
        {/* Hero Section - Clean Flyer Display */}
        <div className="relative overflow-hidden h-[40vh]">
          {(event.flyer || event.bannerImage) && (
            <div className="w-full h-full">
              <EventImage
                src={event.flyer || event.bannerImage || ''}
                alt={event.title}
                width={1200}
                height={600}
                className="w-full h-full object-cover"
                category={event.category}
                genre={event.genre}
              />
            </div>
          )}
        </div>

        {/* Event Meta Information */}
        <div className="bg-gradient-to-r from-music-purple-50 to-music-purple-100 border-b border-music-neutral-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-music-purple-950 whitespace-nowrap overflow-hidden text-ellipsis max-w-full">{event.title}</h1>
              
              {/* Artists */}
              {event.artists && event.artists.length > 0 && (
                <div className="mb-6">
                  {event.artists.map((artist, index) => (
                    <span key={artist.id}>
                      <Link 
                        href={`/artists/${artist.id}`}
                        className="text-music-accent-600 hover:text-music-accent-700 font-semibold text-xl"
                      >
                        {artist.name}
                      </Link>
                      {index < event.artists.length - 1 && <span className="text-music-neutral-400 mx-2">•</span>}
                    </span>
                  ))}
                </div>
              )}

              {/* Sub-genres */}
              {event.subGenres && event.subGenres.length > 0 && (
                <div className="mb-6 flex justify-center items-center gap-3 flex-wrap">
                  <div className="flex justify-center items-center gap-3 flex-wrap">
                    {event.subGenres.map((subGenre) => (
                      <span key={subGenre} className="inline-block text-white px-4 py-2 rounded-full text-sm font-medium capitalize" style={{ backgroundColor: 'rgb(76, 98, 134)' }}>
                        {subGenre.replace('-', ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Date & Venue */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="flex items-center justify-center text-music-neutral-700">
                  <svg className="w-5 h-5 mr-2 text-music-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="font-medium">{formatEventDateSafe(event.date)}</span>
                </div>
                <div className="flex items-center justify-center text-music-neutral-700">
                  <svg className="w-5 h-5 mr-2 text-music-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium">{formatEventTime(event.time)}{event.endTime && ` - ${formatEventTime(event.endTime)}`}</span>
                </div>
                <div className="flex items-center justify-center text-music-neutral-700">
                  <svg className="w-5 h-5 mr-2 text-music-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <Link 
                    href={`/venues/${event.venue.id}`}
                    className="font-medium"
                    style={{ color: '#4C6286' }}
                    onMouseEnter={(e) => e.target.style.color = '#3a4c66'}
                    onMouseLeave={(e) => e.target.style.color = '#4C6286'}
                  >
                    {event.venue.name}
                  </Link>
                </div>
              </div>

              {/* Price & Age Restriction */}
              {(event.price || event.ageRestriction) && (
                <div className="flex justify-center space-x-6 mt-6 text-music-neutral-700">
                  {event.price && (
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-2 text-music-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                      <span className="font-medium">{event.price}</span>
                    </div>
                  )}
                  {event.ageRestriction && (
                    <div className="flex items-center">
                      <span className="text-music-neutral-600 mr-2">Age:</span>
                      <span className="font-medium">{event.ageRestriction}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-gradient-to-r from-music-purple-50 to-music-purple-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Event Details */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                <h2 className="text-2xl font-bold text-music-purple-950 mb-6">About This Event</h2>
                
                {event.description && (
                  <div className="prose prose-lg text-music-neutral-700 mb-8">
                    <p>{event.description}</p>
                  </div>
                )}

                {/* Tags */}
                {event.tags && event.tags.length > 0 && (
                  <div className="border-t border-music-neutral-200 pt-6">
                    <h3 className="font-semibold text-music-purple-900 mb-3">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {event.tags.map((tag) => (
                        <span key={tag} className="bg-music-neutral-100 text-music-neutral-700 px-3 py-1 rounded-full text-sm">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Artists Section */}
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-music-purple-950 mb-6">Featured Artists</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {event.artists.map((artist) => (
                    <Link key={artist.id} href={`/artists/${artist.id}`} className="group">
                      <div className="flex items-center space-x-4 p-4 rounded-lg border border-music-neutral-200 group-hover:border-music-purple-300 transition-colors duration-200">
                        <div className="w-16 h-16 bg-gradient-to-br from-music-accent-100 to-music-purple-100 rounded-full flex items-center justify-center">
                          {artist.image ? (
                            <Image
                              src={artist.image}
                              alt={artist.name}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover rounded-full"
                            />
                          ) : (
                            <span className="text-2xl">🎤</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-music-purple-950 group-hover:text-music-purple-600">
                            {artist.name}
                          </h3>
                          <p className="text-sm text-music-neutral-600 capitalize">
                            {artist.genre.replace('-', ' ')}
                          </p>
                          {artist.hometown && (
                            <p className="text-xs text-music-neutral-500">
                              📍 {artist.hometown}
                            </p>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Action Buttons */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <div className="space-y-4">
                  {event.ticketUrl && isUpcoming && event.status !== 'sold-out' && (
                    <a
                      href={event.ticketUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full text-white text-center py-3 px-4 rounded-lg font-semibold transition-colors duration-200"
                      style={{ backgroundColor: 'rgb(0, 43, 136)', borderColor: 'rgb(0, 43, 136)' }}
                      onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = 'rgb(0, 35, 110)'}
                      onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = 'rgb(0, 43, 136)'}
                    >
                      Buy Tickets 🎫
                    </a>
                  )}
                  
                  {event.facebookEvent && (
                    <a
                      href={event.facebookEvent}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-3 px-4 rounded-lg font-semibold transition-colors duration-200"
                    >
                      Facebook RSVP 📘
                    </a>
                  )}
                  
                  <button 
                    onClick={handleAddToCalendar}
                    className="w-full bg-music-purple-100 hover:bg-music-purple-200 text-music-purple-700 py-3 px-4 rounded-lg font-semibold transition-colors duration-200"
                  >
                    Add to Calendar 📅
                  </button>
                  
                  <button 
                    onClick={handleShareEvent}
                    className="w-full bg-music-neutral-100 hover:bg-music-neutral-200 text-music-neutral-700 py-3 px-4 rounded-lg font-semibold transition-colors duration-200"
                  >
                    Share Event 📱
                  </button>
                </div>
              </div>

              {/* Venue Details */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="font-bold text-music-purple-950 mb-4">Venue Details</h3>
                <div className="space-y-4">
                  <Link href={`/venues/${event.venue.id}`} className="block group">
                    <h4 className="font-semibold group-hover:opacity-80" style={{ color: '#4C6286' }}>
                      {event.venue.name}
                    </h4>
                  </Link>
                  
                  {(event.venue.address || event.venue.city) && (
                    <div>
                      <p className="text-sm text-music-neutral-600 mb-2">
                        {event.venue.address && (
                          <>
                            {event.venue.address}<br />
                          </>
                        )}
                        {event.venue.city && event.venue.state && (
                          <>{event.venue.city}, {event.venue.state}</>
                        )}
                        {event.venue.zipCode && ` ${event.venue.zipCode}`}
                      </p>
                      
                      {/* Get Directions Button */}
                      {(event.venue.address || event.venue.city) && (
                        <a
                          href={`https://maps.google.com/maps?q=${encodeURIComponent(
                            `${event.venue.address || ''} ${event.venue.city || ''} ${event.venue.state || ''} ${event.venue.zipCode || ''}`.trim()
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-sm font-medium"
                          style={{ color: '#4C6286' }}
                          onMouseEnter={(e) => e.target.style.color = '#3a4c66'}
                          onMouseLeave={(e) => e.target.style.color = '#4C6286'}
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Get Directions
                        </a>
                      )}
                    </div>
                  )}
                  
                  {event.venue.phone && (
                    <div className="flex items-center text-sm text-music-neutral-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <a href={`tel:${event.venue.phone}`} className="hover:text-music-purple-600">
                        {event.venue.phone}
                      </a>
                    </div>
                  )}
                  
                  {event.venue.website && (
                    <div className="flex items-center text-sm">
                      <svg className="w-4 h-4 mr-2 text-music-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      <a 
                        href={event.venue.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium"
                        style={{ color: '#4C6286' }}
                        onMouseEnter={(e) => e.target.style.color = '#3a4c66'}
                        onMouseLeave={(e) => e.target.style.color = '#4C6286'}
                      >
                        Visit Website
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>

        {/* Related Events */}
        {relatedEvents.length > 0 && (
          <div className="bg-music-neutral-100 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold text-music-purple-950 mb-8">You Might Also Like</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedEvents.map((relatedEvent) => (
                  <EventCard key={relatedEvent.id} event={relatedEvent} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}