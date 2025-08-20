'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import MusicLogo from '@/components/MusicLogo'
import AdminHeader from '@/components/AdminHeader'
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

export default function AdminEvents() {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [eventsLoading, setEventsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'featured' | 'regular'>('all')
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
    } catch (error) {
      console.error('Error loading events:', error)
    } finally {
      setEventsLoading(false)
    }
  }

  const handleDeleteEvent = async (id: string, eventTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${eventTitle}"?\n\nThis action cannot be undone.`)) return

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
        alert(`✅ Event "${eventTitle}" deleted successfully!`)
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

  // Filter events based on search term and status
  const filteredEvents = events.filter(event => {
    const matchesSearch = searchTerm === '' || 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.venue?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.promoter?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (event.promoters && event.promoters.some(p => p.toLowerCase().includes(searchTerm.toLowerCase())))

    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'featured' && event.featured) ||
      (filterStatus === 'regular' && !event.featured)

    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <MusicLogo className="h-16 w-16 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-400">Loading events management...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <AdminHeader title="Event Management" />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header and Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Events</h2>
            <p className="text-gray-400">Manage all your music events in one place</p>
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 mt-4 sm:mt-0">
            <Link
              href="/admin/import-review"
              className="bg-music-purple-600 text-white px-4 py-2 rounded-md hover:bg-music-purple-700 text-center"
            >
              📊 Import Review
            </Link>
            <Link
              href="/admin/import-ics"
              className="bg-music-blue-600 text-white px-4 py-2 rounded-md hover:bg-music-blue-700 text-center"
            >
              📅 Import .ics
            </Link>
            <Link
              href="/admin/events/new"
              className="bg-chang-orange-600 text-white px-4 py-2 rounded-md hover:bg-chang-orange-700 text-center"
            >
              ➕ Add Event
            </Link>
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex-1">
              <label htmlFor="search" className="block text-sm font-medium text-gray-300 mb-2">
                Search Events
              </label>
              <input
                type="text"
                id="search"
                placeholder="Search by title, venue, or promoter..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-music-purple-600 focus:border-transparent"
              />
            </div>
            
            <div>
              <label htmlFor="filter" className="block text-sm font-medium text-gray-300 mb-2">
                Filter by Status
              </label>
              <select
                id="filter"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as 'all' | 'featured' | 'regular')}
                className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-music-purple-600 focus:border-transparent"
              >
                <option value="all">All Events ({events.length})</option>
                <option value="featured">Featured ({events.filter(e => e.featured).length})</option>
                <option value="regular">Regular ({events.filter(e => !e.featured).length})</option>
              </select>
            </div>
          </div>
          
          {filteredEvents.length !== events.length && (
            <div className="mt-4 text-sm text-gray-400">
              Showing {filteredEvents.length} of {events.length} events
            </div>
          )}
        </div>

        {/* Events Table */}
        <div className="bg-gray-800 rounded-lg shadow overflow-hidden">
          {eventsLoading ? (
            <div className="p-8 text-center">
              <p className="text-gray-400">Loading events...</p>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="p-8 text-center">
              {searchTerm || filterStatus !== 'all' ? (
                <div>
                  <p className="text-gray-400 mb-2">No events match your search criteria.</p>
                  <button 
                    onClick={() => {
                      setSearchTerm('')
                      setFilterStatus('all')
                    }}
                    className="text-music-purple-600 hover:text-music-purple-700"
                  >
                    Clear filters
                  </button>
                </div>
              ) : (
                <p className="text-gray-400">No events found. Start by importing events or adding new events.</p>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Event Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider whitespace-nowrap">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800">
                  {filteredEvents.map((event) => (
                    <tr key={event.id} className="hover:bg-gray-700 border-b border-gray-700">
                      <td className="px-6 py-4">
                        <div className="flex items-start">
                          {/* Event Image */}
                          {(event.flyer || event.bannerImage) && (
                            <div className="flex-shrink-0 mr-4">
                              <img
                                src={event.flyer || event.bannerImage}
                                alt={event.title}
                                className="w-16 h-16 rounded-lg object-cover"
                              />
                            </div>
                          )}
                          
                          {/* Event Info */}
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-white mb-1">
                              {(event as any)._source === 'database' ? (
                                <Link
                                  href={`/admin/events/${event.slug || event.id}/edit`}
                                  className="text-white hover:text-music-purple-600 hover:underline"
                                >
                                  {event.title}
                                </Link>
                              ) : (
                                <span>{event.title}</span>
                              )}
                            </div>
                            
                            <div className="text-sm text-gray-400 mb-1">
                              📍 {event.venue?.name || 'TBA'}
                            </div>
                            
                            <div className="text-xs text-gray-500">
                              🎤 {event.promoters && event.promoters.length > 0 
                                ? event.promoters.join(', ') 
                                : event.promoter || 'TBA'}
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        <div className="font-medium">{event.date}</div>
                        <div className="text-xs text-gray-400">{formatTime(event.time)}</div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col space-y-1">
                          <button
                            onClick={() => toggleFeatured(event)}
                            className={`text-sm font-medium text-left ${
                              event.featured 
                                ? 'text-chang-orange-600 hover:text-chang-orange-700'
                                : 'text-gray-400 hover:text-chang-orange-600'
                            }`}
                          >
                            {event.featured ? '⭐ Featured' : '☆ Feature'}
                          </button>
                          {event.hero && (
                            <span className="text-xs text-blue-600 font-medium">🚀 Hero</span>
                          )}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-3">
                          {(event as any)._source === 'database' ? (
                            <Link
                              href={`/admin/events/${event.slug || event.id}/edit`}
                              className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                            >
                              ✏️ Edit
                            </Link>
                          ) : (
                            <span className="inline-flex items-center px-3 py-1 rounded-md text-sm text-gray-400 bg-gray-100">
                              🔒 Read-only
                            </span>
                          )}
                          
                          <Link
                            href={`/events/${event.slug || event.id}`}
                            target="_blank"
                            className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium text-green-600 hover:text-green-700 hover:bg-green-50 transition-colors"
                          >
                            👁️ View
                          </Link>
                          
                          <button
                            onClick={() => handleDeleteEvent(event.id, event.title)}
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