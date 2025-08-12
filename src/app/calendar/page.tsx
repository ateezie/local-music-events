'use client'

import { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import EventCard from '@/components/EventCard'
import { getAllEvents, getTodaysEvents, getUpcomingEvents, getEventStats } from '@/lib/events'
import { Event } from '@/types'

export default function CalendarPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [todayEvents, setTodayEvents] = useState<Event[]>([])
  const [weekEvents, setWeekEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedView, setSelectedView] = useState<'today' | 'week' | 'all'>('today')
  const [stats, setStats] = useState(getEventStats())

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const allEvents = getAllEvents()
        const today = getTodaysEvents()
        const week = getUpcomingEvents().slice(0, 10) // Get upcoming events for "this week"
        
        // Sort events by date
        const sortedEvents = allEvents.sort((a, b) => 
          new Date(a.date).getTime() - new Date(b.date).getTime()
        )
        
        setEvents(sortedEvents)
        setTodayEvents(today)
        setWeekEvents(week)
        setStats(getEventStats())
      } catch (error) {
        console.error('Error loading events:', error)
      } finally {
        setLoading(false)
      }
    }

    loadEvents()
  }, [])

  const getDisplayEvents = () => {
    switch (selectedView) {
      case 'today':
        return todayEvents
      case 'week':
        return weekEvents
      default:
        return events.slice(0, 20) // Limit to 20 for performance
    }
  }

  const displayEvents = getDisplayEvents()

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-music-neutral-50">
          <div className="bg-gradient-to-r from-music-purple-50 to-music-blue-100 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <div className="h-12 bg-music-neutral-200 rounded mb-6 animate-pulse"></div>
                <div className="h-6 bg-music-neutral-200 rounded mx-auto max-w-2xl animate-pulse"></div>
              </div>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-96 bg-music-neutral-200 rounded-lg animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="min-h-screen bg-music-neutral-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-music-purple-50 to-music-blue-100 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl font-bold text-music-purple-950 mb-4">
                Event Calendar
              </h1>
              <p className="text-lg text-music-neutral-700 max-w-2xl mx-auto mb-8">
                Stay up to date with all the live music events happening in your city.
              </p>
              
              {/* Quick Stats */}
              <div className="flex justify-center space-x-8 text-center">
                <div>
                  <div className="text-2xl font-bold text-music-purple-600">{todayEvents.length}</div>
                  <div className="text-sm text-music-neutral-600">Today</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-music-blue-600">{weekEvents.length}</div>
                  <div className="text-sm text-music-neutral-600">This Week</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-music-accent-600">{stats.totalEvents}</div>
                  <div className="text-sm text-music-neutral-600">Total Events</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar Controls */}
        <div className="bg-white border-b border-music-neutral-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={() => setSelectedView('today')}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                  selectedView === 'today'
                    ? 'bg-music-purple-600 text-white shadow-md'
                    : 'bg-music-neutral-200 text-music-neutral-700 hover:bg-music-neutral-300'
                }`}
              >
                Today ({todayEvents.length})
              </button>
              <button
                onClick={() => setSelectedView('week')}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                  selectedView === 'week'
                    ? 'bg-music-blue-600 text-white shadow-md'
                    : 'bg-music-neutral-200 text-music-neutral-700 hover:bg-music-neutral-300'
                }`}
              >
                This Week ({weekEvents.length})
              </button>
              <button
                onClick={() => setSelectedView('all')}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                  selectedView === 'all'
                    ? 'bg-music-accent-600 text-white shadow-md'
                    : 'bg-music-neutral-200 text-music-neutral-700 hover:bg-music-neutral-300'
                }`}
              >
                All Upcoming
              </button>
            </div>
          </div>
        </div>

        {/* Events List */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {displayEvents.length > 0 ? (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-music-purple-950 mb-2">
                  {selectedView === 'today' && 'Today\'s Events'}
                  {selectedView === 'week' && 'This Week\'s Events'}
                  {selectedView === 'all' && 'Upcoming Events'}
                </h2>
                <p className="text-music-neutral-600">
                  {displayEvents.length} event{displayEvents.length !== 1 ? 's' : ''} 
                  {selectedView === 'today' && ' happening today'}
                  {selectedView === 'week' && ' this week'}
                  {selectedView === 'all' && ' coming up'}
                </p>
              </div>

              {/* Timeline View for Today/Week */}
              {(selectedView === 'today' || selectedView === 'week') && displayEvents.length > 0 && (
                <div className="mb-8">
                  <div className="space-y-6">
                    {displayEvents.reduce((groups: { [key: string]: Event[] }, event) => {
                      const dateKey = new Date(event.date).toDateString()
                      if (!groups[dateKey]) {
                        groups[dateKey] = []
                      }
                      groups[dateKey].push(event)
                      return groups
                    }, {}) && 
                      Object.entries(
                        displayEvents.reduce((groups: { [key: string]: Event[] }, event) => {
                          const dateKey = new Date(event.date).toDateString()
                          if (!groups[dateKey]) {
                            groups[dateKey] = []
                          }
                          groups[dateKey].push(event)
                          return groups
                        }, {})
                      ).map(([dateStr, dayEvents]) => (
                        <div key={dateStr} className="bg-white rounded-lg shadow-sm border border-music-neutral-200 overflow-hidden">
                          <div className="bg-music-neutral-50 px-6 py-3 border-b border-music-neutral-200">
                            <h3 className="text-lg font-semibold text-music-purple-950">
                              {new Date(dateStr).toLocaleDateString('en-US', { 
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                            </h3>
                            <p className="text-sm text-music-neutral-600">
                              {dayEvents.length} event{dayEvents.length !== 1 ? 's' : ''}
                            </p>
                          </div>
                          <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                              {dayEvents.map((event) => (
                                <EventCard key={event.id} event={event} compact />
                              ))}
                            </div>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>
              )}

              {/* Grid View for All Events */}
              {selectedView === 'all' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {displayEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-2xl font-bold text-music-purple-950 mb-2">
                {selectedView === 'today' && 'No events today'}
                {selectedView === 'week' && 'No events this week'}
                {selectedView === 'all' && 'No upcoming events'}
              </h3>
              <p className="text-music-neutral-600 mb-6">
                {selectedView === 'today' && 'Check back tomorrow or explore other dates.'}
                {selectedView === 'week' && 'Check back next week for new events.'}
                {selectedView === 'all' && 'We\'re working on adding more events. Check back soon!'}
              </p>
              {selectedView !== 'all' && (
                <button
                  onClick={() => setSelectedView('all')}
                  className="btn-primary"
                >
                  View All Events
                </button>
              )}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-music-purple-950 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Never Miss Your Favorite Shows</h3>
            <p className="text-music-neutral-200 mb-8">
              Subscribe to our calendar updates and get notified about new events in your area.
            </p>
            <div className="flex justify-center space-x-4">
              <button className="btn-primary bg-music-accent-600 hover:bg-music-accent-700">
                Subscribe to Calendar
              </button>
              <button className="btn-secondary text-white border-white hover:bg-white hover:text-music-purple-950">
                Add to Google Calendar
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}