'use client'

import { useState, useEffect, useMemo } from 'react'
import { useParams } from 'next/navigation'
import Layout from '@/components/Layout'
import EventCard from '@/components/EventCard'
import { getArtistById, getEventsByArtist } from '@/lib/events'
import { Artist, Event } from '@/types'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default function ArtistDetailPage() {
  const { id } = useParams()
  const [artist, setArtist] = useState<Artist | null>(null)
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      try {
        const artistData = getArtistById(id as string)
        if (!artistData) {
          notFound()
          return
        }
        
        setArtist(artistData)
        setEvents(getEventsByArtist(id as string))
      } catch (error) {
        console.error('Error loading artist:', error)
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

  if (!artist) {
    notFound()
  }

  const { upcomingEvents, pastEvents } = useMemo(() => {
    const now = new Date()
    const upcoming = events.filter(event => new Date(event.date) > now)
    const past = events.filter(event => new Date(event.date) <= now)
    return { upcomingEvents: upcoming, pastEvents: past }
  }, [events])

  return (
    <Layout>
      <div className="min-h-screen bg-music-neutral-50">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-music-accent-900 to-music-purple-900 text-white overflow-hidden">
          {artist.image && (
            <div className="absolute inset-0 opacity-30">
              <Image
                src={artist.image}
                alt={artist.name}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <div className="mb-4">
                <span className="inline-block bg-music-accent-600 text-white px-4 py-2 rounded-full text-sm font-medium capitalize">
                  {artist.genre.replace('-', ' ')}
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl font-bold mb-6">{artist.name}</h1>
              
              {artist.hometown && (
                <div className="text-lg text-music-neutral-200 mb-6">
                  📍 {artist.hometown}
                </div>
              )}

              {artist.formed && (
                <div className="text-music-neutral-300 mb-8">
                  Established {artist.formed}
                </div>
              )}

              <div className="flex justify-center space-x-8 text-center">
                <div>
                  <div className="text-2xl font-bold text-music-accent-300">{upcomingEvents.length}</div>
                  <div className="text-sm text-music-neutral-300">Upcoming Shows</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-music-purple-300">{pastEvents.length}</div>
                  <div className="text-sm text-music-neutral-300">Past Shows</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-music-blue-300">
                    {artist.members?.length || 1}
                  </div>
                  <div className="text-sm text-music-neutral-300">
                    {artist.members && artist.members.length > 1 ? 'Members' : 'Solo Artist'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Artist Details */}
            <div className="lg:col-span-2">
              {/* About Section */}
              <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                <h2 className="text-2xl font-bold text-music-purple-950 mb-6">About {artist.name}</h2>
                
                {artist.bio ? (
                  <div className="prose prose-lg text-music-neutral-700 mb-8">
                    <p>{artist.bio}</p>
                  </div>
                ) : (
                  <p className="text-music-neutral-600 mb-8">
                    {artist.name} is a talented {artist.genre.replace('-', ' ')} artist
                    {artist.hometown && ` from ${artist.hometown}`}.
                  </p>
                )}

                {/* Band Members */}
                {artist.members && artist.members.length > 0 && (
                  <div className="border-t border-music-neutral-200 pt-6">
                    <h3 className="font-semibold text-music-purple-900 mb-4">Band Members</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {artist.members.map((member, index) => (
                        <div key={index} className="bg-music-neutral-50 rounded-lg p-3 text-center">
                          <div className="text-2xl mb-2">🎤</div>
                          <div className="font-medium text-music-purple-950 text-sm">{member}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {artist.tags && artist.tags.length > 0 && (
                  <div className="border-t border-music-neutral-200 pt-6 mt-6">
                    <h3 className="font-semibold text-music-purple-900 mb-3">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {artist.tags.map((tag) => (
                        <span key={tag} className="bg-music-accent-100 text-music-accent-800 px-3 py-1 rounded-full text-sm">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Upcoming Shows */}
              {upcomingEvents.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                  <h2 className="text-2xl font-bold text-music-purple-950 mb-6">Upcoming Shows</h2>
                  <div className="space-y-4">
                    {upcomingEvents.slice(0, 5).map((event) => (
                      <div key={event.id} className="border border-music-neutral-200 rounded-lg p-4 hover:border-music-purple-300 transition-colors duration-200">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <Link href={event.slug ? `/events/${event.slug}` : `/events/${event.id}`} className="group">
                              <h3 className="font-semibold text-music-purple-950 group-hover:text-music-purple-600 mb-1">
                                {event.title}
                              </h3>
                              <div className="text-sm text-music-neutral-600 mb-2">
                                📅 {new Date(event.date).toLocaleDateString('en-US', { 
                                  weekday: 'short', 
                                  month: 'short', 
                                  day: 'numeric',
                                  year: 'numeric'
                                })} at {event.time}
                              </div>
                              <div className="text-sm text-music-neutral-600">
                                📍 <Link href={`/venues/${event.venue.id}`} className="text-music-blue-600 hover:text-music-blue-800">
                                  {event.venue.name}, {event.venue.city}
                                </Link>
                              </div>
                            </Link>
                          </div>
                          <div className="text-right ml-4">
                            {event.price && (
                              <div className="text-music-accent-600 font-semibold mb-1">{event.price}</div>
                            )}
                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                              event.status === 'sold-out' ? 'bg-red-100 text-red-800' :
                              event.status === 'upcoming' ? 'bg-green-100 text-green-800' :
                              'bg-music-neutral-100 text-music-neutral-700'
                            }`}>
                              {event.status === 'sold-out' ? 'Sold Out' :
                               event.status === 'upcoming' ? 'Available' : event.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {upcomingEvents.length > 5 && (
                    <div className="text-center mt-6">
                      <Link 
                        href={`/events?artist=${artist.id}`}
                        className="text-music-purple-600 hover:text-music-purple-800 font-semibold"
                      >
                        View All {upcomingEvents.length} Upcoming Shows →
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* Past Shows */}
              {pastEvents.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-8">
                  <h2 className="text-2xl font-bold text-music-purple-950 mb-6">Recent Past Shows</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {pastEvents.slice(-4).reverse().map((event) => (
                      <EventCard key={event.id} event={event} compact />
                    ))}
                  </div>
                  {pastEvents.length > 4 && (
                    <div className="text-center mt-6">
                      <Link 
                        href={`/events?artist=${artist.id}&past=true`}
                        className="text-music-neutral-600 hover:text-music-neutral-800 font-semibold"
                      >
                        View All Past Shows →
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* No Shows */}
              {events.length === 0 && (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <div className="text-6xl mb-4">🎤</div>
                  <h3 className="text-xl font-bold text-music-purple-950 mb-2">No Shows Scheduled</h3>
                  <p className="text-music-neutral-600">
                    {artist.name} doesn&apos;t have any scheduled shows at the moment. Check back soon!
                  </p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Artist Photo */}
              {artist.image && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                  <div className="aspect-square rounded-lg overflow-hidden">
                    <Image
                      src={artist.image}
                      alt={artist.name}
                      width={300}
                      height={300}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Quick Info */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h3 className="font-bold text-music-purple-950 mb-4">Artist Info</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-music-neutral-600">Genre:</span>
                    <span className="font-medium capitalize">{artist.genre.replace('-', ' ')}</span>
                  </div>
                  {artist.hometown && (
                    <div className="flex justify-between">
                      <span className="text-music-neutral-600">From:</span>
                      <span className="font-medium">{artist.hometown}</span>
                    </div>
                  )}
                  {artist.formed && (
                    <div className="flex justify-between">
                      <span className="text-music-neutral-600">Formed:</span>
                      <span className="font-medium">{artist.formed}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-music-neutral-600">Total Shows:</span>
                    <span className="font-medium">{events.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-music-neutral-600">Upcoming:</span>
                    <span className="font-medium">{upcomingEvents.length}</span>
                  </div>
                </div>
              </div>

              {/* Social Media & Links */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h3 className="font-bold text-music-purple-950 mb-4">Links & Social</h3>
                <div className="space-y-3">
                  {artist.website && (
                    <a
                      href={artist.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full bg-music-purple-600 hover:bg-music-purple-700 text-white text-center py-3 px-4 rounded-lg font-semibold transition-colors duration-200"
                    >
                      Official Website 🌐
                    </a>
                  )}
                  
                  {artist.socialMedia?.spotify && (
                    <a
                      href={artist.socialMedia.spotify}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full bg-green-600 hover:bg-green-700 text-white text-center py-3 px-4 rounded-lg font-semibold transition-colors duration-200"
                    >
                      Listen on Spotify 🎵
                    </a>
                  )}

                  {artist.mediaLinks?.youtube && (
                    <a
                      href={artist.mediaLinks.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full bg-red-600 hover:bg-red-700 text-white text-center py-3 px-4 rounded-lg font-semibold transition-colors duration-200"
                    >
                      YouTube Channel 📺
                    </a>
                  )}

                  {artist.mediaLinks?.bandcamp && (
                    <a
                      href={artist.mediaLinks.bandcamp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full bg-music-blue-600 hover:bg-music-blue-700 text-white text-center py-3 px-4 rounded-lg font-semibold transition-colors duration-200"
                    >
                      Bandcamp 🎶
                    </a>
                  )}
                </div>
              </div>

              {/* Social Media Links */}
              {artist.socialMedia && Object.values(artist.socialMedia).some(link => link) && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="font-bold text-music-purple-950 mb-4">Follow {artist.name}</h3>
                  <div className="space-y-2">
                    {artist.socialMedia.facebook && (
                      <a
                        href={artist.socialMedia.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-sm text-blue-600 hover:text-blue-800"
                      >
                        📘 Facebook
                      </a>
                    )}
                    {artist.socialMedia.instagram && (
                      <a
                        href={artist.socialMedia.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-sm text-pink-600 hover:text-pink-800"
                      >
                        📷 Instagram
                      </a>
                    )}
                    {artist.socialMedia.twitter && (
                      <a
                        href={artist.socialMedia.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-sm text-blue-400 hover:text-blue-600"
                      >
                        🐦 Twitter
                      </a>
                    )}
                    {artist.socialMedia.tiktok && (
                      <a
                        href={artist.socialMedia.tiktok}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-sm text-black hover:text-gray-700"
                      >
                        🎵 TikTok
                      </a>
                    )}
                    {artist.socialMedia.soundcloud && (
                      <a
                        href={artist.socialMedia.soundcloud}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-sm text-orange-600 hover:text-orange-800"
                      >
                        🔊 SoundCloud
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