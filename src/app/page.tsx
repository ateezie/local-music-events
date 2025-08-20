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
  
  // Define all target genres regardless of events
  const targetGenres = [
    { id: 'house', name: 'House', description: 'Deep house and progressive' },
    { id: 'drum-and-bass', name: 'Drum & Bass', description: 'High-energy drum and bass' },
    { id: 'ukg', name: 'UK Garage', description: '2-step and speed garage' },
    { id: 'dubstep', name: 'Dubstep', description: 'Heavy bass dubstep' },
    { id: 'trance', name: 'Trance', description: 'Uplifting trance music' },
    { id: 'techno', name: 'Techno', description: 'Electronic techno music' },
    { id: 'multi-genre', name: 'Multi-Genre', description: 'Mixed music styles' },
    { id: 'other', name: 'Other', description: 'Various music genres' }
  ]

  // Calculate event counts for each genre
  const genres = React.useMemo(() => {
    const combinedEvents = [...featuredEvents, ...allEvents]
    const genreCounts = new Map<string, number>()
    
    combinedEvents.forEach(event => {
      if (event.genre) {
        genreCounts.set(event.genre, (genreCounts.get(event.genre) || 0) + 1)
      }
    })
    
    return targetGenres.map(genre => ({
      ...genre,
      count: genreCounts.get(genre.id) || 0
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