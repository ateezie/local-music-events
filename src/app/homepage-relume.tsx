'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Event } from '@/types'

export default function HomePageRelume() {
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([])
  const [allEvents, setAllEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  
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
      
      // Sort events by date
      combinedEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      
      // Separate featured and all events
      const featured = combinedEvents.filter(event => event.featured)
      
      setFeaturedEvents(featured)
      setAllEvents(combinedEvents)
      setLoading(false)
    } catch (error) {
      console.error('Error loading events:', error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="public-page min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-scheme-accent mx-auto mb-4"></div>
          <p className="text-scheme-text-muted">Loading events...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="public-page">
      {/* Header Navigation */}
      <nav className="border-b border-scheme-border bg-scheme-surface">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-scheme-accent rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">🎵</span>
              </div>
              <span className="font-heading font-bold text-scheme-text">Local Music Events</span>
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/events" className="text-scheme-text-muted hover:text-scheme-text transition-colors">Events</Link>
              <Link href="/venues" className="text-scheme-text-muted hover:text-scheme-text transition-colors">Venues</Link>
              <Link href="/artists" className="text-scheme-text-muted hover:text-scheme-text transition-colors">Artists</Link>
              <Link href="/calendar" className="text-scheme-text-muted hover:text-scheme-text transition-colors">Calendar</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Relume Style */}
      <section className="px-[5%] py-16 md:py-24 lg:py-28">
        <div className="container">
          <div className="grid grid-cols-1 gap-x-20 gap-y-12 md:gap-y-16 lg:grid-cols-2 lg:items-center">
            <div>
              <h1 className="heading-h1 mb-5 font-bold md:mb-6 text-scheme-text">
                Discover the Hottest Dance Events in St. Louis
              </h1>
              <p className="text-large text-scheme-text-muted mb-6 md:mb-8">
                Get ready to dance! Explore our curated list of the latest and
                most popular dance music events happening right now in Saint
                Louis.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  href="/events" 
                  className="public-button inline-flex items-center"
                >
                  Explore Events
                </Link>
                <Link 
                  href="/venues" 
                  className="px-6 py-3 border border-scheme-border text-scheme-text rounded-button font-medium hover:bg-scheme-surface transition-colors"
                >
                  Browse Venues
                </Link>
              </div>
            </div>
            <div>
              {heroFeaturedEvent ? (
                <div className="public-card">
                  <div className="aspect-video bg-scheme-border rounded-image mb-4 overflow-hidden">
                    {heroFeaturedEvent.flyer || heroFeaturedEvent.bannerImage ? (
                      <img
                        src={heroFeaturedEvent.flyer || heroFeaturedEvent.bannerImage || ''}
                        alt={heroFeaturedEvent.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-music-primary to-music-secondary flex items-center justify-center">
                        <span className="text-white text-4xl">🎵</span>
                      </div>
                    )}
                  </div>
                  <h3 className="heading-h4 mb-2 text-scheme-text">{heroFeaturedEvent.title}</h3>
                  <p className="text-medium text-scheme-text-muted mb-4">
                    {new Date(heroFeaturedEvent.date).toLocaleDateString()} • {heroFeaturedEvent.venue?.name}
                  </p>
                  <Link 
                    href={`/events/${heroFeaturedEvent.slug || heroFeaturedEvent.id}`}
                    className="text-scheme-accent hover:text-scheme-accent-hover font-medium"
                  >
                    Learn More →
                  </Link>
                </div>
              ) : (
                <div className="aspect-video bg-gradient-to-br from-music-primary to-music-secondary rounded-image flex items-center justify-center">
                  <span className="text-white text-6xl">🎵</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="px-[5%] py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="heading-h2 mb-5 md:mb-6 text-scheme-text">Featured Events</h2>
            <p className="text-large text-scheme-text-muted max-w-2xl mx-auto">
              Don't miss these handpicked events from the best venues and promoters in St. Louis
            </p>
          </div>
          
          {featuredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {featuredEvents.slice(0, 6).map((event) => (
                <div key={event.id} className="public-card group hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-scheme-border rounded-image mb-4 overflow-hidden">
                    {event.flyer || event.bannerImage ? (
                      <img
                        src={event.flyer || event.bannerImage || ''}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-music-primary to-music-secondary flex items-center justify-center">
                        <span className="text-white text-2xl">🎵</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <h3 className="heading-h5 text-scheme-text line-clamp-2">{event.title}</h3>
                    <p className="text-medium text-scheme-text-muted">
                      {new Date(event.date).toLocaleDateString()}
                    </p>
                    <p className="text-small text-scheme-text-light">
                      {event.venue?.name} • {event.genre}
                    </p>
                    <Link 
                      href={`/events/${event.slug || event.id}`}
                      className="inline-flex items-center text-scheme-accent hover:text-scheme-accent-hover font-medium text-small"
                    >
                      View Event →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-scheme-border rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎵</span>
              </div>
              <h3 className="heading-h4 mb-2 text-scheme-text">No Featured Events</h3>
              <p className="text-medium text-scheme-text-muted">Check back soon for exciting events!</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-[5%] py-16 md:py-24 bg-scheme-surface">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="heading-h2 mb-5 md:mb-6 text-scheme-text">
              Ready to Experience St. Louis Music?
            </h2>
            <p className="text-large text-scheme-text-muted mb-8">
              Join thousands of music lovers discovering the best events, venues, and artists in the city
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/events" className="public-button">
                Browse All Events
              </Link>
              <Link href="/venues" className="px-6 py-3 border border-scheme-border text-scheme-text rounded-button font-medium hover:bg-scheme-background transition-colors">
                Explore Venues
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-scheme-border bg-scheme-surface">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-scheme-accent rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">🎵</span>
                </div>
                <span className="font-heading font-bold text-scheme-text">Local Music Events</span>
              </div>
              <p className="text-small text-scheme-text-muted">
                Discover the best music events in St. Louis
              </p>
            </div>
            <div>
              <h4 className="heading-h6 mb-3 text-scheme-text">Events</h4>
              <ul className="space-y-2 text-small text-scheme-text-muted">
                <li><Link href="/events" className="hover:text-scheme-text">All Events</Link></li>
                <li><Link href="/events?genre=house" className="hover:text-scheme-text">House</Link></li>
                <li><Link href="/events?genre=dubstep" className="hover:text-scheme-text">Dubstep</Link></li>
                <li><Link href="/events?genre=trance" className="hover:text-scheme-text">Trance</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="heading-h6 mb-3 text-scheme-text">Venues</h4>
              <ul className="space-y-2 text-small text-scheme-text-muted">
                <li><Link href="/venues" className="hover:text-scheme-text">All Venues</Link></li>
                <li><Link href="/calendar" className="hover:text-scheme-text">Calendar</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="heading-h6 mb-3 text-scheme-text">Connect</h4>
              <ul className="space-y-2 text-small text-scheme-text-muted">
                <li><Link href="/artists" className="hover:text-scheme-text">Artists</Link></li>
                <li><Link href="/promoters" className="hover:text-scheme-text">Promoters</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-scheme-border mt-8 pt-6">
            <p className="text-center text-small text-scheme-text-light">
              © {new Date().getFullYear()} Local Music Events. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}