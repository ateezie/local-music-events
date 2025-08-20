'use client'

import { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import { Event } from '@/types'
import Link from 'next/link'

interface Promoter {
  name: string
  eventCount: number
  upcomingEvents: Event[]
  genres: string[]
}

export default function PromotersPage() {
  const [promoters, setPromoters] = useState<Promoter[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ totalPromoters: 0, totalEvents: 0, upcomingEvents: 0 })

  useEffect(() => {
    const loadPromoters = async () => {
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
        
        // Extract promoters from events
        const promoterMap = new Map<string, {
          events: Event[]
          genres: Set<string>
        }>()
        
        combinedEvents.forEach(event => {
          // Handle both single promoter string and promoters array
          let eventPromoters: string[] = []
          
          if (event.promoters && Array.isArray(event.promoters)) {
            eventPromoters = event.promoters
          } else if (event.promoter && typeof event.promoter === 'string') {
            eventPromoters = event.promoter.split(', ').filter(p => p.trim())
          }
          
          eventPromoters.forEach(promoterName => {
            if (!promoterMap.has(promoterName)) {
              promoterMap.set(promoterName, { 
                events: [], 
                genres: new Set() 
              })
            }
            
            const promoterData = promoterMap.get(promoterName)!
            promoterData.events.push(event)
            if (event.genre) {
              promoterData.genres.add(event.genre)
            }
          })
        })
        
        // Create promoter objects
        const promoterList: Promoter[] = Array.from(promoterMap.entries()).map(([name, data]) => ({
          name,
          eventCount: data.events.length,
          upcomingEvents: data.events.filter(event => new Date(event.date) >= new Date()),
          genres: Array.from(data.genres).sort()
        })).sort((a, b) => b.eventCount - a.eventCount) // Sort by event count
        
        setPromoters(promoterList)
        setStats({
          totalPromoters: promoterList.length,
          totalEvents: combinedEvents.length,
          upcomingEvents: combinedEvents.filter(e => new Date(e.date) >= new Date()).length
        })
      } catch (error) {
        console.error('Error loading promoters:', error)
      } finally {
        setLoading(false)
      }
    }

    loadPromoters()
  }, [])

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-music-neutral-50">
          <div className="bg-gradient-to-r from-music-purple-50 to-music-purple-100 py-12">
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
        <div className="bg-gradient-to-r from-music-purple-50 to-music-purple-100 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl font-bold text-music-purple-950 mb-4">
                Music Promoters
              </h1>
              <p className="text-lg text-music-neutral-700 max-w-2xl mx-auto mb-8">
                Discover the promoters bringing live music to your city. From underground collectives to major event organizers.
              </p>
              
              {/* Stats */}
              <div className="flex justify-center space-x-8 text-center">
                <div>
                  <div className="text-2xl font-bold text-music-accent-600">{stats.totalPromoters}</div>
                  <div className="text-sm text-music-neutral-600">Promoters</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-music-purple-600">{stats.totalEvents}</div>
                  <div className="text-sm text-music-neutral-600">Total Events</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-music-blue-600">{stats.upcomingEvents}</div>
                  <div className="text-sm text-music-neutral-600">Upcoming</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Promoters Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <p className="text-music-neutral-600">
              Discover {promoters.length} active promoters organizing live music events
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {promoters.map((promoter) => (
              <div key={promoter.name} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
                {/* Promoter Header */}
                <div className="h-32 bg-gradient-to-br from-music-purple-100 to-music-purple-200 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-2 bg-music-accent-500 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                    </div>
                    <h3 className="text-sm font-medium text-music-purple-950">{promoter.name}</h3>
                  </div>
                </div>

                {/* Promoter Info */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-music-accent-600">{promoter.eventCount}</div>
                      <div className="text-xs text-music-neutral-600">Total Events</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-music-purple-600">{promoter.upcomingEvents.length}</div>
                      <div className="text-xs text-music-neutral-600">Upcoming</div>
                    </div>
                  </div>

                  {/* Genres */}
                  {promoter.genres.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-music-purple-900 mb-2">Genres</h4>
                      <div className="flex flex-wrap gap-1">
                        {promoter.genres.slice(0, 3).map((genre) => (
                          <span
                            key={genre}
                            className="inline-block bg-music-neutral-100 text-music-neutral-700 text-xs px-2 py-1 rounded-full"
                          >
                            {genre}
                          </span>
                        ))}
                        {promoter.genres.length > 3 && (
                          <span className="inline-block bg-music-neutral-100 text-music-neutral-700 text-xs px-2 py-1 rounded-full">
                            +{promoter.genres.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Upcoming Events */}
                  <div className="border-t border-music-neutral-200 pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-music-purple-900 text-sm">Recent Events</h4>
                    </div>
                    
                    {promoter.upcomingEvents.length > 0 ? (
                      <div className="space-y-2">
                        {promoter.upcomingEvents.slice(0, 2).map((event) => (
                          <Link 
                            key={event.id} 
                            href={event.slug ? `/events/${event.slug}` : `/events/${event.id}`}
                            className="block text-xs text-music-neutral-600 hover:text-music-accent-600 transition-colors duration-200"
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
                        {promoter.upcomingEvents.length > 2 && (
                          <p className="text-xs text-music-accent-600 font-medium">
                            +{promoter.upcomingEvents.length - 2} more upcoming events
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-music-neutral-500">No upcoming events</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-center mt-4 pt-4 border-t border-music-neutral-200">
                    <Link 
                      href={`/events?promoter=${encodeURIComponent(promoter.name)}`}
                      className="text-sm text-music-accent-600 hover:text-music-accent-800 font-medium"
                    >
                      View All Events →
                    </Link>
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