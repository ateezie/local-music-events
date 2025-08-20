'use client'

import { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import { getAllArtists, getEventsByArtist, getEventStats } from '@/lib/events'
import { Artist, Event } from '@/types'
import Link from 'next/link'
import Image from 'next/image'

interface ArtistWithEvents extends Artist {
  upcomingEvents: Event[]
}

export default function ArtistsPage() {
  const [artists, setArtists] = useState<ArtistWithEvents[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedGenre, setSelectedGenre] = useState('all')
  const [stats, setStats] = useState(getEventStats())

  const genres = ['rock', 'indie-rock', 'punk', 'jazz', 'electronic', 'hip-hop', 'acoustic', 'folk']

  useEffect(() => {
    const loadArtists = async () => {
      try {
        const allArtists = getAllArtists()
        const artistsWithEvents = allArtists.map(artist => ({
          ...artist,
          upcomingEvents: getEventsByArtist(artist.id)
        }))
        
        setArtists(artistsWithEvents)
        setStats(getEventStats())
      } catch (error) {
        console.error('Error loading artists:', error)
      } finally {
        setLoading(false)
      }
    }

    loadArtists()
  }, [])

  const filteredArtists = selectedGenre === 'all' 
    ? artists 
    : artists.filter(artist => artist.genre === selectedGenre)

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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
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
                Local Artists
              </h1>
              <p className="text-lg text-music-neutral-700 max-w-2xl mx-auto mb-8">
                Meet the talented musicians and bands bringing amazing live music to your city.
              </p>
              
              {/* Stats */}
              <div className="flex justify-center space-x-8 text-center">
                <div>
                  <div className="text-2xl font-bold text-music-accent-600">{stats.totalArtists}</div>
                  <div className="text-sm text-music-neutral-600">Artists</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-music-purple-600">{stats.totalEvents}</div>
                  <div className="text-sm text-music-neutral-600">Total Events</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-music-blue-600">{stats.upcomingEvents}</div>
                  <div className="text-sm text-music-neutral-600">This Week</div>
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
                onClick={() => setSelectedGenre('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                  selectedGenre === 'all'
                    ? 'bg-music-accent-600 text-white shadow-md'
                    : 'bg-music-neutral-200 text-music-neutral-700 hover:bg-music-neutral-300'
                }`}
              >
                All Artists ({artists.length})
              </button>
              {genres.map((genre) => {
                const count = artists.filter(artist => artist.genre === genre).length
                return count > 0 ? (
                  <button
                    key={genre}
                    onClick={() => setSelectedGenre(genre)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 capitalize ${
                      selectedGenre === genre
                        ? 'bg-music-accent-600 text-white shadow-md'
                        : 'bg-music-neutral-200 text-music-neutral-700 hover:bg-music-neutral-300'
                    }`}
                  >
                    {genre.replace('-', ' ')} ({count})
                  </button>
                ) : null
              })}
            </div>
          </div>
        </div>

        {/* Artists Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {filteredArtists.length > 0 ? (
            <>
              <div className="mb-8">
                <p className="text-music-neutral-600">
                  Showing {filteredArtists.length} artist{filteredArtists.length !== 1 ? 's' : ''}
                  {selectedGenre !== 'all' && (
                    <span> in {selectedGenre.replace('-', ' ')}</span>
                  )}
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredArtists.map((artist) => (
                  <div key={artist.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
                    {/* Artist Image */}
                    <div className="h-48 bg-gradient-to-br from-music-purple-100 to-music-purple-200 flex items-center justify-center">
                      {artist.image ? (
                        <Image
                          src={artist.image}
                          alt={artist.name}
                          width={300}
                          height={200}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-music-neutral-400 text-center">
                          <svg className="w-16 h-16 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                          </svg>
                          <p className="text-sm font-medium">🎤</p>
                        </div>
                      )}
                    </div>

                    {/* Artist Info */}
                    <div className="p-5">
                      <div className="mb-3">
                        <h3 className="text-lg font-bold text-music-purple-950 mb-1">{artist.name}</h3>
                        <span className="inline-block bg-music-accent-100 text-music-accent-800 text-xs px-2 py-1 rounded-full font-medium capitalize">
                          {artist.genre.replace('-', ' ')}
                        </span>
                      </div>
                      
                      {artist.hometown && (
                        <p className="text-music-neutral-600 text-sm mb-3">
                          📍 {artist.hometown}
                        </p>
                      )}
                      
                      {artist.bio && (
                        <p className="text-music-neutral-700 text-sm mb-4 line-clamp-3">
                          {artist.bio}
                        </p>
                      )}

                      {/* Members */}
                      {artist.members && artist.members.length > 0 && (
                        <div className="mb-4">
                          <p className="text-xs text-music-neutral-500 mb-1">Members:</p>
                          <div className="flex flex-wrap gap-1">
                            {artist.members.slice(0, 3).map((member, index) => (
                              <span key={index} className="text-xs bg-music-neutral-100 text-music-neutral-700 px-2 py-1 rounded">
                                {member}
                              </span>
                            ))}
                            {artist.members.length > 3 && (
                              <span className="text-xs text-music-neutral-500">+{artist.members.length - 3}</span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Upcoming Events */}
                      <div className="border-t border-music-neutral-200 pt-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-music-purple-900 text-sm">Upcoming Shows</h4>
                          <span className="text-xs text-music-neutral-500">
                            {artist.upcomingEvents.length} event{artist.upcomingEvents.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                        
                        {artist.upcomingEvents.length > 0 ? (
                          <div className="space-y-2">
                            {artist.upcomingEvents.slice(0, 2).map((event) => (
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
                                <div className="text-music-blue-600 font-medium">{event.venue.name}</div>
                              </Link>
                            ))}
                            {artist.upcomingEvents.length > 2 && (
                              <Link 
                                href={`/artists/${artist.id}`}
                                className="text-xs text-music-accent-600 hover:text-music-accent-800 font-medium"
                              >
                                +{artist.upcomingEvents.length - 2} more shows
                              </Link>
                            )}
                          </div>
                        ) : (
                          <p className="text-xs text-music-neutral-500">No upcoming shows</p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-music-neutral-200">
                        <Link 
                          href={`/artists/${artist.id}`}
                          className="text-sm text-music-accent-600 hover:text-music-accent-800 font-medium"
                        >
                          View Profile
                        </Link>
                        {artist.website && (
                          <a 
                            href={artist.website}
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
            </>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🎤</div>
              <h3 className="text-2xl font-bold text-music-purple-950 mb-2">No artists found</h3>
              <p className="text-music-neutral-600 mb-6">
                {selectedGenre === 'all' 
                  ? "We're working on adding more artists. Check back soon!"
                  : `No artists found for ${selectedGenre.replace('-', ' ')}. Try a different genre.`
                }
              </p>
              {selectedGenre !== 'all' && (
                <button
                  onClick={() => setSelectedGenre('all')}
                  className="btn-primary"
                >
                  View All Artists
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}