import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

// Spotify Web API credentials
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET

// Last.fm API credentials
const LASTFM_API_KEY = process.env.LASTFM_API_KEY

// MusicBrainz API credentials
const MUSICBRAINZ_CLIENT_ID = process.env.MUSICBRAINZ_CLIENT_ID
const MUSICBRAINZ_CLIENT_SECRET = process.env.MUSICBRAINZ_CLIENT_SECRET

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

// Get artist information from Last.fm
async function getLastfmArtistInfo(artistName: string) {
  try {
    const encodedName = encodeURIComponent(artistName)
    const response = await fetch(
      `https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${encodedName}&api_key=${LASTFM_API_KEY}&format=json`
    )

    if (!response.ok) {
      throw new Error('Failed to fetch Last.fm artist info')
    }

    const data = await response.json()
    return data.artist || null
  } catch (error) {
    console.error('Last.fm API error:', error)
    return null
  }
}

// Clean HTML tags from Last.fm biography
function cleanBioText(bioHtml: string): string {
  if (!bioHtml) return ''
  
  // Remove HTML tags and decode entities
  const withoutTags = bioHtml
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .trim()

  // Remove "Read more on Last.fm" footer
  return withoutTags.replace(/\s*Read more on Last\.fm.*$/i, '').trim()
}

// Search for artist on MusicBrainz with location data
async function searchMusicBrainzArtist(artistName: string) {
  try {
    const encodedName = encodeURIComponent(artistName)
    const response = await fetch(
      `https://musicbrainz.org/ws/2/artist?query=${encodedName}&fmt=json&inc=area-rels`,
      {
        headers: {
          'User-Agent': 'LocalMusicEvents/1.0 (hello@alexthip.com)'
        }
      }
    )

    if (!response.ok) {
      throw new Error('Failed to search MusicBrainz artist')
    }

    const data = await response.json()
    return data.artists && data.artists.length > 0 ? data.artists[0] : null
  } catch (error) {
    console.error('MusicBrainz search error:', error)
    return null
  }
}

