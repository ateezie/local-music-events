'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Layout from '@/components/Layout'
import Hero from '@/components/Hero'
import EventCard from '@/components/EventCard'
import { Event } from '@/types'
import { getAllGenres } from '@/lib/events'

// Helper functions for genre processing (extracted from events.ts)
function getGenreColor(genre: string): string {
  const genreColors: { [key: string]: string } = {
    house: '#FF4500',
    techno: '#00FFFF',
    dubstep: '#DC143C',
    trap: '#9370DB',
    'drum-and-bass': '#32CD32',
    breakbeat: '#FF8C00',
    trance: '#4169E1',
    'uk-garage': '#32CD32',
    'multi-genre': '#8b4aff',
    other: '#8b4aff'
  }
  return genreColors[genre] || '#8b4aff'
}

function getGenreDescription(genre: string): string {
  const genreDescriptions: { [key: string]: string } = {
    house: 'House music and subgenres',
    techno: 'Techno and electronic beats',
    dubstep: 'Heavy bass dubstep',
    trap: 'Electronic trap beats',
    'drum-and-bass': 'High-energy drum and bass',
    breakbeat: 'Funky breakbeat rhythms',
    trance: 'Uplifting trance music',
    'uk-garage': 'UK garage sounds',
    'multi-genre': 'Multiple music genres',
    other: 'Various music styles'
  }
  return genreDescriptions[genre] || 'Live music events'
}

