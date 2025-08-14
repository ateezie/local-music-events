'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import MusicLogo from '@/components/MusicLogo'
import ImageUpload from '@/components/ImageUpload'
import PromoterMultiSelect from '@/components/PromoterMultiSelect'
import GenreMultiSelect from '@/components/GenreMultiSelect'

interface EditEvent {
  id: string
  title: string
  slug?: string
  description: string
  date: string
  time: string
  endTime?: string
  genre: string
  subGenres?: string[]
  category: string
  promoter: string
  promoters?: string[]
  ticketUrl?: string
  facebookEvent?: string
  instagramPost?: string
  flyer?: string
  bannerImage?: string
  price: string
  ageRestriction?: string
  featured: boolean
  hero?: boolean
  status: string
  venue: {
    id: string
    name: string
    address: string
    city: string
    state: string
    zipCode?: string
    capacity?: number
  }
  artists: Array<{
    id: string
    name: string
    genre: string
  }>
}

export default function EditEventPage() {
  const [event, setEvent] = useState<EditEvent | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [availablePromoters, setAvailablePromoters] = useState<string[]>([
    'Mississippi Underground',
    'TroyBoi', 
    'Downright Entertainment',
    'Downtown Music Collective',
    'Underground Music Collective',
    'Bassline Events',
    'Club Circuit',
    'Community Collective'
  ])
  const router = useRouter()
  const params = useParams()
  const eventId = params.id as string

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.push('/admin')
      return
    }

    loadEvent()
  }, [eventId, router])

  // Separate useEffect for extension integration to avoid dependency issues
  useEffect(() => {
    // Listen for Chrome extension image population
    const handleImagePopulation = (event: any) => {
      console.log('Edit Form: Received image population event:', event.detail)
      if (event.detail && event.detail.imageUrl) {
        console.log('Edit Form: Setting banner image to:', event.detail.imageUrl)
        // Use setEvent directly to avoid dependency on updateEvent closure
        setEvent(currentEvent => {
          if (!currentEvent) {
            // If event not loaded yet, store the image URL to apply later
            ;(window as any).pendingExtensionImageUrl = event.detail.imageUrl
            return currentEvent
          }
          return { ...currentEvent, bannerImage: event.detail.imageUrl }
        })
      }
    }
    
    // Also check for global variable set by extension
    const checkExtensionData = () => {
      const extensionData = (window as any).extensionImageData
      if (extensionData && extensionData.imageUrl) {
        console.log('Edit Form: Found extension image data:', extensionData)
        // Use setEvent directly to avoid dependency on updateEvent closure
        setEvent(currentEvent => {
          if (!currentEvent) {
            // If event not loaded yet, store the image URL to apply later
            ;(window as any).pendingExtensionImageUrl = extensionData.imageUrl
            return currentEvent
          }
          return { ...currentEvent, bannerImage: extensionData.imageUrl }
        })
        // Clear the data so it doesn't get picked up again
        delete (window as any).extensionImageData
      }
    }
    
    window.addEventListener('populateEventImage', handleImagePopulation)
    
    // Check immediately and also periodically for extension data
    checkExtensionData()
    const interval = setInterval(checkExtensionData, 1000)
    
    return () => {
      window.removeEventListener('populateEventImage', handleImagePopulation)
      clearInterval(interval)
    }
  }, []) // No dependencies - just set up the listeners once

  const loadEvent = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/events/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        let eventData = data.event
        
        // Parse promoters from JSON string if it exists
        if (eventData.promoters && typeof eventData.promoters === 'string') {
          try {
            eventData.promoters = JSON.parse(eventData.promoters)
          } catch (e) {
            // If JSON parsing fails, fallback to splitting the promoter string
            eventData.promoters = eventData.promoter ? eventData.promoter.split(', ').filter(p => p.trim()) : []
          }
        } else if (!eventData.promoters && eventData.promoter) {
          // If no promoters array but we have a promoter string, split it
          eventData.promoters = eventData.promoter.split(', ').filter(p => p.trim())
        } else if (!eventData.promoters) {
          // If no promoters at all, initialize empty array
          eventData.promoters = []
        }
        
        // Check if there's a pending extension image URL to apply
        const pendingImageUrl = (window as any).pendingExtensionImageUrl
        if (pendingImageUrl) {
          console.log('Edit Form: Applying pending extension image:', pendingImageUrl)
          eventData = { ...eventData, bannerImage: pendingImageUrl }
          delete (window as any).pendingExtensionImageUrl
        }
        
        setEvent(eventData)
      } else {
        setError('Event not found')
      }
    } catch (error) {
      console.error('Error loading event:', error)
      setError('Failed to load event')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!event) return

    setSaving(true)
    setError(null)

    try {
      const token = localStorage.getItem('admin_token')
      // Always set category to dj-set for all events
      const eventData = {
        ...event,
        category: 'dj-set',
        // Convert promoters array to JSON string for database storage
        promoters: event.promoters ? JSON.stringify(event.promoters) : null
      }
      
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(eventData)
      })

      if (response.ok) {
        router.push('/admin/dashboard')
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to save event')
      }
    } catch (error) {
      console.error('Error saving event:', error)
      setError('Failed to save event')
    } finally {
      setSaving(false)
    }
  }

  const updateEvent = (field: keyof EditEvent, value: any) => {
    if (!event) return
    setEvent({ ...event, [field]: value })
  }


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <MusicLogo className="h-16 w-16 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-400">Loading event...</p>
        </div>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-400 mb-6">{error || 'Event not found'}</p>
          <Link
            href="/admin/dashboard"
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 shadow-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <MusicLogo className="h-8 w-8 mr-3" />
              <h1 className="text-xl font-bold text-white">
                Edit Event: {event.title}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/admin/dashboard"
                className="text-sm text-music-purple-600 hover:text-music-purple-700"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSave} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-white mb-6">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Event Title
                </label>
                <input
                  type="text"
                  value={event.title}
                  onChange={(e) => updateEvent('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-music-purple-500 bg-gray-700 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Promoters
                </label>
                <PromoterMultiSelect
                  selectedPromoters={event.promoters || []}
                  availablePromoters={availablePromoters}
                  onChange={(promoters) => {
                    // Update both promoters and promoter field in a single state update
                    if (event) {
                      setEvent({
                        ...event,
                        promoters: promoters,
                        promoter: promoters.join(', ')
                      })
                    }
                  }}
                  placeholder="Select promoters for this event..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Genre
                </label>
                <select
                  value={event.genre}
                  onChange={(e) => updateEvent('genre', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-music-purple-500 bg-gray-700 text-white"
                >
                  <option value="house">House</option>
                  <option value="drum-and-bass">Drum & Bass</option>
                  <option value="ukg">UK Garage</option>
                  <option value="dubstep">Dubstep</option>
                  <option value="trance">Trance</option>
                  <option value="techno">Techno</option>
                  <option value="other">Other</option>
                </select>
              </div>
              {/* Sub-Genre Selector - Always available for additional genre specification */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Additional Sub-Genres (optional)
                </label>
                <GenreMultiSelect
                  selectedGenres={event.subGenres || []}
                  onChange={(genres) => updateEvent('subGenres', genres)}
                  placeholder="Select additional sub-genres if applicable..."
                />
              </div>
            </div>
            <div className="mt-6">
              <label className="block text-sm font-medium text-chang-brown-700 mb-2">
                Permalink (URL Slug)
              </label>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-400">/events/</span>
                <input
                  type="text"
                  value={event.slug || ''}
                  onChange={(e) => updateEvent('slug', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-music-purple-500 bg-gray-700 text-white"
                  placeholder="auto-generated-from-title"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Leave empty to auto-generate from event title. Only use letters, numbers, and hyphens.
              </p>
            </div>
            <div className="mt-6">
              <label className="block text-sm font-medium text-chang-brown-700 mb-2">
                Description
              </label>
              <textarea
                rows={4}
                value={event.description}
                onChange={(e) => updateEvent('description', e.target.value)}
                className="w-full px-3 py-2 border border-chang-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-music-purple-500"
                placeholder="Describe the event..."
              />
            </div>
          </div>

          {/* Event Banner Image */}
          <div className="bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-white mb-6">Event Banner</h3>
            <ImageUpload
              currentImage={event.bannerImage || event.flyer || ''}
              onImageChange={(imageUrl) => updateEvent('bannerImage', imageUrl)}
              label="Event Banner Image"
              className="w-full"
            />
            <p className="text-sm text-gray-400 mt-2">
              Upload a banner image for your event. This will be displayed prominently on event pages and cards.
            </p>
          </div>

          {/* Date & Time */}
          <div className="bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-white mb-6">Date & Time</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={event.date}
                  onChange={(e) => updateEvent('date', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-music-purple-500 bg-gray-700 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Start Time
                </label>
                <input
                  type="time"
                  value={event.time}
                  onChange={(e) => updateEvent('time', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-music-purple-500 bg-gray-700 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  End Time (Optional)
                </label>
                <input
                  type="time"
                  value={event.endTime || ''}
                  onChange={(e) => updateEvent('endTime', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-music-purple-500 bg-gray-700 text-white"
                />
              </div>
            </div>
          </div>


          {/* Additional Details */}
          <div className="bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-white mb-6">Additional Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Price
                </label>
                <input
                  type="text"
                  value={event.price}
                  onChange={(e) => updateEvent('price', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-music-purple-500 bg-gray-700 text-white"
                  placeholder="e.g., $25, $20-30, Free"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Age Restriction
                </label>
                <input
                  type="text"
                  value={event.ageRestriction || ''}
                  onChange={(e) => updateEvent('ageRestriction', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-music-purple-500 bg-gray-700 text-white"
                  placeholder="e.g., 21+, 18+, All Ages"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Ticket URL
                </label>
                <input
                  type="url"
                  value={event.ticketUrl || ''}
                  onChange={(e) => updateEvent('ticketUrl', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-music-purple-500 bg-gray-700 text-white"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Status
                </label>
                <select
                  value={event.status}
                  onChange={(e) => updateEvent('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-music-purple-500 bg-gray-700 text-white"
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="postponed">Postponed</option>
                  <option value="sold-out">Sold Out</option>
                </select>
              </div>
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={event.featured}
                    onChange={(e) => updateEvent('featured', e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium text-gray-300">Featured Event</span>
                </label>
              </div>
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={event.hero || false}
                    onChange={(e) => updateEvent('hero', e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium text-gray-300">Hero Event (Show in hero section)</span>
                </label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <Link
              href="/admin/dashboard"
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
              {saving ? 'Saving...' : 'Save Event'}
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