// Get artist URLs and area info from MusicBrainz
async function getMusicBrainzArtistUrls(mbid: string) {
  try {
    const response = await fetch(
      `https://musicbrainz.org/ws/2/artist/${mbid}?inc=url-rels+area-rels&fmt=json`,
      {
        headers: {
          'User-Agent': 'LocalMusicEvents/1.0 (hello@alexthip.com)'
        }
      }
    )

    if (!response.ok) {
      throw new Error('Failed to get MusicBrainz artist URLs')
    }

    const data = await response.json()
    
    // Extract social media URLs from relations
    const socialUrls: any[] = []
    if (data.relations) {
      data.relations.forEach((relation: any) => {
        // Include various social media and relevant URL types
        if (relation.type === 'social network' || 
            relation.type === 'youtube' ||
            relation.type === 'bandcamp' ||
            relation.type === 'soundcloud' ||
            relation.type === 'official homepage' ||
            relation.type === 'myspace') {
          socialUrls.push({
            type: relation.type,
            url: relation.url.resource,
            target_type: relation['target-type']
          })
        }
      })
    }
    
    // Extract area/location information - prioritize begin-area (birth place) over area (current location)
    let hometown = ''
    if (data['begin-area']) {
      hometown = data['begin-area'].name
    } else if (data.area) {
      hometown = data.area.name
    }
    
    return {
      urls: socialUrls,
      hometown: hometown
    }
  } catch (error) {
    console.error('MusicBrainz URLs error:', error)
    return { urls: [], hometown: '' }
  }
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

    // Check if API credentials are configured
    if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
      return NextResponse.json(
        { error: 'Spotify API credentials not configured' },
        { status: 500 }
      )
    }

    if (!LASTFM_API_KEY) {
      return NextResponse.json(
        { error: 'Last.fm API credentials not configured' },
        { status: 500 }
      )
    }

    // MusicBrainz doesn't require credentials for basic API access

    // Get artist from database (support both ID and slug)
    const artist = await prisma.artist.findFirst({
      where: {
        OR: [
          { id },
          { slug: id }
        ]
      }
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

    // Get additional data from Spotify, Last.fm, and MusicBrainz
    const [topTracks, albums, lastfmData, musicbrainzArtist] = await Promise.all([
      getArtistTopTracks(spotifyId!, accessToken),
      getArtistAlbums(spotifyId!, accessToken),
      getLastfmArtistInfo(artist.name),
      searchMusicBrainzArtist(artist.name)
    ])

    // Get MusicBrainz URLs and location data if we found an artist
    let musicbrainzUrls: any[] = []
    let musicbrainzHometown = ''
    if (musicbrainzArtist && musicbrainzArtist.id) {
      const musicbrainzData = await getMusicBrainzArtistUrls(musicbrainzArtist.id)
      musicbrainzUrls = musicbrainzData.urls
      musicbrainzHometown = musicbrainzData.hometown
    }

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

    // Add Last.fm data if available
    let lastfmBio = ''
    let lastfmListeners = 0
    let lastfmPlaycount = 0
    let lastfmTags: string[] = []

    if (lastfmData) {
      // Extract Last.fm biography
      if (lastfmData.bio?.content) {
        lastfmBio = cleanBioText(lastfmData.bio.content)
      }
      
      // Extract Last.fm stats
      lastfmListeners = parseInt(lastfmData.stats?.listeners || '0')
      lastfmPlaycount = parseInt(lastfmData.stats?.playcount || '0')
      
      // Extract Last.fm tags
      if (lastfmData.tags?.tag) {
        lastfmTags = Array.isArray(lastfmData.tags.tag) 
          ? lastfmData.tags.tag.map((t: any) => t.name).slice(0, 10)
          : [lastfmData.tags.tag.name]
      }
    }

    // Enhanced data object with Last.fm and MusicBrainz info
    const enhancedData = {
      ...spotifyData,
      lastfmBio,
      lastfmListeners,
      lastfmPlaycount,
      lastfmTags: JSON.stringify(lastfmTags),
      lastfmSync: lastfmData ? new Date() : null,
      musicbrainzId: musicbrainzArtist?.id || null,
      musicbrainzUrls: JSON.stringify(musicbrainzUrls),
      musicbrainzSync: musicbrainzArtist ? new Date() : null
    }

    // Bio generation priority: Last.fm > Enhanced Spotify > None
    const updateData: any = { ...enhancedData }
    
    // More aggressive bio population
    if (lastfmBio && lastfmBio.length > 100) {
      // Use Last.fm bio if it's substantial and better than current
      const currentBioLength = (artist.bio || '').length
      if (!artist.bio || 
          lastfmBio.length > currentBioLength + 50 || 
          (currentBioLength < 200 && lastfmBio.length > 100)) {
        updateData.bio = lastfmBio
      }
    } else if (!artist.bio && spotifyArtist.genres && spotifyArtist.genres.length > 0) {
      // Fallback to enhanced Spotify-generated bio
      const popularityText = spotifyArtist.popularity > 70 ? 'highly popular' : 
                            spotifyArtist.popularity > 50 ? 'well-known' : 
                            spotifyArtist.popularity > 30 ? 'emerging' : 'rising'
      
      const followerCount = spotifyArtist.followers.total.toLocaleString()
      const genreText = spotifyArtist.genres.length > 1 ? 
        `${spotifyArtist.genres.slice(0, -1).join(', ')} and ${spotifyArtist.genres.slice(-1)[0]}` :
        spotifyArtist.genres[0]
      
      updateData.bio = `${artist.name} is a ${popularityText} artist in the ${genreText} scene. With ${followerCount} followers on Spotify and a popularity score of ${spotifyArtist.popularity}%, they have established themselves as a notable presence in the electronic music community.`
    }

    // Update image if it's empty and Spotify has images
    if (!artist.image && spotifyArtist.images && spotifyArtist.images.length > 0) {
      updateData.image = spotifyArtist.images[0].url
    }
    
    // Update hometown from MusicBrainz if available and current is empty
    if (!artist.hometown && musicbrainzHometown) {
      updateData.hometown = musicbrainzHometown
    }

    // Add genres to update data if enhanced
    if (updateData.genres && Array.isArray(updateData.genres)) {
      updateData.genres = JSON.stringify(updateData.genres)
    }

    // Update artist in database
    const updatedArtist = await prisma.artist.update({
      where: { id: artist.id },
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
      genres: updatedArtist.genres ? JSON.parse(updatedArtist.genres) : [],
      spotifyGenres: updatedArtist.spotifyGenres ? JSON.parse(updatedArtist.spotifyGenres) : [],
      spotifyTopTracks: updatedArtist.spotifyTopTracks ? JSON.parse(updatedArtist.spotifyTopTracks) : [],
      spotifyAlbums: updatedArtist.spotifyAlbums ? JSON.parse(updatedArtist.spotifyAlbums) : [],
      lastfmTags: updatedArtist.lastfmTags ? JSON.parse(updatedArtist.lastfmTags) : [],
      musicbrainzUrls: updatedArtist.musicbrainzUrls ? JSON.parse(updatedArtist.musicbrainzUrls) : []
    }

    return NextResponse.json({
      success: true,
      artist: transformedArtist,
      message: 'Artist data synced successfully from Spotify, Last.fm, and MusicBrainz'
    })

  } catch (error) {
    console.error('Spotify sync error:', error)
    return NextResponse.json(
      { error: 'Failed to sync Spotify data: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    )
  }
}