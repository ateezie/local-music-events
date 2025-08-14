'use client'

import { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import { Event } from '@/types'
import Link from 'next/link'
import Image from 'next/image'

interface Venue {
  id: string
  name: string
  address: string
  city: string
  state: string
  zipCode?: string
  capacity?: number
  description?: string
  website?: string
  image?: string
}

interface VenueWithEvents extends Venue {
  upcomingEvents: Event[]
}

export default function VenuesPage() {
  const [venues, setVenues] = useState<VenueWithEvents[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ totalVenues: 0, totalEvents: 0, upcomingEvents: 0 })

  useEffect(() => {
    const loadVenues = async () => {
      try {
        let combinedEvents: Event[] = []
        
        // Load JSON events
        try {
          const jsonResponse = await fetch('/api/events/json')
          if (jsonResponse.ok) {
            const jsonData = await jsonResponse.json()
            const jsonEvents = (jsonData.events || []).map((event: any) => ({
              ...event,
              _source: 'json'
            }))
            combinedEvents.push(...jsonEvents)
          }
        } catch (error) {
          console.error('Error loading JSON events:', error)
        }
        
        // Load database events  
        try {
          const dbResponse = await fetch('/api/events?limit=100')
          if (dbResponse.ok) {
            const dbData = await dbResponse.json()
            const dbEvents = (dbData.events || []).map((event: any) => ({
              ...event,
              _source: 'database'
            }))
            combinedEvents.push(...dbEvents)
          }
        } catch (error) {
          console.error('Error loading database events:', error)
        }

        // Try to load venues from API
        let apiVenues: Venue[] = []
        try {
          const venuesResponse = await fetch('/api/venues')
          if (venuesResponse.ok) {
            const venuesData = await venuesResponse.json()
            apiVenues = venuesData.venues || []
          }
        } catch (error) {
          console.error('Error loading venues from API:', error)
        }
        
        // Extract unique venues from events if no API venues
        const venueMap = new Map<string, Venue>()
        
        // Add API venues first
        apiVenues.forEach(venue => {
          venueMap.set(venue.id, venue)
        })
        
        // Add venues from events
        combinedEvents.forEach(event => {
          if (event.venue && !venueMap.has(event.venue.id)) {
            venueMap.set(event.venue.id, {
              id: event.venue.id,
              name: event.venue.name,
              address: event.venue.address || '',
              city: event.venue.city || '',
              state: event.venue.state || '',
              capacity: event.venue.capacity
            })
          }
        })
        
        // Create venues with events
        const venuesWithEvents: VenueWithEvents[] = Array.from(venueMap.values()).map(venue => ({
          ...venue,
          upcomingEvents: combinedEvents.filter(event => 
            event.venue?.id === venue.id && new Date(event.date) >= new Date()
          ).slice(0, 5) // Limit to 5 upcoming events per venue
        }))
        
        setVenues(venuesWithEvents)
        setStats({
          totalVenues: venuesWithEvents.length,
          totalEvents: combinedEvents.length,
          upcomingEvents: combinedEvents.filter(e => new Date(e.date) >= new Date()).length
        })
      } catch (error) {
        console.error('Error loading venues:', error)
      } finally {
        setLoading(false)
      }
    }

    loadVenues()
  }, [])

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-music-neutral-50">
          <div className="bg-gradient-to-r from-music-blue-50 to-music-blue-100 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <div className="h-12 bg-music-neutral-200 rounded mb-6 animate-pulse"></div>
                <div className="h-6 bg-music-neutral-200 rounded mx-auto max-w-2xl animate-pulse"></div>
              </div>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 bg-music-neutral-200 rounded-lg animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="min-h-screen bg-music-neutral-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-music-blue-50 to-music-blue-100 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl font-bold text-music-purple-950 mb-4">
                Music Venues
              </h1>
              <p className="text-lg text-music-neutral-700 max-w-2xl mx-auto mb-8">
                Explore the best live music venues in your city. From intimate coffee shops to large concert halls.
              </p>
              
              {/* Stats */}
              <div className="flex justify-center space-x-8 text-center">
                <div>
                  <div className="text-2xl font-bold text-music-blue-600">{stats.totalVenues}</div>
                  <div className="text-sm text-music-neutral-600">Venues</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-music-purple-600">{stats.totalEvents}</div>
                  <div className="text-sm text-music-neutral-600">Total Events</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-music-accent-600">{stats.upcomingEvents}</div>
                  <div className="text-sm text-music-neutral-600">This Week</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Venues Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <p className="text-music-neutral-600">
              Discover {venues.length} amazing venues hosting live music events
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {venues.map((venue) => (
              <div key={venue.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
                {/* Venue Image */}
                <div className="h-48 bg-gradient-to-br from-music-purple-100 to-music-blue-100 flex items-center justify-center">
                  {venue.image ? (
                    <Image
                      src={venue.image}
                      alt={venue.name}
                      width={400}
                      height={200}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-music-neutral-400 text-center">
                      <svg className="w-16 h-16 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                      <p className="text-sm font-medium">{venue.name}</p>
                    </div>
                  )}
                </div>

                {/* Venue Info */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-music-purple-950">{venue.name}</h3>
                    {venue.capacity && (
                      <span className="text-sm text-music-neutral-500 bg-music-neutral-100 px-2 py-1 rounded">
                        {venue.capacity} cap
                      </span>
                    )}
                  </div>
                  
                  <p className="text-music-neutral-600 text-sm mb-3">
                    {venue.address}, {venue.city}, {venue.state}
                  </p>
                  
                  {venue.description && (
                    <p className="text-music-neutral-700 text-sm mb-4 line-clamp-2">
                      {venue.description}
                    </p>
                  )}

                  {/* Upcoming Events */}
                  <div className="border-t border-music-neutral-200 pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-music-purple-900 text-sm">Upcoming Events</h4>
                      <span className="text-xs text-music-neutral-500">
                        {venue.upcomingEvents.length} event{venue.upcomingEvents.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    
                    {venue.upcomingEvents.length > 0 ? (
                      <div className="space-y-2">
                        {venue.upcomingEvents.slice(0, 2).map((event) => (
                          <Link 
                            key={event.id} 
                            href={event.slug ? `/events/${event.slug}` : `/events/${event.id}`}
                            className="block text-xs text-music-neutral-600 hover:text-music-purple-600 transition-colors duration-200"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium truncate">{event.title}</span>
                              <span className="text-music-neutral-400 ml-2">
                                {new Date(event.date).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="text-music-accent-600 font-medium">{event.genre}</div>
                          </Link>
                        ))}
                        {venue.upcomingEvents.length > 2 && (
                          <Link 
                            href={`/venues/${venue.id}`}
                            className="text-xs text-music-purple-600 hover:text-music-purple-800 font-medium"
                          >
                            +{venue.upcomingEvents.length - 2} more events
                          </Link>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-music-neutral-500">No upcoming events</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-music-neutral-200">
                    <Link 
                      href={`/venues/${venue.id}`}
                      className="text-sm text-music-purple-600 hover:text-music-purple-800 font-medium"
                    >
                      View Details
                    </Link>
                    {venue.website && (
                      <a 
                        href={venue.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-music-neutral-600 hover:text-music-neutral-800"
                      >
                        Website ↗
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}