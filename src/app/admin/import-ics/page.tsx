'use client'

import { useState } from 'react'
import Link from 'next/link'
import MusicLogo from '@/components/MusicLogo'
import AdminHeader from '@/components/AdminHeader'

interface ParsedEvent {
  source: string
  event_title: string
  event_date: string
  event_time: string
  venue_name: string
  promoter: string
  genre: string
  description: string
  ticket_url: string
  uid: string
  categories: string[]
  imported_at: string
}

interface ParsedResponse {
  success: boolean
  message: string
  events: ParsedEvent[]
  filename: string
  fileSize: number
}

export default function ImportICSPage() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [parsedEvents, setParsedEvents] = useState<ParsedEvent[]>([])
  const [parseResults, setParseResults] = useState<ParsedResponse | null>(null)
  const [error, setError] = useState<string>('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setError('')
      setParsedEvents([])
      setParseResults(null)
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setError('Please select an .ics file first')
      return
    }

    setLoading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('icsFile', file)

      const response = await fetch('/api/events/import-ics', {
        method: 'POST',
        body: formData
      })

      const result: ParsedResponse = await response.json()

      if (response.ok) {
        setParsedEvents(result.events)
        setParseResults(result)
      } else {
        setError(result.message || 'Failed to parse .ics file')
      }

    } catch (err) {
      setError('Error uploading file: ' + (err instanceof Error ? err.message : 'Unknown error'))
    } finally {
      setLoading(false)
    }
  }

  const importToReviewSystem = async (events: ParsedEvent[]) => {
    try {
      setLoading(true)
      
      // Send each event to the existing import system
      const promises = events.map(event => 
        fetch('/api/events/import-from-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(event)
        })
      )

      const results = await Promise.all(promises)
      const successful = results.filter(r => r.ok).length

      if (successful === events.length) {
        alert(`✅ Successfully imported ${successful} events to review system!`)
        // Clear the parsed events
        setParsedEvents([])
        setParseResults(null)
        setFile(null)
        // Reset file input
        const fileInput = document.getElementById('ics-file-input') as HTMLInputElement
        if (fileInput) fileInput.value = ''
      } else {
        alert(`⚠️ Imported ${successful} out of ${events.length} events. Some events may have failed.`)
      }

    } catch (err) {
      alert('Error importing events: ' + (err instanceof Error ? err.message : 'Unknown error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <AdminHeader title="Import .ics Calendar Files" showLogout={false} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">📅 Import .ics Calendar Files</h2>
          <p className="text-gray-400">
            Upload .ics files from Facebook events, Google Calendar, or other calendar apps
          </p>
        </div>
        {/* Upload Section */}
        <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            📤 Upload .ics Calendar File
          </h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="ics-file-input" className="block text-sm font-medium text-gray-300 mb-2">
                Select .ics File
              </label>
              <input
                id="ics-file-input"
                type="file"
                accept=".ics"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-music-purple-600 file:text-white hover:file:bg-music-purple-700"
              />
            </div>

            {file && (
              <div className="bg-gray-700 p-3 rounded-lg">
                <p className="text-sm text-white"><strong>Selected file:</strong> {file.name}</p>
                <p className="text-sm text-gray-400">Size: {Math.round(file.size / 1024)} KB</p>
              </div>
            )}

            {error && (
              <div className="bg-red-900 border border-red-700 rounded-lg p-3">
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            )}

            <button
              onClick={handleUpload}
              disabled={!file || loading}
              className={`bg-music-purple-600 text-white px-4 py-2 rounded-md hover:bg-music-purple-700 flex items-center transition-colors ${loading ? 'opacity-50' : ''}`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  📊 Parse .ics File
                </>
              )}
            </button>
          </div>
        </div>

        {/* How to Get .ics Files */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-white mb-3">📝 How to Get .ics Files:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-gray-200 mb-2">🎵 From Facebook Events:</h4>
              <ol className="list-decimal list-inside space-y-1 text-gray-300">
                <li>Visit the Facebook event page</li>
                <li>Click the &quot;...&quot; menu (three dots)</li>
                <li>Select &quot;Export Event&quot;</li>
                <li>Choose &quot;Add to Calendar&quot;</li>
                <li>Save the .ics file</li>
              </ol>
            </div>
            <div>
              <h4 className="font-semibold text-gray-200 mb-2">📅 From Google Calendar:</h4>
              <ol className="list-decimal list-inside space-y-1 text-gray-300">
                <li>Open Google Calendar</li>
                <li>Click event → &quot;More actions&quot;</li>
                <li>Select &quot;Download ICS&quot;</li>
                <li>Or export entire calendar</li>
                <li>Upload the .ics file here</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Parse Results */}
        {parseResults && (
          <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  ✅ Parsed {parseResults.events.length} Events
                </h3>
                <p className="text-sm text-gray-400">
                  From: {parseResults.filename} ({Math.round(parseResults.fileSize / 1024)} KB)
                </p>
              </div>
              <button
                onClick={() => importToReviewSystem(parsedEvents)}
                disabled={loading || parsedEvents.length === 0}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 font-medium disabled:opacity-50"
              >
                📥 Import All to Review System
              </button>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {parsedEvents.map((event, index) => (
                <div key={event.uid || index} className="border border-music-neutral-200 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-music-purple-950 mb-2">
                        {event.event_title || 'Untitled Event'}
                      </h4>
                      <div className="text-sm space-y-1">
                        <div><strong>Date:</strong> {event.event_date || 'Not found'}</div>
                        <div><strong>Time:</strong> {event.event_time || 'Not found'}</div>
                        <div><strong>Venue:</strong> {event.venue_name || 'Not found'}</div>
                        <div><strong>Organizer:</strong> {event.promoter || 'Not found'}</div>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm space-y-1">
                        <div><strong>Genre:</strong> 
                          <span className={`ml-2 px-2 py-1 rounded text-xs ${
                            event.genre !== 'other' 
                              ? 'bg-music-purple-100 text-music-purple-800'
                              : 'bg-music-neutral-100 text-music-neutral-800'
                          }`}>
                            {event.genre}
                          </span>
                        </div>
                        {event.categories.length > 0 && (
                          <div><strong>Categories:</strong> {event.categories.join(', ')}</div>
                        )}
                        {event.ticket_url && (
                          <div><strong>URL:</strong> 
                            <a href={event.ticket_url} target="_blank" rel="noopener noreferrer" 
                               className="text-music-purple-600 hover:underline ml-1">
                              Link →
                            </a>
                          </div>
                        )}
                      </div>
                      {event.description && (
                        <div className="mt-2">
                          <strong className="text-xs">Description:</strong>
                          <p className="text-xs text-music-neutral-600 mt-1 max-h-16 overflow-y-auto">
                            {event.description.substring(0, 200)}...
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sample .ics Structure */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="font-semibold text-white mb-3">🔍 What Gets Extracted from .ics Files:</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-1 text-gray-200">📋 Basic Info:</h4>
              <ul className="text-gray-400 space-y-1">
                <li>• Event Title</li>
                <li>• Date & Time</li>
                <li>• Description</li>
                <li>• Unique ID</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-1 text-gray-200">📍 Location:</h4>
              <ul className="text-gray-400 space-y-1">
                <li>• Venue Name</li>
                <li>• Address</li>
                <li>• Location Details</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-1 text-gray-200">👥 Organizer:</h4>
              <ul className="text-gray-400 space-y-1">
                <li>• Promoter Name</li>
                <li>• Contact Email</li>
                <li>• Organizer Info</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-1 text-gray-200">🎵 Smart Detection:</h4>
              <ul className="text-gray-400 space-y-1">
                <li>• Auto Genre Detection</li>
                <li>• Electronic Music Focus</li>
                <li>• Category Mapping</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}