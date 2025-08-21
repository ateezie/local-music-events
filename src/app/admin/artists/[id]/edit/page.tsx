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
  genre?: string // Make optional since we'll only use genres array
  genres?: string[]
  bio?: string
  image?: string
  website?: string
  hometown?: string
  facebook?: string
  instagram?: string
  twitter?: string
  spotify?: string
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
}

export default function EditArtistPage() {
  const [artist, setArtist] = useState<EditArtist | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [syncing, setSyncing] = useState(false)
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
          genres: safeJsonParse(data.spotifyGenres) // Use Spotify genres as default additional genres
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
          // Ensure genres is sent as array and set genre to first genre if not set
          genres: artist.genres || [],
          genre: artist.genre || (artist.genres && artist.genres.length > 0 ? artist.genres[0] : 'other')
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

  const addMember = () => {
    if (!artist) return
    const members = artist.members || []
    setArtist({ ...artist, members: [...members, ''] })
  }

  const updateMember = (index: number, value: string) => {
    if (!artist) return
    const members = [...(artist.members || [])]
    members[index] = value
    setArtist({ ...artist, members })
  }

  const removeMember = (index: number) => {
    if (!artist) return
    const members = [...(artist.members || [])]
    members.splice(index, 1)
    setArtist({ ...artist, members })
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
          genres: safeJsonParse(data.artist.spotifyGenres) // Use Spotify genres as additional genres
        }
        setArtist(processedArtist)
        
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
        
        // Auto-populate form fields with synced data
        const updatedArtist = { ...processedArtist }
        
        // Update biography from Last.fm (always populate if Last.fm has better content)
        if (processedArtist.lastfmBio) {
          // Use Last.fm bio if it's longer than current bio or current bio is generic/short
          const currentBioLength = (updatedArtist.bio || '').length
          const lastfmBioLength = processedArtist.lastfmBio.length
          
          if (!updatedArtist.bio || 
              lastfmBioLength > currentBioLength + 50 || 
              (currentBioLength < 200 && lastfmBioLength > 100)) {
            updatedArtist.bio = processedArtist.lastfmBio
          }
        }
        
        // Update image from Spotify if not set
        if (!updatedArtist.image && processedArtist.image) {
          updatedArtist.image = processedArtist.image
        }
        
        // Update genres from Spotify genres (now we only use genres array, no primary genre)
        if (processedArtist.spotifyGenres?.length > 0) {
          // Map Spotify genres to our genre options
          const genreMapping: { [key: string]: string } = {
            'tech house': 'house',
            'chicago house': 'house',
            'deep house': 'house',
            'house': 'house',
            'techno': 'techno',
            'electronic': 'house',
            'dance': 'house',
            'trance': 'trance',
            'drum and bass': 'drum-and-bass',
            'dubstep': 'dubstep',
            'uk garage': 'ukg',
            'garage': 'ukg',
            'hip hop': 'hip-hop',
            'rock': 'rock',
            'indie rock': 'indie-rock',
            'jazz': 'jazz',
            'folk': 'folk',
            'acoustic': 'acoustic'
          }
          
          // Map all Spotify genres to our genre options
          const mappedGenres = processedArtist.spotifyGenres.map((g: string) => {
            const mapped = genreMapping[g.toLowerCase()]
            return mapped || g.toLowerCase().replace(/\s+/g, '-')
          }).filter(Boolean)
          
          if (mappedGenres.length > 0) {
            // Replace existing genres with mapped Spotify genres if we don't have any, or merge them
            const existingGenres = updatedArtist.genres || []
            if (existingGenres.length === 0) {
              updatedArtist.genres = [...new Set(mappedGenres)]
            } else {
              updatedArtist.genres = [...new Set([...existingGenres, ...mappedGenres])]
            }
          }
        }
        
        // Update social media fields from MusicBrainz
        if (processedArtist.musicbrainzUrls?.length > 0) {
          processedArtist.musicbrainzUrls.forEach((link: any) => {
            const url = link.url
            
            // Check URL content for platform detection
            if (url.includes('facebook.com') && !updatedArtist.facebook) {
              updatedArtist.facebook = url
            } else if (url.includes('instagram.com') && !updatedArtist.instagram) {
              updatedArtist.instagram = url
            } else if (url.includes('twitter.com') && !updatedArtist.twitter) {
              updatedArtist.twitter = url
            } else if (url.includes('soundcloud.com') && !updatedArtist.soundcloud) {
              updatedArtist.soundcloud = url
            } else if (link.type === 'official homepage' && !updatedArtist.website) {
              updatedArtist.website = url
            }
          })
        }
        
        // Extract hometown from MusicBrainz area data (if available in future)
        // Note: MusicBrainz area data needs to be fetched separately with area includes
        
        // Update Spotify URL from synced data
        if (processedArtist.spotifyUrl && !updatedArtist.spotify) {
          updatedArtist.spotify = processedArtist.spotifyUrl
        }
        
        // Merge Last.fm tags with existing tags
        if (processedArtist.lastfmTags?.length > 0) {
          const existingTags = updatedArtist.tags || []
          const newTags = processedArtist.lastfmTags.filter((tag: string) => 
            !existingTags.includes(tag.toLowerCase())
          ).slice(0, 5) // Limit to 5 new tags
          if (newTags.length > 0) {
            updatedArtist.tags = [...existingTags, ...newTags.map((t: string) => t.toLowerCase())]
          }
        }
        
        setArtist(updatedArtist)
        
        const detailsText = syncDetails.length > 0 ? `\n\nSynced data:\n• ${syncDetails.join('\n• ')}` : ''
        alert(`✅ Music data synced successfully!${detailsText}`)
      } else {
        const errorData = await response.json()
        let errorMessage = errorData.error || 'Unknown error occurred'
        
        // Provide helpful error messages
        if (errorMessage.includes('credentials not configured')) {
          errorMessage += '\n\n💡 Setup Guide:\n1. Visit https://developer.spotify.com/dashboard\n2. Create a new app\n3. Add SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET to .env.local\n4. Restart the development server'
        } else if (errorMessage.includes('not found on Spotify')) {
          errorMessage += '\n\n💡 Try:\n• Adding the Spotify URL manually\n• Checking the artist name spelling\n• Searching for alternative artist names'
        }
        
        setError(`Spotify sync failed: ${errorMessage}`)
      }
    } catch (error) {
      console.error('Spotify sync error:', error)
      setError(`Network error during Spotify sync: ${error.message}`)
    } finally {
      setSyncing(false)
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
              
              {/* Spotify Sync Button */}
              <div className="flex items-center space-x-3">
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
                    Hometown
                  </label>
                  <input
                    type="text"
                    value={artist.hometown || ''}
                    onChange={(e) => updateArtist('hometown', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-music-purple-500 bg-gray-700 text-white"
                    placeholder="e.g., Chicago, IL"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Biography
                </label>
                <textarea
                  rows={4}
                  value={artist.bio || ''}
                  onChange={(e) => updateArtist('bio', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-music-purple-500 bg-gray-700 text-white"
                  placeholder="Tell us about this artist..."
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
            </div>

            {/* Music Integration Status */}
            {(artist.spotifyId || artist.lastfmBio || artist.musicbrainzId) && (
              <div className="mt-6 space-y-4">
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
                {artist.lastfmBio && (
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
                      <p>Biography: {artist.lastfmBio.length > 100 ? `${artist.lastfmBio.substring(0, 100)}...` : artist.lastfmBio}</p>
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
            )}
          </div>

          {/* Band Members */}
          <div className="bg-gray-800 rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-white">Band Members</h3>
              <button
                type="button"
                onClick={addMember}
                className="bg-music-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-music-purple-700"
              >
                + Add Member
              </button>
            </div>
            <div className="space-y-3">
              {(artist.members || []).map((member, index) => (
                <div key={index} className="flex space-x-3">
                  <input
                    type="text"
                    value={member}
                    onChange={(e) => updateMember(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-music-purple-500 bg-gray-700 text-white"
                    placeholder="Member name"
                  />
                  <button
                    type="button"
                    onClick={() => removeMember(index)}
                    className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
              {(!artist.members || artist.members.length === 0) && (
                <p className="text-gray-400 text-sm">No band members added. Click "Add Member" to start.</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <Link
              href="/admin/artists"
              className="bg-gray-600 text-white px-6 py-3 rounded-md hover:bg-gray-700 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className={`px-6 py-3 rounded-md text-white font-medium transition-colors ${
                saving
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