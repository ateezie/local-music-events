'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Layout from '@/components/Layout'
import { getEventById, getRelatedEvents } from '@/lib/events'
import { Event } from '@/types'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import EventCard from '@/components/EventCard'

export default function EventDetailPage() {
  const { id } = useParams()
  const [event, setEvent] = useState<Event | null>(null)
  const [relatedEvents, setRelatedEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      try {
        const eventData = getEventById(id as string)
        if (!eventData) {
          notFound()
          return
        }
        
        setEvent(eventData)
        setRelatedEvents(getRelatedEvents(eventData, 3))
      } catch (error) {
        console.error('Error loading event:', error)
        notFound()
      } finally {
        setLoading(false)
      }
    }
  }, [id])

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

  const eventDate = new Date(event.date)
  const isUpcoming = eventDate > new Date()
  const isPast = !isUpcoming

  return (
    <Layout>
      <div className="min-h-screen bg-music-neutral-50">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-music-purple-900 to-music-blue-900 text-white overflow-hidden">
          {event.flyer && (
            <div className="absolute inset-0 opacity-20">
              <Image
                src={event.flyer}
                alt={event.title}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              {/* Status Badge */}
              <div className="mb-4">
                <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
                  event.status === 'sold-out' ? 'bg-red-600 text-white' :
                  event.status === 'cancelled' ? 'bg-red-600 text-white' :
                  event.status === 'postponed' ? 'bg-yellow-600 text-white' :
                  isPast ? 'bg-music-neutral-600 text-white' :
                  'bg-green-600 text-white'
                }`}>
                  {event.status === 'sold-out' ? 'Sold Out' :
                   event.status === 'cancelled' ? 'Cancelled' :
                   event.status === 'postponed' ? 'Postponed' :
                   isPast ? 'Past Event' : 'Tickets Available'}
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl font-bold mb-4">{event.title}</h1>
              
              {/* Artists */}
              <div className="mb-6">
                {event.artists.map((artist, index) => (
                  <span key={artist.id}>
                    <Link 
                      href={`/artists/${artist.id}`}
                      className="text-music-accent-300 hover:text-music-accent-100 font-semibold text-xl"
                    >
                      {artist.name}
                    </Link>
                    {index < event.artists.length - 1 && <span className="text-music-neutral-300 mx-2">•</span>}
                  </span>
                ))}
              </div>

              {/* Genre */}
              <div className="mb-4">
                <span className="inline-block bg-music-accent-600 text-white px-3 py-1 rounded-full text-sm font-medium capitalize">
                  {event.genre.replace('-', ' ')}
                </span>
              </div>

              {/* Date & Venue */}
              <div className="text-lg text-music-neutral-200">
                <div className="mb-2">
                  📅 {eventDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
                <div className="mb-2">
                  🕒 {event.time}{event.endTime && ` - ${event.endTime}`}
                </div>
                <div className="mb-4">
                  📍 <Link 
                    href={`/venues/${event.venue.id}`}
                    className="text-music-blue-300 hover:text-music-blue-100 underline"
                  >
                    {event.venue.name}, {event.venue.city}
                  </Link>
                </div>
              </div>

              {/* Price & Tickets */}
              <div className="flex justify-center space-x-4 text-lg">
                {event.price && (
                  <div className="text-music-accent-300 font-semibold">
                    💰 {event.price}
                  </div>
                )}
                {event.ageRestriction && (
                  <div className="text-music-neutral-300">
                    🔞 {event.ageRestriction}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
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

                {/* Event Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <h3 className="font-semibold text-music-purple-900 mb-3">Event Details</h3>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Category:</span> {event.category.replace('-', ' ')}</div>
                      <div><span className="font-medium">Genre:</span> {event.genre.replace('-', ' ')}</div>
                      {event.promoter && <div><span className="font-medium">Promoter:</span> {event.promoter}</div>}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-music-purple-900 mb-3">Venue Info</h3>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Address:</span> {event.venue.address}</div>
                      <div><span className="font-medium">City:</span> {event.venue.city}, {event.venue.state}</div>
                      {event.venue.capacity && <div><span className="font-medium">Capacity:</span> {event.venue.capacity}</div>}
                    </div>
                  </div>
                </div>

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
                      className="block w-full bg-music-accent-600 hover:bg-music-accent-700 text-white text-center py-3 px-4 rounded-lg font-semibold transition-colors duration-200"
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
                      Facebook Event
                    </a>
                  )}
                  
                  <button className="w-full bg-music-purple-100 hover:bg-music-purple-200 text-music-purple-700 py-3 px-4 rounded-lg font-semibold transition-colors duration-200">
                    Add to Calendar 📅
                  </button>
                  
                  <button className="w-full bg-music-neutral-100 hover:bg-music-neutral-200 text-music-neutral-700 py-3 px-4 rounded-lg font-semibold transition-colors duration-200">
                    Share Event 📱
                  </button>
                </div>
              </div>

              {/* Venue Details */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="font-bold text-music-purple-950 mb-4">Venue Details</h3>
                <Link href={`/venues/${event.venue.id}`} className="block group">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-music-purple-700 group-hover:text-music-purple-500">
                      {event.venue.name}
                    </h4>
                    <p className="text-sm text-music-neutral-600">
                      {event.venue.address}<br />
                      {event.venue.city}, {event.venue.state} {event.venue.zipCode}
                    </p>
                    {event.venue.phone && (
                      <p className="text-sm text-music-neutral-600">
                        📞 {event.venue.phone}
                      </p>
                    )}
                    {event.venue.website && (
                      <p className="text-sm">
                        <a 
                          href={event.venue.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-music-blue-600 hover:text-music-blue-800"
                        >
                          Visit Website ↗
                        </a>
                      </p>
                    )}
                  </div>
                </Link>
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