export default function HomePage() {
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([])
  const [allEvents, setAllEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true) // Start with loading state
  const [mounted, setMounted] = useState(false)
  
  // Define all target genres regardless of events
  const targetGenres = [
    { id: 'house', name: 'House', description: 'House music and subgenres' },
    { id: 'techno', name: 'Techno', description: 'Techno and electronic beats' },
    { id: 'dubstep', name: 'Dubstep', description: 'Heavy bass dubstep' },
    { id: 'trap', name: 'Trap', description: 'Electronic trap beats' },
    { id: 'drum-and-bass', name: 'Drum & Bass', description: 'High-energy drum and bass' },
    { id: 'breakbeat', name: 'Breakbeats', description: 'Funky breakbeat rhythms' },
    { id: 'trance', name: 'Trance', description: 'Uplifting trance music' },
    { id: 'uk-garage', name: 'UK Garage', description: 'UK garage sounds' },
    { id: 'other', name: 'Other', description: 'Various music genres' }
  ]

  // Calculate event counts for each genre based on artist genres assigned to events
  const genres = React.useMemo(() => {
    const combinedEvents = [...featuredEvents, ...allEvents]
    console.log('genres useMemo: Calculating genres for', combinedEvents.length, 'events')
    const genreCounts = new Map<string, number>()
    
    combinedEvents.forEach((event, index) => {
      // Track which genres are represented by artists in this event
      const eventGenres = new Set<string>()
      
      // ONLY look at artist genres - completely disregard event genres
      if (event.artists && event.artists.length > 0) {
        console.log(`Event ${index + 1} (${event.title}): ${event.artists.length} artists`)
        event.artists.forEach((artist, artistIndex) => {
          // Get primary genre: use first genre from genres array, fallback to genre field
          let primaryGenre = null
          if (artist.genres && Array.isArray(artist.genres) && artist.genres.length > 0) {
            primaryGenre = artist.genres[0]
          } else if (artist.genre && artist.genre !== 'multi-genre') {
            primaryGenre = artist.genre
          }
          
          console.log(`  Artist ${artistIndex + 1}: ${artist.name} - Primary genre: ${primaryGenre} (from genres: ${JSON.stringify(artist.genres)} or fallback: ${artist.genre})`)
          
          if (primaryGenre) {
            // Only add genres that match our 9-genre system
            if (['house', 'techno', 'dubstep', 'trap', 'drum-and-bass', 'breakbeat', 'trance', 'uk-garage'].includes(primaryGenre)) {
              eventGenres.add(primaryGenre)
              console.log(`    -> Mapped to: ${primaryGenre}`)
            } else {
              // Map any unrecognized genres to 'other'
              eventGenres.add('other')
              console.log(`    -> Mapped to: other (unrecognized genre: ${primaryGenre})`)
            }
          }
        })
      } else {
        console.log(`Event ${index + 1} (${event.title}): NO ARTISTS`)
      }
      
      // Count this event for each genre represented by its artists
      // Only count events that have artists with valid genre assignments
      eventGenres.forEach(genre => {
        genreCounts.set(genre, (genreCounts.get(genre) || 0) + 1)
      })
    })
    
    console.log('Genre counts:', Array.from(genreCounts.entries()))
    
    const finalGenres = targetGenres
      .map(genre => ({
        ...genre,
        count: genreCounts.get(genre.id) || 0
      }))
      .filter(genre => genre.count > 0) // Only show genres with events
    
    console.log('Final genres to display:', finalGenres.length, finalGenres)
    return finalGenres
  }, [featuredEvents, allEvents])
  
  // Define loadEvents function before useEffect
  const loadEvents = async () => {
    try {
      console.log('Loading events from API...')
      const response = await fetch('/api/events?limit=100')
      console.log('API response status:', response.status)
      if (response.ok) {
        const data = await response.json()
        const events = data.events || []
        console.log('Received events:', events.length, 'events')
        if (events.length > 0) {
          console.log('First event:', events[0].title, 'Hero:', events[0].hero)
        }
        
        // Sort by date
        events.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
        
        // Filter featured events
        const featured = events.filter((event: any) => event.featured).slice(0, 4)
        console.log('Featured events:', featured.length)
        
        setFeaturedEvents(featured)
        setAllEvents(events.slice(0, 8))
        console.log('State updated with featured:', featured.length, 'all:', events.slice(0, 8).length)
      }
    } catch (error) {
      console.error('Error loading events:', error)
    } finally {
      setLoading(false)
    }
  }

  // Get the hero event (event with hero: true), fallback to first featured event
  const heroFeaturedEvent = [...featuredEvents, ...allEvents].find(event => event.hero) || featuredEvents[0] || allEvents[0]

  useEffect(() => {
    setMounted(true)
    
    const loadData = async () => {
      try {
        console.log('Loading events...')
        const response = await fetch('/api/events?limit=100')
        
        if (!response.ok) {
          throw new Error(`API response not ok: ${response.status}`)
        }
        
        const data = await response.json()
        const events = data.events || []
        
        console.log('Received', events.length, 'events')
        
        if (events.length > 0) {
          console.log('First event:', events[0].title, 'Hero:', events[0].hero)
          
          // Sort by date but keep hero events first (they're already ordered by API)
          events.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
          
          // Filter featured events
          const featured = events.filter((event: any) => event.featured).slice(0, 4)
          
          console.log('Setting featured events:', featured.length)
          console.log('Setting all events:', events.slice(0, 8).length)
          
          // Update state
          setFeaturedEvents(featured)
          setAllEvents(events.slice(0, 8))
        } else {
          console.log('No events received from API')
        }
      } catch (error) {
        console.error('Error loading events:', error)
      } finally {
        console.log('Setting loading to false')
        setLoading(false)
      }
    }
    
    loadData()
  }, [])

  // Only show content after component has mounted
  if (!mounted) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto mb-4"></div>
            <p className="text-gray-700">Loading events...</p>
          </div>
        </div>
      </Layout>
    )
  }

  // Debug: Add basic info to help troubleshoot
  const debugInfo = {
    loading,
    featuredCount: featuredEvents.length,
    allEventsCount: allEvents.length,
    genresCount: genres.length
  }

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto mb-4"></div>
            <p className="text-gray-700">Loading events...</p>
            <p className="text-xs text-gray-500 mt-2">Debug: {JSON.stringify(debugInfo)}</p>
          </div>
        </div>
      </Layout>
    )
  }

  // Show a debug screen temporarily to diagnose the issue
  if (featuredEvents.length === 0 && allEvents.length === 0 && !loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-100 p-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Debug Information</h1>
            <div className="bg-white p-4 rounded shadow">
              <p><strong>Loading:</strong> {loading ? 'true' : 'false'}</p>
              <p><strong>Mounted:</strong> {mounted ? 'true' : 'false'}</p>
              <p><strong>Featured Events:</strong> {featuredEvents.length}</p>
              <p><strong>All Events:</strong> {allEvents.length}</p>
              <p><strong>Genres:</strong> {genres.length}</p>
              <p><strong>Hero Event:</strong> {heroFeaturedEvent ? heroFeaturedEvent.title : 'None'}</p>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      {/* Hero Section */}
      {heroFeaturedEvent && <Hero featuredEvent={heroFeaturedEvent} />}

      {/* Featured Events Section */}
      <section className="px-[5%] py-16 md:py-24 lg:py-28 bg-neutral-100">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-6 uppercase">
              Featured Events
            </h2>
            <p className="text-medium text-gray-700 max-w-2xl mx-auto">
              Here&apos;s what&apos;s coming up in St. Louis this month!
            </p>
          </div>

          {featuredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {featuredEvents.map((event) => (
                <EventCard key={event.id} event={event} featured />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No featured events available.</p>
            </div>
          )}

          <div className="text-center">
            <Link 
              href="/events?featured=true"
              className="bg-blue-900 text-white px-8 py-4 rounded font-semibold hover:bg-blue-800 transition-colors inline-flex items-center"
            >
              View All Featured Events
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Genres Section */}
      <section className="px-[5%] py-16 md:py-24 lg:py-28 bg-gradient-to-r from-music-purple-50 to-music-purple-100">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-6 uppercase">
              Browse by Genre
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
            {/* DEBUG INFO */}
            <div className="col-span-full bg-red-100 p-4 rounded mb-4">
              <h4 className="font-bold text-red-800 mb-2">🔍 DEBUG INFO</h4>
              <div className="text-sm text-red-700">
                <div>Featured Events: {featuredEvents.length}</div>
                <div>All Events: {allEvents.length}</div>
                <div>Genres to Display: {genres.length}</div>
                <div>Loading: {loading.toString()}</div>
                {genres.length > 0 && (
                  <div>First Genre: {JSON.stringify(genres[0])}</div>
                )}
                {allEvents.length > 0 && (
                  <div>First Event: {allEvents[0]?.title} (Artists: {allEvents[0]?.artists?.length || 0})</div>
                )}
              </div>
            </div>
            
            {genres.map((genre) => (
              <Link
                key={genre.id}
                href={`/events?genre=${genre.id}`}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-2 transition-all duration-300 text-center group overflow-hidden focus:outline-none focus:ring-2 focus:ring-[#4C6286] focus:ring-offset-2"
                aria-label={`Browse ${genre.count} ${genre.name} events`}
              >
                {/* Color accent bar */}
                <div 
                  className="w-full h-1 bg-gradient-to-r from-[#4C6286] to-music-purple-600"
                />
                
                {/* Content area with improved spacing */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-black mb-4 group-hover:text-[#4C6286] transition-colors duration-200 uppercase leading-tight">
                    {genre.name}
                  </h3>
                  
                  {/* Prominent event count */}
                  <div className={`${genre.count === 0 ? 'opacity-60' : ''}`}>
                    <div className={`text-2xl font-bold mb-1 ${genre.count === 0 ? 'text-gray-400' : 'text-[#4C6286]'}`}>
                      {genre.count}
                    </div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                      {genre.count === 0 ? 'No Events' : 'Events →'}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center">
            <Link 
              href="/events"
              className="border border-black text-black px-8 py-4 rounded font-semibold hover:bg-black hover:text-white transition-colors inline-flex items-center"
            >
              View All Events
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="px-[5%] py-16 md:py-24 lg:py-28 bg-prussian-900">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 uppercase">
              Upcoming Events
            </h2>
            <p className="text-medium text-neutral-300 max-w-4xl mx-auto">
              Don&apos;t miss out! These live music events are happening today in your area.
            </p>
          </div>

          {allEvents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {allEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No events available.</p>
            </div>
          )}
        </div>
      </section>

    </Layout>
  )
}