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
    rock: '#FF6B35',
    jazz: '#FFD700',
    'indie-rock': '#E83F6F',
    electronic: '#00FFFF',
    punk: '#FF1493',
    'hip-hop': '#9370DB',
    blues: '#4169E1',
    folk: '#CD853F',
    acoustic: '#8FBC8F',
    house: '#FF4500',
    'drum-and-bass': '#32CD32',
    'multi-genre': '#8b4aff',
    dubstep: '#FF4500',
    trap: '#9370DB',
    techno: '#00FFFF',
    trance: '#4169E1',
    'ukg': '#32CD32',
    other: '#8b4aff'
  }
  return genreColors[genre] || '#8b4aff'
}

function getGenreDescription(genre: string): string {
  const genreDescriptions: { [key: string]: string } = {
    rock: 'Classic and modern rock music',
    jazz: 'Smooth jazz and improvisation',
    'indie-rock': 'Independent rock artists',
    electronic: 'Electronic dance music',
    punk: 'Raw and energetic punk rock',
    'hip-hop': 'Hip hop and rap music',
    blues: 'Traditional and modern blues',
    folk: 'Acoustic folk music',
    acoustic: 'Unplugged acoustic sets',
    house: 'Deep house and progressive',
    'drum-and-bass': 'High-energy drum and bass',
    'multi-genre': 'Multiple music genres',
    dubstep: 'Heavy bass dubstep',
    trap: 'Trap and hip-hop beats',
    techno: 'Electronic techno music',
    trance: 'Uplifting trance music',
    'ukg': 'UK Garage sounds',
    other: 'Various music styles'
  }
  return genreDescriptions[genre] || 'Live music events'
}

export default function HomePage() {
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([])
  const [allEvents, setAllEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  
  // Calculate genres from loaded events
  const genres = React.useMemo(() => {
    const combinedEvents = [...featuredEvents, ...allEvents]
    if (combinedEvents.length === 0) return []
    
    const genreCounts = new Map<string, number>()
    
    combinedEvents.forEach(event => {
      if (event.genre) {
        genreCounts.set(event.genre, (genreCounts.get(event.genre) || 0) + 1)
      }
    })
    
    return Array.from(genreCounts.entries()).map(([genre, count]) => ({
      id: genre,
      name: genre.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
      color: getGenreColor(genre),
      icon: '🎵',
      count: count,
      description: getGenreDescription(genre)
    }))
  }, [featuredEvents, allEvents])
  
  // Get the hero event (event with hero: true), fallback to first featured event
  const heroFeaturedEvent = [...featuredEvents, ...allEvents].find(event => event.hero) || featuredEvents[0] || allEvents[0]

  useEffect(() => {
    loadEvents()
  }, [])

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
      
      // Filter featured events
      const featured = combinedEvents.filter(event => event.featured).slice(0, 4)
      setFeaturedEvents(featured)
      setAllEvents(combinedEvents.slice(0, 8))
      
    } catch (error) {
      console.error('Error loading events:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
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

  return (
    <Layout>
      {/* Hero Section */}
      {heroFeaturedEvent && <Hero featuredEvent={heroFeaturedEvent} />}

      {/* Featured Events Section */}
      <section className="px-[5%] py-16 md:py-24 lg:py-28 bg-neutral-100">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="heading-h2 text-black mb-6">
              Featured Events
            </h2>
            <p className="text-medium text-gray-700 max-w-2xl mx-auto">
              Don&apos;t miss these hand-picked live music experiences happening in your city this week.
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
            <h2 className="heading-h2 text-black mb-6">
              Browse by Genre
            </h2>
            <p className="text-medium text-gray-700 max-w-2xl mx-auto">
              Discover live music events that match your taste. From indie rock to jazz, electronic to acoustic.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
            {genres.map((genre) => (
              <Link
                key={genre.id}
                href={`/events?genre=${genre.id}`}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transform transition-all duration-200 text-center group hover:scale-105"
              >
                <div 
                  className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center text-white font-bold text-xl group-hover:scale-110 transition-transform duration-200"
                  style={{ backgroundColor: genre.color }}
                >
                  🎵
                </div>
                <h3 className="text-lg font-bold text-black mb-2 group-hover:text-blue-900 transition-colors duration-200 uppercase">
                  {genre.name}
                </h3>
                <p className="text-gray-700 text-sm mb-3">
                  {genre.description}
                </p>
                <span className="text-black font-semibold text-sm">
                  {genre.count} events →
                </span>
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
            <h2 className="heading-h2 text-white mb-6">
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