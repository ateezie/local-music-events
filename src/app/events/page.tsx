'use client'

import { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import EventCard from '@/components/EventCard'
import { Event } from '@/types'

interface GenreInfo {
  id: string
  name: string
  count: number
  color: string
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [selectedGenre, setSelectedGenre] = useState('all')
  const [loading, setLoading] = useState(true)
  const [genres, setGenres] = useState<GenreInfo[]>([])
  const [stats, setStats] = useState({ totalEvents: 0, upcomingEvents: 0, totalVenues: 0 })

  useEffect(() => {
    const loadEvents = async () => {
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
        
        // Sort by date
        combinedEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        
        // Generate genre data from events
        const genreMap = new Map<string, number>()
        const venueSet = new Set<string>()
        
        combinedEvents.forEach(event => {
          // Count genres
          if (event.genre) {
            genreMap.set(event.genre, (genreMap.get(event.genre) || 0) + 1)
          }
          // Count venues
          if (event.venue?.id) {
            venueSet.add(event.venue.id)
          }
        })
        
        // Create genre info array
        const genreColors: { [key: string]: string } = {
          'rock': '#FF6B35',
          'jazz': '#FFD700', 
          'electronic': '#00FFFF',
          'hip-hop': '#9370DB',
          'indie-rock': '#E83F6F',
          'punk': '#FF1493',
          'blues': '#4169E1',
          'folk': '#CD853F',
          'acoustic': '#8FBC8F',
          'house': '#FF8C00',
          'drum-and-bass': '#32CD32',
          'techno': '#FF69B4',
          'trance': '#8A2BE2',
          'dubstep': '#00CED1',
          'ukg': '#FFB6C1',
          'multi-genre': '#8b4aff',
          'other': '#808080'
        }
        
        const genreData: GenreInfo[] = Array.from(genreMap.entries()).map(([id, count]) => ({
          id,
          name: id.charAt(0).toUpperCase() + id.slice(1).replace('-', ' & '),
          count,
          color: genreColors[id] || '#808080'
        })).sort((a, b) => b.count - a.count)
        
        setEvents(combinedEvents)
        setFilteredEvents(combinedEvents)
        setGenres(genreData)
        setStats({
          totalEvents: combinedEvents.length,
          upcomingEvents: combinedEvents.filter(e => new Date(e.date) >= new Date()).length,
          totalVenues: venueSet.size
        })
      } catch (error) {
        console.error('Error loading events:', error)
      } finally {
        setLoading(false)
      }
    }

    loadEvents()
  }, [])

  const handleGenreFilter = (genreId: string) => {
    setSelectedGenre(genreId)
    if (genreId === 'all') {
      setFilteredEvents(events)
    } else {
      const filtered = events.filter(event => event.genre === genreId)
      setFilteredEvents(filtered)
    }
  }

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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-96 bg-music-neutral-200 rounded-lg animate-pulse"></div>
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
                Live Music Events
              </h1>
              <p className="text-lg text-music-neutral-700 max-w-2xl mx-auto mb-8">
                Discover amazing live music experiences happening in your city. From intimate acoustic sets to high-energy concerts.
              </p>
              
              {/* Stats */}
              <div className="flex justify-center space-x-8 text-center">
                <div>
                  <div className="text-2xl font-bold text-music-purple-600">{stats.totalEvents}</div>
                  <div className="text-sm text-music-neutral-600">Total Events</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-music-blue-600">{stats.upcomingEvents}</div>
                  <div className="text-sm text-music-neutral-600">This Week</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-music-accent-600">{stats.totalVenues}</div>
                  <div className="text-sm text-music-neutral-600">Venues</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white border-b border-music-neutral-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleGenreFilter('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                  selectedGenre === 'all'
                    ? 'bg-music-purple-600 text-white shadow-md'
                    : 'bg-music-neutral-200 text-music-neutral-700 hover:bg-music-neutral-300'
                }`}
              >
                All Events ({events.length})
              </button>
              {genres.map((genre) => (
                <button
                  key={genre.id}
                  onClick={() => handleGenreFilter(genre.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                    selectedGenre === genre.id
                      ? 'bg-music-purple-600 text-white shadow-md'
                      : 'bg-music-neutral-200 text-music-neutral-700 hover:bg-music-neutral-300'
                  }`}
                >
                  {genre.name} ({genre.count})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Events Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {filteredEvents.length > 0 ? (
            <>
              <div className="mb-6">
                <p className="text-music-neutral-600">
                  Showing {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}
                  {selectedGenre !== 'all' && (
                    <span> in {genres.find(g => g.id === selectedGenre)?.name}</span>
                  )}
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🎵</div>
              <h3 className="text-2xl font-bold text-music-purple-950 mb-2">No events found</h3>
              <p className="text-music-neutral-600 mb-6">
                {selectedGenre === 'all' 
                  ? "We're working on adding more events. Check back soon!"
                  : `No events found for ${genres.find(g => g.id === selectedGenre)?.name}. Try a different genre.`
                }
              </p>
              {selectedGenre !== 'all' && (
                <button
                  onClick={() => handleGenreFilter('all')}
                  className="btn-primary"
                >
                  View All Events
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}