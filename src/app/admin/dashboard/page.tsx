'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import MusicLogo from '@/components/MusicLogo'
import { Event } from '@/types/event'

// Helper function to format time to 12-hour format
function formatTime(timeString: string): string {
  if (!timeString) return ''
  
  // If already in 12-hour format, return as-is
  if (timeString.toLowerCase().includes('am') || timeString.toLowerCase().includes('pm')) {
    return timeString
  }
  
  // Handle 24-hour format (HH:MM)
  const timeParts = timeString.split(':')
  if (timeParts.length >= 2) {
    const hours = parseInt(timeParts[0])
    const minutes = timeParts[1]
    
    if (hours === 0) {
      return `12:${minutes} AM`
    } else if (hours < 12) {
      return `${hours}:${minutes} AM`
    } else if (hours === 12) {
      return `12:${minutes} PM`
    } else {
      return `${hours - 12}:${minutes} PM`
    }
  }
  
  // Fallback: return original
  return timeString
}

interface AdminUser {
  id: string
  email: string
  name: string
  role: string
}

export default function AdminDashboard() {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [eventsLoading, setEventsLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    featured: 0,
    genres: 0
  })
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
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
        loadEvents()
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

  const loadEvents = async () => {
    try {
      // Load both JSON and database events
      let allEvents: Event[] = []
      
      // Load JSON events
      try {
        const jsonResponse = await fetch('/api/events/json')
        if (jsonResponse.ok) {
          const jsonData = await jsonResponse.json()
          const jsonEvents = (jsonData.events || []).map((event: any) => ({
            ...event,
            _source: 'json' // Mark as JSON event
          }))
          allEvents.push(...jsonEvents)
        }
      } catch (error) {
        console.error('Error loading JSON events:', error)
      }
      
      // Load database events
      try {
        const dbResponse = await fetch('/api/events?limit=100')
        if (dbResponse.ok) {
          const dbData = await dbResponse.json()
          const dbEvents = (dbData.events || []).map((event: any) => ({
            ...event,
            _source: 'database' // Mark as database event
          }))
          allEvents.push(...dbEvents)
        }
      } catch (error) {
        console.error('Error loading database events:', error)
      }
      
      // Sort events by date
      allEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      
      setEvents(allEvents)
      setStats({
        total: allEvents.length,
        featured: allEvents.filter((e: Event) => e.featured).length,
        genres: new Set(allEvents.map((e: Event) => e.genre)).size
      })
    } catch (error) {
      console.error('Error loading events:', error)
    } finally {
      setEventsLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    router.push('/admin')
  }

  const handleDeleteEvent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return

    try {
      console.log('Attempting to delete event with ID:', id)
      
      // Find the event to determine its source
      const event = events.find(e => e.id === id)
      const isDatabase = (event as any)?._source === 'database'
      
      let response
      if (isDatabase) {
        // Delete from database
        const token = localStorage.getItem('admin_token')
        response = await fetch(`/api/events/${encodeURIComponent(id)}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        })
      } else {
        // Delete from JSON
        response = await fetch(`/api/events/json?id=${encodeURIComponent(id)}`, {
          method: 'DELETE'
        })
      }

      console.log('Delete response status:', response.status)

      if (response.ok) {
        console.log(`Event deleted successfully from ${isDatabase ? 'database' : 'JSON'}`)
        loadEvents() // Reload events
        return
      } else {
        const errorData = await response.json()
        console.error('Delete error:', errorData)
        alert('Error deleting event: ' + errorData.error)
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('Error deleting event: ' + error.message)
    }
  }

  const toggleFeatured = async (event: Event) => {
    try {
      const isDatabase = (event as any)?._source === 'database'
      let response
      
      if (isDatabase) {
        // Update database event
        const token = localStorage.getItem('admin_token')
        response = await fetch(`/api/events/${encodeURIComponent(event.id)}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            ...event,
            featured: !event.featured
          })
        })
      } else {
        // Update JSON event
        response = await fetch('/api/events/json', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            eventId: event.id, 
            action: 'toggleFeatured',
            featured: !event.featured 
          })
        })
      }

      if (response.ok) {
        loadEvents() // Reload events
      } else {
        console.error('Error toggling featured status')
        alert('Error updating featured status')
      }
    } catch (error) {
      console.error('Error toggling featured status:', error)
      alert('Error updating featured status')
    }
  }

  const showEventInfo = (event: Event) => {
    setSelectedEvent(event)
  }

  const convertToDatabase = async (event: Event) => {
    if (!confirm(`Convert "${event.title}" to database? This will enable full editing but cannot be undone.`)) return

    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch('/api/events/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ eventId: event.id })
      })

      if (response.ok) {
        const data = await response.json()
        alert(`✅ Event converted to database successfully! New ID: ${data.event.id}`)
        loadEvents() // Reload events
      } else {
        const data = await response.json()
        alert('Error converting event: ' + data.error)
      }
    } catch (error) {
      console.error('Error converting event:', error)
      alert('Error converting event to database')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <MusicLogo className="h-16 w-16 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-400">Loading admin dashboard...</p>
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
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/admin/venues"
                className="text-sm text-music-purple-600 hover:text-music-purple-700"
              >
                Manage Venues
              </Link>
              <Link 
                href="/"
                className="text-sm text-music-purple-600 hover:text-music-purple-700"
              >
                View Site
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm bg-chang-brown-600 text-white px-3 py-1 rounded hover:bg-chang-brown-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-white mb-2">Total Events</h3>
            <p className="text-3xl font-bold text-blue-400">{stats.total}</p>
          </div>
          <div className="bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-white mb-2">Featured Events</h3>
            <p className="text-3xl font-bold text-blue-400">{stats.featured}</p>
          </div>
          <div className="bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-white mb-2">Genres</h3>
            <p className="text-3xl font-bold text-blue-400">{stats.genres}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Manage Events</h2>
          <div className="flex space-x-4">
            <Link
              href="/admin/import-review"
              className="bg-music-purple-600 text-white px-4 py-2 rounded-md hover:bg-music-purple-700"
            >
              📊 Event Import Review
            </Link>
            <Link
              href="/admin/import-ics"
              className="bg-music-blue-600 text-white px-4 py-2 rounded-md hover:bg-music-blue-700"
            >
              📅 Import .ics Files
            </Link>
            <Link
              href="/admin/events/new"
              className="bg-chang-orange-600 text-white px-4 py-2 rounded-md hover:bg-chang-orange-700"
            >
              🎵 Add New Event
            </Link>
          </div>
        </div>

        {/* Events Table */}
        <div className="bg-gray-800 rounded-lg shadow overflow-hidden">
          {eventsLoading ? (
            <div className="p-8 text-center">
              <p className="text-gray-400">Loading events...</p>
            </div>
          ) : events.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-400">No events found. Start by importing events or adding new events.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Event
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Genre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Featured
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800">
                  {events.map((event) => (
                    <tr key={event.id} className="hover:bg-gray-700">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-white">
                              {(event as any)._source === 'database' ? (
                                <Link
                                  href={`/admin/events/${event.id}/edit`}
                                  className="text-white hover:underline"
                                >
                                  {event.title}
                                </Link>
                              ) : (
                                <span>{event.title}</span>
                              )}
                            </div>
                            <div className="text-sm text-gray-400">
                              {event.venue?.id || event.venueId ? (
                                <Link
                                  href={`/admin/venues/${event.venue?.id || event.venueId}/edit`}
                                  className="text-gray-400 hover:underline"
                                >
                                  {event.venue?.name || 'TBA'}
                                </Link>
                              ) : (
                                <span>{event.venue?.name || 'TBA'}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        <div>{event.date}</div>
                        <div className="text-xs text-gray-400">{formatTime(event.time)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-music-purple-100 text-music-purple-800">
                          {event.genre}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => toggleFeatured(event)}
                          className={`text-sm font-medium ${
                            event.featured 
                              ? 'text-chang-orange-600 hover:text-chang-orange-700'
                              : 'text-chang-brown-400 hover:text-chang-brown-600'
                          }`}
                        >
                          {event.featured ? '⭐ Featured' : '☆ Feature'}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        {/* All events are now JSON-based, show tickets link if available */}
                        {(event.tickets?.url || event.ticketUrl) ? (
                          <a
                            href={event.tickets?.url || event.ticketUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-chang-orange-600 hover:text-chang-orange-700"
                          >
                            Tickets
                          </a>
                        ) : (
                          <span className="text-gray-400 text-sm">No Tickets</span>
                        )}
                        
                        <button
                          onClick={() => showEventInfo(event)}
                          className="text-chang-brown-600 hover:text-gray-300"
                        >
                          Info
                        </button>
                        
                        {/* Show appropriate button based on event source */}
                        {(event as any)._source === 'database' ? (
                          <Link
                            href={`/admin/events/${event.id}/edit`}
                            className="text-music-blue-600 hover:text-music-blue-700"
                          >
                            Edit
                          </Link>
                        ) : (event as any).createdAt ? (
                          <button
                            onClick={() => convertToDatabase(event)}
                            className="text-music-purple-600 hover:text-music-purple-700"
                          >
                            → DB
                          </button>
                        ) : (
                          <span className="text-gray-400 text-sm">JSON Only</span>
                        )}
                        
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Event Info Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-white">Event Details</h3>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-gray-400 hover:text-gray-300 text-xl font-bold"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Event Title</label>
                  {(selectedEvent as any)._source === 'database' ? (
                    <Link
                      href={`/admin/events/${selectedEvent.id}/edit`}
                      className="text-music-blue-600 hover:text-music-blue-700 hover:underline font-medium"
                      onClick={() => setSelectedEvent(null)}
                    >
                      {selectedEvent.title} ✏️
                    </Link>
                  ) : (
                    <p className="text-white">{selectedEvent.title}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Date</label>
                    <p className="text-white">{selectedEvent.date}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Time</label>
                    <p className="text-white">{formatTime(selectedEvent.time)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Venue</label>
                    {selectedEvent.venue?.id ? (
                      <Link
                        href={`/admin/venues/${selectedEvent.venue.id}/edit`}
                        className="text-music-purple-600 hover:text-music-purple-700 hover:underline font-medium"
                        onClick={() => setSelectedEvent(null)}
                      >
                        {selectedEvent.venue.name} 🏛️
                      </Link>
                    ) : selectedEvent.venueId ? (
                      <Link
                        href={`/admin/venues/${selectedEvent.venueId}/edit`}
                        className="text-music-purple-600 hover:text-music-purple-700 hover:underline font-medium"
                        onClick={() => setSelectedEvent(null)}
                      >
                        {selectedEvent.venue?.name || 'TBA'} 🏛️
                      </Link>
                    ) : (
                      <p className="text-white">{selectedEvent.venue?.name || 'TBA'}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Genre</label>
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-music-purple-100 text-music-purple-800">
                      {selectedEvent.genre}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Promoter</label>
                  <p className="text-white">{selectedEvent.promoter || 'TBA'}</p>
                </div>

                {selectedEvent.description && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                    <p className="text-white bg-gray-700 p-3 rounded">{selectedEvent.description}</p>
                  </div>
                )}

                {(selectedEvent.tickets?.url || selectedEvent.ticketUrl) && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Tickets</label>
                    <a
                      href={selectedEvent.tickets?.url || selectedEvent.ticketUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-chang-orange-600 text-white rounded hover:bg-chang-orange-700 transition-colors"
                    >
                      🎫 Buy Tickets
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                )}

                {selectedEvent.flyer && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Event Flyer</label>
                    <img 
                      src={selectedEvent.flyer} 
                      alt={selectedEvent.title}
                      className="max-w-full h-auto rounded border"
                      style={{ maxHeight: '300px' }}
                    />
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}