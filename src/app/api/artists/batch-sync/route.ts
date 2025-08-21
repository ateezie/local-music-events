import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

// Spotify Web API credentials
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET

// Last.fm API credentials
const LASTFM_API_KEY = process.env.LASTFM_API_KEY

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
  
  const withoutTags = bioHtml
    .replace(/<[^>]*>/g, '')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .trim()

  return withoutTags.replace(/\s*Read more on Last\.fm.*$/i, '').trim()
}

// Search for artist on MusicBrainz
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
    
    const socialUrls: any[] = []
    if (data.relations) {
      data.relations.forEach((relation: any) => {
        if (relation.type === 'social network' || 
            relation.type === 'youtube' ||
            relation.type === 'bandcamp' ||
            relation.type === 'soundcloud' ||
            relation.type === 'official homepage' ||
            relation.type === 'myspace' ||
            relation.type === 'free streaming' ||
            relation.type === 'streaming' ||
            relation.type === 'other databases') {
          socialUrls.push({
            type: relation.type,
            url: relation.url.resource,
            target_type: relation['target-type']
          })
        }
      })
    }
    
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

// Sync a single artist with all APIs
async function syncSingleArtist(artist: any, accessToken: string) {
  try {
    let spotifyArtist = null
    let spotifyId = artist.spotifyId

    // Get Spotify data
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

    if (!spotifyArtist) {
      spotifyArtist = await searchSpotifyArtist(artist.name, accessToken)
      if (spotifyArtist) {
        spotifyId = spotifyArtist.id
      }
    }

    if (!spotifyArtist) {
      return {
        success: false,
        artistId: artist.id,
        artistName: artist.name,
        error: 'Artist not found on Spotify'
      }
    }

    // Get additional data from all APIs
    const [topTracks, albums, lastfmData, musicbrainzArtist] = await Promise.all([
      getArtistTopTracks(spotifyId!, accessToken),
      getArtistAlbums(spotifyId!, accessToken),
      getLastfmArtistInfo(artist.name),
      searchMusicBrainzArtist(artist.name)
    ])

    // Get MusicBrainz URLs and location data
    let musicbrainzUrls: any[] = []
    let musicbrainzHometown = ''
    if (musicbrainzArtist && musicbrainzArtist.id) {
      const musicbrainzData = await getMusicBrainzArtistUrls(musicbrainzArtist.id)
      musicbrainzUrls = musicbrainzData.urls
      musicbrainzHometown = musicbrainzData.hometown
    }

    // Process Spotify data
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

    // Process Last.fm data
    let lastfmBio = ''
    let lastfmListeners = 0
    let lastfmPlaycount = 0
    let lastfmTags: string[] = []

    if (lastfmData) {
      if (lastfmData.bio?.content) {
        lastfmBio = cleanBioText(lastfmData.bio.content)
      }
      lastfmListeners = parseInt(lastfmData.stats?.listeners || '0')
      lastfmPlaycount = parseInt(lastfmData.stats?.playcount || '0')
      if (lastfmData.tags?.tag) {
        lastfmTags = Array.isArray(lastfmData.tags.tag) 
          ? lastfmData.tags.tag.map((t: any) => t.name).slice(0, 10)
          : [lastfmData.tags.tag.name]
      }
    }

    // Combine all data
    const updateData: any = {
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

    // Update bio if better content is available
    if (lastfmBio && lastfmBio.length > 100) {
      const currentBioLength = (artist.bio || '').length
      if (!artist.bio || 
          lastfmBio.length > currentBioLength + 50 || 
          (currentBioLength < 200 && lastfmBio.length > 100)) {
        updateData.bio = lastfmBio
      }
    } else if (!artist.bio && spotifyArtist.genres && spotifyArtist.genres.length > 0) {
      const popularityText = spotifyArtist.popularity > 70 ? 'highly popular' : 
                            spotifyArtist.popularity > 50 ? 'well-known' : 
                            spotifyArtist.popularity > 30 ? 'emerging' : 'rising'
      
      const followerCount = spotifyArtist.followers.total.toLocaleString()
      const genreText = spotifyArtist.genres.length > 1 ? 
        `${spotifyArtist.genres.slice(0, -1).join(', ')} and ${spotifyArtist.genres.slice(-1)[0]}` :
        spotifyArtist.genres[0]
      
      updateData.bio = `${artist.name} is a ${popularityText} artist in the ${genreText} scene. With ${followerCount} followers on Spotify and a popularity score of ${spotifyArtist.popularity}%, they have established themselves as a notable presence in the electronic music community.`
    }

    // Update image if needed
    if (!artist.image && spotifyArtist.images && spotifyArtist.images.length > 0) {
      updateData.image = spotifyArtist.images[0].url
    }
    
    // Update hometown from MusicBrainz
    if (musicbrainzHometown) {
      updateData.hometown = musicbrainzHometown
    }
    
    // Update social media from MusicBrainz URLs
    if (musicbrainzUrls?.length > 0) {
      musicbrainzUrls.forEach((link: any) => {
        const url = link.url
        if (url.includes('facebook.com')) {
          updateData.facebook = url
        } else if (url.includes('instagram.com')) {
          updateData.instagram = url
        } else if (url.includes('twitter.com')) {
          updateData.twitter = url
        } else if (url.includes('soundcloud.com')) {
          updateData.soundcloud = url
        } else if (url.includes('spotify.com/artist/')) {
          updateData.spotify = url
        } else if (link.type === 'official homepage' && !artist.website) {
          updateData.website = url
        } else if (link.type === 'other databases' && url.includes('ra.co') && !artist.website) {
          updateData.website = url
        }
      })
    }

    // Update artist in database
    await prisma.artist.update({
      where: { id: artist.id },
      data: updateData
    })

    return {
      success: true,
      artistId: artist.id,
      artistName: artist.name,
      spotifyFound: !!spotifyArtist,
      lastfmFound: !!lastfmData,
      musicbrainzFound: !!musicbrainzArtist
    }

  } catch (error) {
    console.error(`Error syncing artist ${artist.name}:`, error)
    return {
      success: false,
      artistId: artist.id,
      artistName: artist.name,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// POST /api/artists/batch-sync - Batch sync all artists
export async function POST(request: NextRequest) {
  try {
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

    // Get request body to check for specific artist IDs
    const body = await request.json().catch(() => ({}))
    const { artistIds } = body

    // Get artists to sync
    let artists
    if (artistIds && Array.isArray(artistIds) && artistIds.length > 0) {
      // Sync specific artists
      artists = await prisma.artist.findMany({
        where: {
          id: {
            in: artistIds
          }
        }
      })
    } else {
      // Sync all artists
      artists = await prisma.artist.findMany()
    }

    if (!artists || artists.length === 0) {
      return NextResponse.json(
        { error: 'No artists found to sync' },
        { status: 404 }
      )
    }

    // Get Spotify access token
    const accessToken = await getSpotifyAccessToken()
    
    // Sync artists in batches to avoid overwhelming the APIs
    const batchSize = 5 // Process 5 artists at a time
    const results = []
    
    for (let i = 0; i < artists.length; i += batchSize) {
      const batch = artists.slice(i, i + batchSize)
      
      // Process batch in parallel
      const batchPromises = batch.map(artist => syncSingleArtist(artist, accessToken))
      const batchResults = await Promise.all(batchPromises)
      
      results.push(...batchResults)
      
      // Add delay between batches to respect API rate limits
      if (i + batchSize < artists.length) {
        await new Promise(resolve => setTimeout(resolve, 1000)) // 1 second delay
      }
    }

    // Calculate statistics
    const successful = results.filter(r => r.success)
    const failed = results.filter(r => !r.success)
    const spotifyFound = results.filter(r => r.spotifyFound)
    const lastfmFound = results.filter(r => r.lastfmFound)
    const musicbrainzFound = results.filter(r => r.musicbrainzFound)

    return NextResponse.json({
      success: true,
      message: `Batch sync completed`,
      statistics: {
        total: results.length,
        successful: successful.length,
        failed: failed.length,
        spotifyMatches: spotifyFound.length,
        lastfmMatches: lastfmFound.length,
        musicbrainzMatches: musicbrainzFound.length
      },
      results: results,
      failedArtists: failed.map(f => ({
        id: f.artistId,
        name: f.artistName,
        error: f.error
      }))
    })

  } catch (error) {
    console.error('Batch sync error:', error)
    return NextResponse.json(
      { error: 'Failed to perform batch sync: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    )
  }
}