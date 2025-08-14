'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface ImportedEvent {
  id: string
  status: 'pending_review' | 'approved' | 'rejected'
  source: 'mailparser' | 'facebook_extension' | 'facebook_bookmarklet'
  imported_at: string
  raw_data: any
  parsed_event?: {
    title: string
    date: string
    time: string
    venue: string
    artists: string[]
    genre: string
    price: string
    promoter: string
    promoters?: string[] // Array of available promoters for selection
    ticket_url?: string
  }
}

export default function ImportReviewPage() {
  const [events, setEvents] = useState<ImportedEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending_review' | 'approved' | 'rejected'>('pending_review')
  const [selectedPromoters, setSelectedPromoters] = useState<{[eventId: string]: string}>({})

  useEffect(() => {
    fetchEvents()
  }, [filter])

  const fetchEvents = async () => {
    try {
      const response = await fetch(`/api/events/import-from-email?status=${filter}`)
      const data = await response.json()
      setEvents(data.events || [])
    } catch (error) {
      console.error('Failed to fetch events:', error)
    } finally {
      setLoading(false)
    }
  }

  const approveEvent = async (eventId: string) => {
    try {
      const selectedPromoter = selectedPromoters[eventId]
      const eventData = events.find(e => e.id === eventId)
      
      const response = await fetch('/api/events/import-from-email', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          eventId, 
          action: 'approve',
          // Include selected promoter if one was chosen
          ...(selectedPromoter && eventData?.parsed_event ? {
            updated_data: {
              ...eventData.parsed_event,
              promoter: selectedPromoter
            }
          } : {})
        })
      })

      if (response.ok) {
        const selectedPromoter = selectedPromoters[eventId]
        const eventData = events.find(e => e.id === eventId)
        console.log('Event approved successfully with promoter:', selectedPromoter || eventData?.parsed_event?.promoter)
        // Refresh the events list
        fetchEvents()
        // Clear the selected promoter for this event
        setSelectedPromoters(prev => {
          const updated = { ...prev }
          delete updated[eventId]
          return updated
        })
        alert('✅ Event approved and added to main events database!')
      } else {
        const data = await response.json()
        alert('Error approving event: ' + data.error)
      }
    } catch (error) {
      console.error('Error approving event:', error)
      alert('Error approving event')
    }
  }

  const rejectEvent = async (eventId: string) => {
    try {
      const response = await fetch('/api/events/import-from-email', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, action: 'reject' })
      })

      if (response.ok) {
        console.log('Event rejected successfully')
        // Refresh the events list
        fetchEvents()
      } else {
        const data = await response.json()
        alert('Error rejecting event: ' + data.error)
      }
    } catch (error) {
      console.error('Error rejecting event:', error)
      alert('Error rejecting event')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-music-neutral-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-music-purple-600"></div>
            <p className="mt-2 text-music-neutral-600">Loading imported events...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-music-neutral-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-music-neutral-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-heading font-bold text-music-purple-950">
                📧 Event Import Review
              </h1>
              <p className="text-music-neutral-600 mt-1">
                Review events imported from Facebook, emails, and other sources
              </p>
            </div>
            <Link 
              href="/admin"
              className="btn-secondary"
            >
              ← Back to Admin
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Webhook URL Info */}
        <div className="bg-music-purple-50 border border-music-purple-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-music-purple-950 mb-2">
            🔗 Mailparser Webhook URL
          </h3>
          <code className="text-sm bg-white px-3 py-1 rounded border">
            https://your-domain.com/api/events/import-from-email
          </code>
          <p className="text-sm text-music-purple-700 mt-2">
            Configure this URL in your Mailparser inbox settings to automatically receive parsed event data.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-4 mb-6">
          {['pending_review', 'approved', 'rejected', 'all'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === status
                  ? 'bg-music-purple-600 text-white'
                  : 'bg-white text-music-neutral-700 hover:bg-music-neutral-100'
              }`}
            >
              {status.replace('_', ' ').toUpperCase()}
              {status === 'pending_review' && events.length > 0 && (
                <span className="ml-2 bg-music-accent-500 text-white text-xs px-2 py-1 rounded-full">
                  {events.filter(e => e.status === 'pending_review').length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Events List */}
        {events.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-semibold text-music-neutral-700 mb-2">
              No imported events yet
            </h3>
            <p className="text-music-neutral-600 mb-6">
              Events will appear here once promoters send emails to:<br />
              <code className="bg-music-neutral-100 px-2 py-1 rounded">
                lxwupbiw@mailparser.io
              </code>
            </p>
            <div className="bg-music-neutral-100 rounded-lg p-6 max-w-md mx-auto">
              <h4 className="font-semibold mb-3">📝 Next Steps:</h4>
              <ol className="text-left text-sm space-y-2">
                <li>1. Subscribe to promoter emails using the Mailparser email</li>
                <li>2. Set up parsing rules in Mailparser dashboard</li>
                <li>3. Configure webhook URL in Mailparser</li>
                <li>4. Wait for emails and review imported events here</li>
              </ol>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {events.map((event) => (
              <div key={event.id} className="bg-white rounded-lg shadow-sm border border-music-neutral-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      event.status === 'pending_review' 
                        ? 'bg-yellow-100 text-yellow-800'
                        : event.status === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {event.status.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className="text-sm text-music-neutral-500">
                      {new Date(event.imported_at).toLocaleString()}
                    </span>
                  </div>
                  {event.status === 'pending_review' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => approveEvent(event.id)}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
                      >
                        ✅ Approve
                      </button>
                      <button
                        onClick={() => rejectEvent(event.id)}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                      >
                        ❌ Reject
                      </button>
                    </div>
                  )}
                </div>

                {event.parsed_event ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Parsed Event Data */}
                    <div>
                      <h3 className="font-semibold text-music-purple-950 mb-3">📊 Extracted Event Data</h3>
                      <div className="space-y-2 text-sm">
                        <div><strong>Title:</strong> {event.parsed_event.title || 'Not found'}</div>
                        <div><strong>Date:</strong> {event.parsed_event.date || 'Not found'}</div>
                        <div><strong>Time:</strong> {event.parsed_event.time || 'Not found'}</div>
                        <div><strong>Venue:</strong> {event.parsed_event.venue || 'Not found'}</div>
                        <div><strong>Artists:</strong> {event.parsed_event.artists.join(', ') || 'Not found'}</div>
                        <div><strong>Genre:</strong> 
                          <span className={`ml-2 px-2 py-1 rounded text-xs ${
                            event.parsed_event.genre !== 'other' 
                              ? 'bg-music-purple-100 text-music-purple-800'
                              : 'bg-music-neutral-100 text-music-neutral-800'
                          }`}>
                            {event.parsed_event.genre || 'other'}
                          </span>
                        </div>
                        <div><strong>Price:</strong> {event.parsed_event.price || 'Not found'}</div>
                        <div className="flex items-center">
                          <strong>Promoter:</strong> 
                          {event.parsed_event.promoters && event.parsed_event.promoters.length > 1 ? (
                            <select
                              value={selectedPromoters[event.id] || event.parsed_event.promoter}
                              onChange={(e) => setSelectedPromoters(prev => ({
                                ...prev,
                                [event.id]: e.target.value
                              }))}
                              className="ml-2 px-2 py-1 border rounded text-sm"
                            >
                              {event.parsed_event.promoters.map((promoter, index) => (
                                <option key={index} value={promoter}>
                                  {promoter}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <span className="ml-2">{event.parsed_event.promoter || 'Not found'}</span>
                          )}
                        </div>
                        {event.parsed_event.promoters && event.parsed_event.promoters.length > 1 && (
                          <div className="text-xs text-music-neutral-600 ml-4">
                            💡 Multiple organizers detected: {event.parsed_event.promoters.join(', ')}
                          </div>
                        )}
                        {event.parsed_event.ticket_url && (
                          <div><strong>Tickets:</strong> 
                            <a href={event.parsed_event.ticket_url} target="_blank" rel="noopener noreferrer" 
                               className="text-music-purple-600 hover:underline ml-1">
                              View Link →
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Raw Source Data */}
                    <div>
                      <h3 className="font-semibold text-music-purple-950 mb-3">
                        {event.source === 'mailparser' ? '📧 Raw Email Data' : 
                         event.source === 'facebook_extension' ? '📘 Facebook Data' :
                         '📘 Facebook Bookmarklet Data'}
                      </h3>
                      <div className="bg-music-neutral-50 p-3 rounded text-xs space-y-2 max-h-64 overflow-y-auto">
                        <div><strong>Source:</strong> {event.source}</div>
                        <div><strong>Extracted At:</strong> {event.raw_data.extracted_at || 'N/A'}</div>
                        
                        {event.source === 'mailparser' ? (
                          <>
                            <div><strong>Subject:</strong> {event.raw_data.email_subject || 'N/A'}</div>
                            <div><strong>From:</strong> {event.raw_data.from_email || 'N/A'}</div>
                            {event.raw_data.email_body && (
                              <div>
                                <strong>Body Preview:</strong>
                                <div className="mt-1 p-2 bg-white rounded border text-xs">
                                  {event.raw_data.email_body.substring(0, 300)}...
                                </div>
                              </div>
                            )}
                          </>
                        ) : (
                          <>
                            <div><strong>Event URL:</strong> 
                              <a href={event.raw_data.ticket_url} target="_blank" rel="noopener noreferrer"
                                 className="text-music-purple-600 hover:underline ml-1 break-all">
                                {event.raw_data.ticket_url}
                              </a>
                            </div>
                            {event.raw_data.description && (
                              <div>
                                <strong>Description:</strong>
                                <div className="mt-1 p-2 bg-white rounded border text-xs">
                                  {event.raw_data.description.substring(0, 300)}...
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-red-50 border border-red-200 rounded p-4">
                    <h3 className="font-semibold text-red-800 mb-2">⚠️ Parsing Failed</h3>
                    <p className="text-red-700 text-sm">
                      Could not extract event data from email. Raw data available for manual review.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}