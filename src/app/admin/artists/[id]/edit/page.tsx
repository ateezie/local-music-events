'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import MusicLogo from '@/components/MusicLogo'
import AdminHeader from '@/components/AdminHeader'

interface EditArtist {
  id: string
  name: string
  genre: string
  bio?: string
  image?: string
  website?: string
  hometown?: string
  formed?: string
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

  const loadArtist = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/artists/${artistId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        setArtist(data)
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
        body: JSON.stringify(artist)
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
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/artists/${artistId}/sync-spotify`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        setArtist(data.artist)
        alert('✅ Spotify data synced successfully!')
      } else {
        const errorData = await response.json()
        alert('Error syncing Spotify data: ' + errorData.error)
      }
    } catch (error) {
      console.error('Spotify sync error:', error)
      alert('Error syncing Spotify data: ' + error.message)
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
              <button
                type="button"
                onClick={syncSpotifyData}
                disabled={syncing}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {syncing ? '🔄 Syncing...' : '🎵 Sync with Spotify'}
              </button>
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
                    Primary Genre
                  </label>
                  <select
                    value={artist.genre}
                    onChange={(e) => updateArtist('genre', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-music-purple-500 bg-gray-700 text-white"
                    required
                  >
                    <option value="house">House</option>
                    <option value="techno">Techno</option>
                    <option value="trance">Trance</option>
                    <option value="drum-and-bass">Drum & Bass</option>
                    <option value="dubstep">Dubstep</option>
                    <option value="ukg">UK Garage</option>
                    <option value="hip-hop">Hip-Hop</option>
                    <option value="rock">Rock</option>
                    <option value="indie-rock">Indie Rock</option>
                    <option value="jazz">Jazz</option>
                    <option value="folk">Folk</option>
                    <option value="acoustic">Acoustic</option>
                    <option value="multi-genre">Multi-Genre</option>
                    <option value="other">Other</option>
                  </select>
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
                    Year Formed
                  </label>
                  <input
                    type="text"
                    value={artist.formed || ''}
                    onChange={(e) => updateArtist('formed', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-music-purple-500 bg-gray-700 text-white"
                    placeholder="e.g., 2015"
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

            {/* Spotify Integration Status */}
            {artist.spotifyId && (
              <div className="mt-6 p-4 bg-green-900 border border-green-700 rounded-md">
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