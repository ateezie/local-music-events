'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import MusicLogo from '@/components/MusicLogo'
import AdminHeader from '@/components/AdminHeader'
import GenreMultiSelect from '@/components/GenreMultiSelect'

interface EditArtist {
  id: string
  name: string
  slug?: string
  genre?: string // Primary genre field
  genres?: string[] // Main genres (API-pulled genres)
  subgenres?: string[] // Additional subgenres
  bio?: string
  image?: string
  website?: string
  hometown?: string
  facebook?: string
  instagram?: string
  twitter?: string
  tiktok?: string
  youtube?: string
  spotify?: string
  bandcamp?: string
  soundcloud?: string
  spotifyId?: string
  spotifyUrl?: string
  spotifyPopularity?: number
  spotifyFollowers?: number
  spotifyGenres?: string[]
  lastSpotifySync?: string
  lastfmBio?: string
  lastfmListeners?: number
  lastfmPlaycount?: number
  lastfmTags?: string[]
  lastfmSync?: string
  musicbrainzId?: string
  musicbrainzUrls?: any[]
  musicbrainzSync?: string
  members?: string[]
  tags?: string[]
  events?: EventData[] // Artist's events
}

interface EventData {
  id: string
  title: string
  date: string
  venue: {
    name: string
  }
}

interface EventOption {
  id: string
  title: string
  date: string
  venue: {
    name: string
  }
}

