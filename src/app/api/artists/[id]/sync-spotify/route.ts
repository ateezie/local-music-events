import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

// Spotify Web API credentials - you'll need to set these up
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET

// Get Spotify access token using Client Credentials flow
async function getSpotifyAccessToken() {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')}`
    },
    body: 'grant_type=client_credentials'
  })

  if (!response.ok) {
    throw new Error('Failed to get Spotify access token')
  }

  const data = await response.json()
  return data.access_token
}

// Search for artist on Spotify
async function searchSpotifyArtist(artistName: string, accessToken: string) {
  const encodedName = encodeURIComponent(artistName)
  const response = await fetch(
    `https://api.spotify.com/v1/search?q=${encodedName}&type=artist&limit=1`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }
  )

  if (!response.ok) {
    throw new Error('Failed to search Spotify artist')
  }

  const data = await response.json()
  return data.artists.items[0] || null
}

// Get artist's top tracks
async function getArtistTopTracks(spotifyId: string, accessToken: string) {
  const response = await fetch(
    `https://api.spotify.com/v1/artists/${spotifyId}/top-tracks?market=US`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }
  )

  if (!response.ok) {
    throw new Error('Failed to get artist top tracks')
  }

  const data = await response.json()
  return data.tracks
}

// Get artist's albums
async function getArtistAlbums(spotifyId: string, accessToken: string) {
  const response = await fetch(
    `https://api.spotify.com/v1/artists/${spotifyId}/albums?include_groups=album,single&market=US&limit=10`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }
  )

  if (!response.ok) {
    throw new Error('Failed to get artist albums')
  }

  const data = await response.json()
  return data.items
}

// Extract Spotify ID from Spotify URL
function extractSpotifyId(spotifyUrl: string): string | null {
  const match = spotifyUrl.match(/artist\/([a-zA-Z0-9]+)/)
  return match ? match[1] : null
}

// POST /api/artists/[id]/sync-spotify - Sync artist data with Spotify
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Verify admin authentication
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    // Check if Spotify credentials are configured
    if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
      return NextResponse.json(
        { error: 'Spotify API credentials not configured' },
        { status: 500 }
      )
    }

    // Get artist from database
    const artist = await prisma.artist.findUnique({
      where: { id }
    })

    if (!artist) {
      return NextResponse.json(
        { error: 'Artist not found' },
        { status: 404 }
      )
    }

    // Get Spotify access token
    const accessToken = await getSpotifyAccessToken()
    
    let spotifyArtist = null
    let spotifyId = artist.spotifyId

    // If we have a Spotify ID, use it directly
    if (spotifyId) {
      try {
        const response = await fetch(`https://api.spotify.com/v1/artists/${spotifyId}`, {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        })
        if (response.ok) {
          spotifyArtist = await response.json()
        }
      } catch (error) {
        console.log('Error fetching by Spotify ID, will search by name')
      }
    }

    // If we have a Spotify URL but no ID, extract the ID
    if (!spotifyId && artist.spotify) {
      spotifyId = extractSpotifyId(artist.spotify)
      if (spotifyId) {
        try {
          const response = await fetch(`https://api.spotify.com/v1/artists/${spotifyId}`, {
            headers: { 'Authorization': `Bearer ${accessToken}` }
          })
          if (response.ok) {
            spotifyArtist = await response.json()
          }
        } catch (error) {
          console.log('Error fetching by extracted Spotify ID')
        }
      }
    }

    // If we still don't have artist data, search by name
    if (!spotifyArtist) {
      spotifyArtist = await searchSpotifyArtist(artist.name, accessToken)
      if (spotifyArtist) {
        spotifyId = spotifyArtist.id
      }
    }

    if (!spotifyArtist) {
      return NextResponse.json(
        { error: 'Artist not found on Spotify' },
        { status: 404 }
      )
    }

    // Get additional data
    const [topTracks, albums] = await Promise.all([
      getArtistTopTracks(spotifyId!, accessToken),
      getArtistAlbums(spotifyId!, accessToken)
    ])

    // Process the data
    const spotifyData = {
      spotifyId: spotifyArtist.id,
      spotifyUrl: spotifyArtist.external_urls.spotify,
      spotifyPopularity: spotifyArtist.popularity,
      spotifyFollowers: spotifyArtist.followers.total,
      spotifyGenres: JSON.stringify(spotifyArtist.genres || []),
      spotifyTopTracks: JSON.stringify(topTracks.slice(0, 10).map((track: any) => ({
        id: track.id,
        name: track.name,
        preview_url: track.preview_url,
        external_urls: track.external_urls,
        duration_ms: track.duration_ms,
        popularity: track.popularity,
        album: {
          id: track.album.id,
          name: track.album.name,
          images: track.album.images
        }
      }))),
      spotifyAlbums: JSON.stringify(albums.map((album: any) => ({
        id: album.id,
        name: album.name,
        release_date: album.release_date,
        images: album.images,
        external_urls: album.external_urls,
        album_type: album.album_type,
        total_tracks: album.total_tracks
      }))),
      lastSpotifySync: new Date()
    }

    // Update bio if it's empty and Spotify has genres
    const updateData: any = { ...spotifyData }
    if (!artist.bio && spotifyArtist.genres && spotifyArtist.genres.length > 0) {
      updateData.bio = `${artist.name} is known for ${spotifyArtist.genres.join(', ')} music with ${spotifyArtist.followers.total.toLocaleString()} followers on Spotify.`
    }

    // Update image if it's empty and Spotify has images
    if (!artist.image && spotifyArtist.images && spotifyArtist.images.length > 0) {
      updateData.image = spotifyArtist.images[0].url
    }

    // Update artist in database
    const updatedArtist = await prisma.artist.update({
      where: { id },
      data: updateData,
      include: {
        _count: {
          select: {
            events: true
          }
        }
      }
    })

    // Transform response
    const transformedArtist = {
      ...updatedArtist,
      members: updatedArtist.members ? JSON.parse(updatedArtist.members) : [],
      tags: updatedArtist.tags ? JSON.parse(updatedArtist.tags) : [],
      spotifyGenres: updatedArtist.spotifyGenres ? JSON.parse(updatedArtist.spotifyGenres) : [],
      spotifyTopTracks: updatedArtist.spotifyTopTracks ? JSON.parse(updatedArtist.spotifyTopTracks) : [],
      spotifyAlbums: updatedArtist.spotifyAlbums ? JSON.parse(updatedArtist.spotifyAlbums) : []
    }

    return NextResponse.json({
      success: true,
      artist: transformedArtist,
      message: 'Spotify data synced successfully'
    })

  } catch (error) {
    console.error('Spotify sync error:', error)
    return NextResponse.json(
      { error: 'Failed to sync Spotify data: ' + error.message },
      { status: 500 }
    )
  }
}