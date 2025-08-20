'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import MusicLogo from '@/components/MusicLogo'
import AdminHeader from '@/components/AdminHeader'

interface Artist {
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
  createdAt: string
  updatedAt: string
  _count?: {
    events: number
  }
}

interface AdminUser {
  id: string
  email: string
  name: string
  role: string
}

export default function AdminArtists() {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [artists, setArtists] = useState<Artist[]>([])
  const [loading, setLoading] = useState(true)
  const [artistsLoading, setArtistsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterGenre, setFilterGenre] = useState<string>('all')
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.push('/admin')
      return
    }

    // Verify authentication
    fetch('/api/auth/verify', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      if (data.valid) {
        setUser(data.user)
        loadArtists()
      } else {
        localStorage.removeItem('admin_token')
        router.push('/admin')
      }
    })
    .catch(() => {
      localStorage.removeItem('admin_token')
      router.push('/admin')
    })
    .finally(() => setLoading(false))
  }, [router])

  const loadArtists = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch('/api/artists', {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        setArtists(data.artists || [])
      } else {
        console.error('Failed to load artists')
      }
    } catch (error) {
      console.error('Error loading artists:', error)
    } finally {
      setArtistsLoading(false)
    }
  }

  const handleDeleteArtist = async (id: string, artistName: string) => {
    if (!confirm(`Are you sure you want to delete "${artistName}"?\n\nThis action cannot be undone.`)) return

    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/artists/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.ok) {
        alert(`✅ Artist "${artistName}" deleted successfully!`)
        loadArtists() // Reload artists
      } else {
        const errorData = await response.json()
        alert('Error deleting artist: ' + errorData.error)
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('Error deleting artist: ' + error.message)
    }
  }

  const syncSpotifyData = async (artist: Artist) => {
    if (!artist.spotifyId && !artist.spotify) {
      alert('No Spotify ID or URL found for this artist')
      return
    }

    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/artists/${artist.id}/sync-spotify`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.ok) {
        alert('✅ Spotify data synced successfully!')
        loadArtists() // Reload artists to see updated data
      } else {
        const errorData = await response.json()
        alert('Error syncing Spotify data: ' + errorData.error)
      }
    } catch (error) {
      console.error('Spotify sync error:', error)
      alert('Error syncing Spotify data: ' + error.message)
    }
  }

  // Get unique genres for filter
  const genres = Array.from(new Set(artists.map(artist => artist.genre))).filter(Boolean)

  // Filter artists based on search term and genre
  const filteredArtists = artists.filter(artist => {
    const matchesSearch = searchTerm === '' || 
      artist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artist.hometown?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artist.bio?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesGenre = filterGenre === 'all' || artist.genre === filterGenre

    return matchesSearch && matchesGenre
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <MusicLogo className="h-16 w-16 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-400">Loading artists management...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <AdminHeader title="Artist Management" />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header and Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Artists</h2>
            <p className="text-gray-400">Manage artist profiles and Spotify integrations</p>
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 mt-4 sm:mt-0">
            <Link
              href="/admin/artists/new"
              className="bg-music-purple-600 text-white px-4 py-2 rounded-md hover:bg-music-purple-700 text-center"
            >
              ➕ Add Artist
            </Link>
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex-1">
              <label htmlFor="search" className="block text-sm font-medium text-gray-300 mb-2">
                Search Artists
              </label>
              <input
                type="text"
                id="search"
                placeholder="Search by name, hometown, or bio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-music-purple-600 focus:border-transparent"
              />
            </div>
            
            <div>
              <label htmlFor="filter" className="block text-sm font-medium text-gray-300 mb-2">
                Filter by Genre
              </label>
              <select
                id="filter"
                value={filterGenre}
                onChange={(e) => setFilterGenre(e.target.value)}
                className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-music-purple-600 focus:border-transparent"
              >
                <option value="all">All Genres ({artists.length})</option>
                {genres.map(genre => (
                  <option key={genre} value={genre}>
                    {genre.charAt(0).toUpperCase() + genre.slice(1)} ({artists.filter(a => a.genre === genre).length})
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {filteredArtists.length !== artists.length && (
            <div className="mt-4 text-sm text-gray-400">
              Showing {filteredArtists.length} of {artists.length} artists
            </div>
          )}
        </div>

        {/* Artists Table */}
        <div className="bg-gray-800 rounded-lg shadow overflow-hidden">
          {artistsLoading ? (
            <div className="p-8 text-center">
              <p className="text-gray-400">Loading artists...</p>
            </div>
          ) : filteredArtists.length === 0 ? (
            <div className="p-8 text-center">
              {searchTerm || filterGenre !== 'all' ? (
                <div>
                  <p className="text-gray-400 mb-2">No artists match your search criteria.</p>
                  <button 
                    onClick={() => {
                      setSearchTerm('')
                      setFilterGenre('all')
                    }}
                    className="text-music-purple-600 hover:text-music-purple-700"
                  >
                    Clear filters
                  </button>
                </div>
              ) : (
                <p className="text-gray-400">No artists found. Start by adding new artists.</p>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Artist Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Genre & Info
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Spotify Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800">
                  {filteredArtists.map((artist) => (
                    <tr key={artist.id} className="hover:bg-gray-700 border-b border-gray-700">
                      <td className="px-6 py-4">
                        <div className="flex items-start">
                          {/* Artist Image */}
                          {artist.image && (
                            <div className="flex-shrink-0 mr-4">
                              <img
                                src={artist.image}
                                alt={artist.name}
                                className="w-16 h-16 rounded-full object-cover"
                              />
                            </div>
                          )}
                          
                          {/* Artist Info */}
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-white mb-1">
                              <Link
                                href={`/admin/artists/${artist.id}/edit`}
                                className="text-white hover:text-music-purple-600 hover:underline"
                              >
                                {artist.name}
                              </Link>
                            </div>
                            
                            {artist.hometown && (
                              <div className="text-sm text-gray-400 mb-1">
                                📍 {artist.hometown}
                              </div>
                            )}
                            
                            {artist.formed && (
                              <div className="text-xs text-gray-500">
                                📅 Formed {artist.formed}
                              </div>
                            )}
                            
                            <div className="text-xs text-gray-500 mt-1">
                              🎵 {artist._count?.events || 0} events
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        <div className="font-medium mb-1">
                          <span className="bg-music-purple-600 text-white px-2 py-1 rounded text-xs">
                            {artist.genre.charAt(0).toUpperCase() + artist.genre.slice(1)}
                          </span>
                        </div>
                        {artist.members && Array.isArray(artist.members) && artist.members.length > 0 && (
                          <div className="text-xs text-gray-400">
                            👥 {artist.members.length} member{artist.members.length !== 1 ? 's' : ''}
                          </div>
                        )}
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col space-y-1">
                          {artist.spotifyId ? (
                            <div className="text-sm">
                              <div className="text-green-600 font-medium">🎵 Connected</div>
                              {artist.spotifyFollowers && (
                                <div className="text-xs text-gray-400">
                                  {artist.spotifyFollowers.toLocaleString()} followers
                                </div>
                              )}
                              {artist.spotifyPopularity && (
                                <div className="text-xs text-gray-400">
                                  {artist.spotifyPopularity}% popularity
                                </div>
                              )}
                              {artist.lastSpotifySync && (
                                <div className="text-xs text-gray-500">
                                  Synced {new Date(artist.lastSpotifySync).toLocaleDateString()}
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="text-sm text-gray-400">
                              ⚠️ Not connected
                            </div>
                          )}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-3">
                          {artist.spotifyId || artist.spotify ? (
                            <button
                              onClick={() => syncSpotifyData(artist)}
                              className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium text-green-600 hover:text-green-700 hover:bg-green-50 transition-colors"
                            >
                              🔄 Sync Spotify
                            </button>
                          ) : null}
                          
                          <Link
                            href={`/admin/artists/${artist.id}/edit`}
                            className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                          >
                            ✏️ Edit
                          </Link>
                          
                          <Link
                            href={`/artists/${artist.id}`}
                            target="_blank"
                            className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium text-green-600 hover:text-green-700 hover:bg-green-50 transition-colors"
                          >
                            👁️ View
                          </Link>
                          
                          <button
                            onClick={() => handleDeleteArtist(artist.id, artist.name)}
                            className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}