export default function EditArtistPage() {
  const [artist, setArtist] = useState<EditArtist | null>(null)
  const [availableEvents, setAvailableEvents] = useState<EventOption[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const params = useParams()
  const artistId = params.id as string

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.push('/admin')
      return
    }

    loadArtist()
    loadAvailableEvents()
  }, [artistId, router])

  // Helper function to safely parse JSON fields
  const safeJsonParse = (jsonString: string | null): any[] => {
    if (!jsonString) return []
    try {
      const parsed = JSON.parse(jsonString)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }

  const loadArtist = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/artists/${artistId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        // Parse JSON fields safely
        const processedArtist = {
          ...data,
          spotifyGenres: safeJsonParse(data.spotifyGenres),
          spotifyTopTracks: safeJsonParse(data.spotifyTopTracks),
          spotifyAlbums: safeJsonParse(data.spotifyAlbums),
          lastfmTags: safeJsonParse(data.lastfmTags),
          musicbrainzUrls: safeJsonParse(data.musicbrainzUrls),
          members: safeJsonParse(data.members),
          tags: safeJsonParse(data.tags),
          genres: safeJsonParse(data.genres), // API-pulled genres
          subgenres: safeJsonParse(data.subgenres) // Additional subgenres
        }
        setArtist(processedArtist)
      } else {
        setError('Artist not found')
      }
    } catch (error) {
      console.error('Error loading artist:', error)
      setError('Failed to load artist')
    } finally {
      setLoading(false)
    }
  }

  const loadAvailableEvents = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch('/api/events?limit=100', {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        setAvailableEvents(data.events || [])
      }
    } catch (error) {
      console.error('Error loading events:', error)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!artist) return

    setSaving(true)
    setError(null)

    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/artists/${artistId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...artist,
          // Ensure genres and subgenres are sent as arrays
          genres: artist.genres || [],
          subgenres: artist.subgenres || [],
          genre: artist.genre || (artist.genres && artist.genres.length > 0 ? artist.genres[0] : 'other'),
          // Convert null values to empty strings for URL fields
          tiktok: artist.tiktok || '',
          youtube: artist.youtube || '',
          bandcamp: artist.bandcamp || ''
        })
      })

      if (response.ok) {
        router.push('/admin/artists')
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to save artist')
      }
    } catch (error) {
      console.error('Error saving artist:', error)
      setError('Failed to save artist')
    } finally {
      setSaving(false)
    }
  }

  const updateArtist = (field: keyof EditArtist, value: any) => {
    if (!artist) return
    setArtist({ ...artist, [field]: value })
  }


  const addTag = () => {
    if (!artist) return
    const tags = artist.tags || []
    setArtist({ ...artist, tags: [...tags, ''] })
  }

  const updateTag = (index: number, value: string) => {
    if (!artist) return
    const tags = [...(artist.tags || [])]
    tags[index] = value
    setArtist({ ...artist, tags })
  }

  const removeTag = (index: number) => {
    if (!artist) return
    const tags = [...(artist.tags || [])]
    tags.splice(index, 1)
    setArtist({ ...artist, tags })
  }

  const syncSpotifyData = async () => {
    if (!artist) return

    setSyncing(true)
    setError(null)
    
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/artists/${artistId}/sync-spotify`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Sync API response:', data) // Debug log
        
        // Process the returned artist data
        const processedArtist = {
          ...data.artist,
          spotifyGenres: safeJsonParse(data.artist.spotifyGenres),
          spotifyTopTracks: safeJsonParse(data.artist.spotifyTopTracks),
          spotifyAlbums: safeJsonParse(data.artist.spotifyAlbums),
          lastfmTags: safeJsonParse(data.artist.lastfmTags),
          musicbrainzUrls: safeJsonParse(data.artist.musicbrainzUrls),
          members: safeJsonParse(data.artist.members),
          tags: safeJsonParse(data.artist.tags),
          genres: safeJsonParse(data.artist.genres) // Use the actual genres field from API
        }
        
        console.log('Processed artist before setting state:', processedArtist) // Debug log
        
        // Reload the artist data from database to get the latest synced data
        await loadArtist()
        
        // Show success with details
        const syncDetails = []
        if (processedArtist.spotifyFollowers) {
          syncDetails.push(`${processedArtist.spotifyFollowers.toLocaleString()} Spotify followers`)
        }
        if (processedArtist.spotifyPopularity) {
          syncDetails.push(`${processedArtist.spotifyPopularity}% Spotify popularity`)
        }
        if (processedArtist.spotifyGenres?.length > 0) {
          syncDetails.push(`Spotify genres: ${processedArtist.spotifyGenres.join(', ')}`)
        }
        if (processedArtist.lastfmListeners) {
          syncDetails.push(`${processedArtist.lastfmListeners.toLocaleString()} Last.fm listeners`)
        }
        if (processedArtist.lastfmBio) {
          syncDetails.push(`Last.fm biography added`)
        }
        if (processedArtist.musicbrainzId) {
          syncDetails.push(`MusicBrainz ID found: ${processedArtist.musicbrainzId}`)
        }
        if (processedArtist.musicbrainzUrls?.length > 0) {
          syncDetails.push(`${processedArtist.musicbrainzUrls.length} MusicBrainz social links found`)
        } else if (processedArtist.musicbrainzId) {
          syncDetails.push(`No social links found in MusicBrainz for this artist`)
        }
        if (processedArtist.hometown) {
          syncDetails.push(`Hometown: ${processedArtist.hometown} (from MusicBrainz)`)
        }
        
        const detailsText = syncDetails.length > 0 ? `\n\nSynced data:\n• ${syncDetails.join('\n• ')}` : ''
        alert(`✅ Music data synced successfully!${detailsText}`)
      } else {
        const errorData = await response.json()
        let errorMessage = errorData.error || 'Unknown error occurred'
        
        console.log('Sync API error:', response.status, errorData) // Debug log
        
        // Provide helpful error messages
        if (response.status === 401) {
          errorMessage = 'Authentication failed. Please reload the page and try again.'
          // Clear invalid token
          localStorage.removeItem('admin_token')
          setTimeout(() => router.push('/admin'), 2000)
        } else if (errorMessage.includes('credentials not configured')) {
          errorMessage += '\n\n💡 Setup Guide:\n1. Visit https://developer.spotify.com/dashboard\n2. Create a new app\n3. Add SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET to .env.local\n4. Restart the development server'
        } else if (errorMessage.includes('not found on Spotify')) {
          errorMessage += '\n\n💡 Try:\n• Adding the Spotify URL manually\n• Checking the artist name spelling\n• Searching for alternative artist names'
        }
        
        setError(`Sync failed: ${errorMessage}`)
      }
    } catch (error) {
      console.error('Spotify sync error:', error)
      setError(`Network error during Spotify sync: ${error.message}`)
    } finally {
      setSyncing(false)
    }
  }

  const handleDelete = async () => {
    if (!artist) return

    const confirmDelete = confirm(
      `Are you sure you want to delete "${artist.name}"?\n\nThis action cannot be undone and will permanently remove the artist and all associated data.`
    )
    
    if (!confirmDelete) return

    setDeleting(true)
    setError(null)

    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/artists/${artistId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.ok) {
        alert('Artist deleted successfully')
        router.push('/admin/artists')
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to delete artist')
      }
    } catch (error) {
      console.error('Error deleting artist:', error)
      setError('Failed to delete artist')
    } finally {
      setDeleting(false)
    }
  }

  const handleAssignToEvent = async (eventId: string) => {
    if (!artist) return

    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/events/${eventId}/artists`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ artistId: artist.id })
      })

      if (response.ok) {
        // Reload artist to get updated event assignments
        await loadArtist()
        alert('Artist assigned to event successfully!')
      } else {
        const data = await response.json()
        alert('Error assigning artist to event: ' + data.error)
      }
    } catch (error) {
      console.error('Error assigning artist to event:', error)
      alert('Error assigning artist to event')
    }
  }

  const handleRemoveFromEvent = async (eventId: string) => {
    if (!artist) return

    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/events/${eventId}/artists`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ artistId: artist.id })
      })

      if (response.ok) {
        // Reload artist to get updated event assignments
        await loadArtist()
        alert('Artist removed from event successfully!')
      } else {
        const data = await response.json()
        alert('Error removing artist from event: ' + data.error)
      }
    } catch (error) {
      console.error('Error removing artist from event:', error)
      alert('Error removing artist from event')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <MusicLogo className="h-16 w-16 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-400">Loading artist...</p>
        </div>
      </div>
    )
  }

  if (error || !artist) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-400 mb-6">{error || 'Artist not found'}</p>
          <Link
            href="/admin/artists"
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Back to Artists
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <AdminHeader title={`Edit Artist: ${artist.name}`} />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSave} className="space-y-8">
          
          {/* Basic Information */}
          <div className="bg-gray-800 rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-white">Basic Information</h3>
              
              {/* Action Buttons */}
              <div className="flex items-center space-x-3">
                <Link
                  href={`/artists/${artist.slug || artist.id}`}
                  target="_blank"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2 transition-colors"
                >
                  <span>👁️</span>
                  <span>View Artist</span>
                </Link>
                <button
                  type="button"
                  onClick={syncSpotifyData}
                  disabled={syncing}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors"
                >
                  {syncing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Syncing...</span>
                    </>
                  ) : (
                    <>
                      <span>🔄</span>
                      <span>Sync</span>
                    </>
                  )}
                </button>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Artist Name
                  </label>
                  <input
                    type="text"
                    value={artist.name}
                    onChange={(e) => updateArtist('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-music-purple-500 bg-gray-700 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Genre(s)
                  </label>
                  <GenreMultiSelect
                    selectedGenres={artist.genres || []}
                    onChange={(genres) => updateArtist('genres', genres)}
                    placeholder="Select genres..."
                    className=""
                  />
                </div>
              </div>

              {/* Permalink and Subgenres on same line */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Permalink/Slug
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={artist.slug || ''}
                      onChange={(e) => updateArtist('slug', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-music-purple-500 bg-gray-700 text-white"
                      placeholder="artist-name-slug"
                    />
                    <div className="mt-1 text-xs text-gray-400">
                      URL: /artists/{artist.slug || 'artist-name-slug'}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Subgenres
                  </label>
                  <GenreMultiSelect
                    selectedGenres={artist.subgenres || []}
                    onChange={(subgenres) => updateArtist('subgenres', subgenres)}
                    placeholder="Select additional subgenres..."
                    className=""
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Additional specific subgenres beyond the main genres
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Hometown
                  </label>
                  <input
                    type="text"
                    value={artist.hometown || ''}
                    onChange={(e) => updateArtist('hometown', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-music-purple-500 bg-gray-700 text-white"
                    placeholder="e.g., Los Angeles, CA"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Artist Image URL
                  </label>
                  <input
                    type="url"
                    value={artist.image || ''}
                    onChange={(e) => updateArtist('image', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-music-purple-500 bg-gray-700 text-white"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Biography
                </label>
                <textarea
                  rows={8}
                  value={artist.bio || ''}
                  onChange={(e) => updateArtist('bio', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-music-purple-500 bg-gray-700 text-white"
                  placeholder="Tell us about this artist..."
                />
              </div>
            </div>
          </div>

          {/* Social Media & Links */}
          <div className="bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-white mb-6">Social Media & Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  value={artist.website || ''}
                  onChange={(e) => updateArtist('website', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-music-purple-500 bg-gray-700 text-white"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Spotify URL
                </label>
                <input
                  type="url"
                  value={artist.spotify || ''}
                  onChange={(e) => updateArtist('spotify', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-music-purple-500 bg-gray-700 text-white"
                  placeholder="https://open.spotify.com/artist/..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Facebook
                </label>
                <input
                  type="url"
                  value={artist.facebook || ''}
                  onChange={(e) => updateArtist('facebook', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-music-purple-500 bg-gray-700 text-white"
                  placeholder="https://facebook.com/..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Instagram
                </label>
                <input
                  type="url"
                  value={artist.instagram || ''}
                  onChange={(e) => updateArtist('instagram', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-music-purple-500 bg-gray-700 text-white"
                  placeholder="https://instagram.com/..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Twitter
                </label>
                <input
                  type="url"
                  value={artist.twitter || ''}
                  onChange={(e) => updateArtist('twitter', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-music-purple-500 bg-gray-700 text-white"
                  placeholder="https://twitter.com/..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  SoundCloud
                </label>
                <input
                  type="url"
                  value={artist.soundcloud || ''}
                  onChange={(e) => updateArtist('soundcloud', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-music-purple-500 bg-gray-700 text-white"
                  placeholder="https://soundcloud.com/..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  TikTok
                </label>
                <input
                  type="url"
                  value={artist.tiktok || ''}
                  onChange={(e) => updateArtist('tiktok', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-music-purple-500 bg-gray-700 text-white"
                  placeholder="https://tiktok.com/@..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  YouTube
                </label>
                <input
                  type="url"
                  value={artist.youtube || ''}
                  onChange={(e) => updateArtist('youtube', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-music-purple-500 bg-gray-700 text-white"
                  placeholder="https://youtube.com/@..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Bandcamp
                </label>
                <input
                  type="url"
                  value={artist.bandcamp || ''}
                  onChange={(e) => updateArtist('bandcamp', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-music-purple-500 bg-gray-700 text-white"
                  placeholder="https://artist.bandcamp.com"
                />
              </div>
            </div>
          </div>

          {/* Event Assignments */}
          <div className="bg-gray-800 rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-white">Event Assignments</h3>
              <span className="text-sm text-gray-400">
                {artist.events?.length || 0} event(s) assigned
              </span>
            </div>

            {/* Current Event Assignments */}
            {artist.events && artist.events.length > 0 && (
              <div className="mb-6">
                <h4 className="text-md font-medium text-gray-300 mb-3">Current Assignments:</h4>
                <div className="space-y-2">
                  {artist.events.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-md">
                      <div>
                        <div className="font-medium text-white">{event.title}</div>
                        <div className="text-sm text-gray-400">
                          {new Date(event.date).toLocaleDateString()} • {event.venue.name}
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveFromEvent(event.id)}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Assign to New Event */}
            <div>
              <h4 className="text-md font-medium text-gray-300 mb-3">Assign to Event:</h4>
              <div className="grid grid-cols-1 gap-3">
                {availableEvents
                  .filter(event => !artist.events?.some(artistEvent => artistEvent.id === event.id))
                  .slice(0, 10) // Show first 10 available events
                  .map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-md">
                      <div>
                        <div className="font-medium text-white">{event.title}</div>
                        <div className="text-sm text-gray-400">
                          {new Date(event.date).toLocaleDateString()} • {event.venue.name}
                        </div>
                      </div>
                      <button
                        onClick={() => handleAssignToEvent(event.id)}
                        className="px-3 py-1 bg-music-purple-600 text-white text-sm rounded hover:bg-music-purple-700 transition-colors"
                      >
                        Assign
                      </button>
                    </div>
                  ))
                }
                {availableEvents.filter(event => !artist.events?.some(artistEvent => artistEvent.id === event.id)).length === 0 && (
                  <div className="text-gray-400 text-center py-4">
                    No available events to assign (all events are already assigned to this artist)
                  </div>
                )}
                {availableEvents.length === 0 && (
                  <div className="text-gray-400 text-center py-4">
                    No events found in the database
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Music Integration Status */}
          {(artist.spotifyId || artist.lastfmListeners || artist.lastfmBio || artist.musicbrainzId) && (
            <div className="bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-white mb-6">Music Integration Status</h3>
              <div className="space-y-4">
                {/* Spotify Integration */}
                {artist.spotifyId && (
                  <div className="p-4 bg-green-900 border border-green-700 rounded-md">
                    <h4 className="text-green-300 font-medium mb-2">🎵 Spotify Integration Active</h4>
                    <div className="text-sm text-green-200 space-y-1">
                      {artist.spotifyFollowers && (
                        <p>Followers: {artist.spotifyFollowers.toLocaleString()}</p>
                      )}
                      {artist.spotifyPopularity && (
                        <p>Popularity: {artist.spotifyPopularity}%</p>
                      )}
                      {artist.lastSpotifySync && (
                        <p>Last synced: {new Date(artist.lastSpotifySync).toLocaleDateString()}</p>
                      )}
                      {artist.spotifyGenres && artist.spotifyGenres.length > 0 && (
                        <p>Spotify genres: {artist.spotifyGenres.join(', ')}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Last.fm Integration */}
                {(artist.lastfmListeners || artist.lastfmPlaycount || artist.lastfmBio || artist.lastfmTags?.length > 0) && (
                  <div className="p-4 bg-red-900 border border-red-700 rounded-md">
                    <h4 className="text-red-300 font-medium mb-2">🎧 Last.fm Integration Active</h4>
                    <div className="text-sm text-red-200 space-y-1">
                      {artist.lastfmListeners && (
                        <p>Listeners: {artist.lastfmListeners.toLocaleString()}</p>
                      )}
                      {artist.lastfmPlaycount && (
                        <p>Play count: {artist.lastfmPlaycount.toLocaleString()}</p>
                      )}
                      {artist.lastfmSync && (
                        <p>Last synced: {new Date(artist.lastfmSync).toLocaleDateString()}</p>
                      )}
                      {artist.lastfmTags && artist.lastfmTags.length > 0 && (
                        <p>Last.fm tags: {artist.lastfmTags.slice(0, 5).join(', ')}</p>
                      )}
                      {artist.lastfmBio && (
                        <p>Biography: {artist.lastfmBio.length > 100 ? `${artist.lastfmBio.substring(0, 100)}...` : artist.lastfmBio}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* MusicBrainz Integration */}
                {artist.musicbrainzId && (
                  <div className="p-4 bg-blue-900 border border-blue-700 rounded-md">
                    <h4 className="text-blue-300 font-medium mb-2">🎼 MusicBrainz Integration Active</h4>
                    <div className="text-sm text-blue-200 space-y-1">
                      <p>MBID: {artist.musicbrainzId}</p>
                      {artist.musicbrainzSync && (
                        <p>Last synced: {new Date(artist.musicbrainzSync).toLocaleDateString()}</p>
                      )}
                      {artist.musicbrainzUrls && artist.musicbrainzUrls.length > 0 && (
                        <div>
                          <p>Social links found: {artist.musicbrainzUrls.length}</p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {artist.musicbrainzUrls.slice(0, 4).map((link: any, index: number) => (
                              <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-800 text-blue-200">
                                {link.type === 'social network' && link.url.includes('facebook') && '📘 Facebook'}
                                {link.type === 'social network' && link.url.includes('instagram') && '📷 Instagram'}  
                                {link.type === 'social network' && link.url.includes('twitter') && '🐦 Twitter'}
                                {link.type === 'soundcloud' && '🎵 SoundCloud'}
                                {link.type === 'youtube' && '📹 YouTube'}
                                {link.type === 'official homepage' && '🌐 Website'}
                                {!(['social network', 'soundcloud', 'youtube', 'official homepage'].includes(link.type)) && `🔗 ${link.type}`}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}


          {/* Action Buttons */}
          <div className="flex justify-between items-center">
            <div className="flex space-x-4">
              <Link
                href="/admin/artists"
                className="bg-gray-600 text-white px-6 py-3 rounded-md hover:bg-gray-700 transition-colors"
              >
                Back to Artists
              </Link>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting || saving}
                className={`px-6 py-3 rounded-md text-white font-medium transition-colors ${
                  deleting || saving
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {deleting ? 'Deleting...' : 'Delete Artist'}
              </button>
            </div>
            <button
              type="submit"
              disabled={saving || deleting}
              className={`px-6 py-3 rounded-md text-white font-medium transition-colors ${
                saving || deleting
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-music-purple-600 hover:bg-music-purple-700'
              }`}
            >
              {saving ? 'Saving...' : 'Save Artist'}
            </button>
          </div>

          {error && (
            <div className="bg-red-900 border border-red-700 text-red-300 px-4 py-3 rounded">
              {error}
            </div>
          )}
        </form>
      </main>
    </div>
  )
}