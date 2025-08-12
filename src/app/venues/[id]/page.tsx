'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Layout from '@/components/Layout'
import EventCard from '@/components/EventCard'
import { getVenueById, getEventsByVenue } from '@/lib/events'
import { Venue, Event } from '@/types'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default function VenueDetailPage() {
  const { id } = useParams()
  const [venue, setVenue] = useState<Venue | null>(null)
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      try {
        const venueData = getVenueById(id as string)
        if (!venueData) {
          notFound()
          return
        }
        
        setVenue(venueData)
        setEvents(getEventsByVenue(id as string))
      } catch (error) {
        console.error('Error loading venue:', error)
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
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

  if (!venue) {
    notFound()
  }

  const upcomingEvents = events.filter(event => new Date(event.date) > new Date())
  const pastEvents = events.filter(event => new Date(event.date) <= new Date())

  return (
    <Layout>
      <div className="min-h-screen bg-music-neutral-50">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-music-blue-900 to-music-purple-900 text-white overflow-hidden">
          {venue.image && (
            <div className="absolute inset-0 opacity-30">
              <Image
                src={venue.image}
                alt={venue.name}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl font-bold mb-4">{venue.name}</h1>
              
              <div className="text-lg text-music-neutral-200 mb-6">
                <div className="mb-2">
                  📍 {venue.address}, {venue.city}, {venue.state} {venue.zipCode}
                </div>
                {venue.capacity && (
                  <div className="mb-2">
                    👥 Capacity: {venue.capacity} people
                  </div>
                )}
              </div>

              <div className="flex justify-center space-x-8 text-center">
                <div>
                  <div className="text-2xl font-bold text-music-blue-300">{upcomingEvents.length}</div>
                  <div className="text-sm text-music-neutral-300">Upcoming Events</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-music-accent-300">{pastEvents.length}</div>
                  <div className="text-sm text-music-neutral-300">Past Events</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-music-purple-300">{events.length}</div>
                  <div className="text-sm text-music-neutral-300">Total Events</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Venue Details */}
            <div className="lg:col-span-2">
              {/* About Section */}
              <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                <h2 className="text-2xl font-bold text-music-purple-950 mb-6">About {venue.name}</h2>
                
                {venue.description ? (
                  <div className="prose prose-lg text-music-neutral-700 mb-8">
                    <p>{venue.description}</p>
                  </div>
                ) : (
                  <p className="text-music-neutral-600 mb-8">
                    A great venue for live music events in {venue.city}.
                  </p>
                )}

                {/* Venue Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-music-purple-900 mb-3">Location Details</h3>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Address:</span> {venue.address}</div>
                      <div><span className="font-medium">City:</span> {venue.city}, {venue.state}</div>
                      {venue.zipCode && <div><span className="font-medium">ZIP:</span> {venue.zipCode}</div>}
                      {venue.capacity && <div><span className="font-medium">Capacity:</span> {venue.capacity} people</div>}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-music-purple-900 mb-3">Contact Info</h3>
                    <div className="space-y-2 text-sm">
                      {venue.phone && <div><span className="font-medium">Phone:</span> {venue.phone}</div>}
                      {venue.email && <div><span className="font-medium">Email:</span> {venue.email}</div>}
                      {venue.website && (
                        <div>
                          <span className="font-medium">Website:</span>{' '}
                          <a 
                            href={venue.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-music-blue-600 hover:text-music-blue-800 underline"
                          >
                            Visit Website ↗
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Amenities */}
                {venue.amenities && venue.amenities.length > 0 && (
                  <div className="border-t border-music-neutral-200 pt-6 mt-8">
                    <h3 className="font-semibold text-music-purple-900 mb-3">Amenities</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {venue.amenities.map((amenity) => (
                        <div key={amenity} className="flex items-center text-sm text-music-neutral-700">
                          <span className="text-green-500 mr-2">✓</span>
                          {amenity}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Accessibility */}
                {venue.accessibility && venue.accessibility.length > 0 && (
                  <div className="border-t border-music-neutral-200 pt-6 mt-6">
                    <h3 className="font-semibold text-music-purple-900 mb-3">Accessibility</h3>
                    <div className="space-y-2">
                      {venue.accessibility.map((feature) => (
                        <div key={feature} className="flex items-center text-sm text-music-neutral-700">
                          <span className="text-blue-500 mr-2">♿</span>
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Upcoming Events */}
              {upcomingEvents.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                  <h2 className="text-2xl font-bold text-music-purple-950 mb-6">Upcoming Events</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {upcomingEvents.slice(0, 6).map((event) => (
                      <EventCard key={event.id} event={event} compact />
                    ))}
                  </div>
                  {upcomingEvents.length > 6 && (
                    <div className="text-center mt-6">
                      <Link 
                        href={`/events?venue=${venue.id}`}
                        className="text-music-purple-600 hover:text-music-purple-800 font-semibold"
                      >
                        View All {upcomingEvents.length} Upcoming Events →
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* Past Events */}
              {pastEvents.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-8">
                  <h2 className="text-2xl font-bold text-music-purple-950 mb-6">Recent Past Events</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {pastEvents.slice(-4).reverse().map((event) => (
                      <EventCard key={event.id} event={event} compact />
                    ))}
                  </div>
                  {pastEvents.length > 4 && (
                    <div className="text-center mt-6">
                      <Link 
                        href={`/events?venue=${venue.id}&past=true`}
                        className="text-music-neutral-600 hover:text-music-neutral-800 font-semibold"
                      >
                        View All Past Events →
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* No Events */}
              {events.length === 0 && (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <div className="text-6xl mb-4">🎵</div>
                  <h3 className="text-xl font-bold text-music-purple-950 mb-2">No Events Yet</h3>
                  <p className="text-music-neutral-600">
                    This venue doesn&apos;t have any scheduled events at the moment. Check back soon!
                  </p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Quick Info */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h3 className="font-bold text-music-purple-950 mb-4">Quick Info</h3>
                <div className="space-y-3 text-sm">
                  {venue.capacity && (
                    <div className="flex justify-between">
                      <span className="text-music-neutral-600">Capacity:</span>
                      <span className="font-medium">{venue.capacity}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-music-neutral-600">Total Events:</span>
                    <span className="font-medium">{events.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-music-neutral-600">Upcoming:</span>
                    <span className="font-medium">{upcomingEvents.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-music-neutral-600">Location:</span>
                    <span className="font-medium">{venue.city}, {venue.state}</span>
                  </div>
                </div>
              </div>

              {/* Contact & Links */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h3 className="font-bold text-music-purple-950 mb-4">Contact & Links</h3>
                <div className="space-y-3">
                  {venue.website && (
                    <a
                      href={venue.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full bg-music-blue-600 hover:bg-music-blue-700 text-white text-center py-3 px-4 rounded-lg font-semibold transition-colors duration-200"
                    >
                      Visit Website 🌐
                    </a>
                  )}
                  
                  {venue.phone && (
                    <a
                      href={`tel:${venue.phone}`}
                      className="block w-full bg-music-purple-100 hover:bg-music-purple-200 text-music-purple-700 text-center py-3 px-4 rounded-lg font-semibold transition-colors duration-200"
                    >
                      Call Venue 📞
                    </a>
                  )}

                  {venue.email && (
                    <a
                      href={`mailto:${venue.email}`}
                      className="block w-full bg-music-neutral-100 hover:bg-music-neutral-200 text-music-neutral-700 text-center py-3 px-4 rounded-lg font-semibold transition-colors duration-200"
                    >
                      Email Venue 📧
                    </a>
                  )}

                  <button className="w-full bg-music-accent-100 hover:bg-music-accent-200 text-music-accent-700 py-3 px-4 rounded-lg font-semibold transition-colors duration-200">
                    Get Directions 🗺️
                  </button>
                </div>
              </div>

              {/* Social Media */}
              {venue.socialMedia && Object.values(venue.socialMedia).some(link => link) && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="font-bold text-music-purple-950 mb-4">Follow {venue.name}</h3>
                  <div className="space-y-2">
                    {venue.socialMedia.facebook && (
                      <a
                        href={venue.socialMedia.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-sm text-blue-600 hover:text-blue-800"
                      >
                        📘 Facebook
                      </a>
                    )}
                    {venue.socialMedia.instagram && (
                      <a
                        href={venue.socialMedia.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-sm text-pink-600 hover:text-pink-800"
                      >
                        📷 Instagram
                      </a>
                    )}
                    {venue.socialMedia.twitter && (
                      <a
                        href={venue.socialMedia.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-sm text-blue-400 hover:text-blue-600"
                      >
                        🐦 Twitter
                      </a>
                    )}
                    {venue.socialMedia.website && (
                      <a
                        href={venue.socialMedia.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-sm text-music-blue-600 hover:text-music-blue-800"
                      >
                        🌐 Website
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}