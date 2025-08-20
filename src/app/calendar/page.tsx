'use client'

import { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import EventCard from '@/components/EventCard'
import { Event } from '@/types'

type ViewMode = 'list' | 'calendar' | 'post'
type DateFilter = 'tonight' | 'this-weekend' | 'this-month' | 'next-month' | 'custom'

export default function CalendarPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedView, setSelectedView] = useState<ViewMode>('list')
  const [selectedFilter, setSelectedFilter] = useState<DateFilter>('this-weekend')
  const [customStartDate, setCustomStartDate] = useState('')
  const [customEndDate, setCustomEndDate] = useState('')
  
  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = async () => {
    try {
      let allEvents: Event[] = []
      
      // Load JSON events
      try {
        const jsonResponse = await fetch('/api/events/json')
        if (jsonResponse.ok) {
          const jsonData = await jsonResponse.json()
          const jsonEvents = (jsonData.events || []).map((event: any) => ({
            ...event,
            _source: 'json'
          }))
          allEvents.push(...jsonEvents)
        }
      } catch (error) {
        console.error('Error loading JSON events:', error)
      }
      
      // Load database events  
      try {
        const dbResponse = await fetch('/api/events?limit=200')
        if (dbResponse.ok) {
          const dbData = await dbResponse.json()
          const dbEvents = (dbData.events || []).map((event: any) => ({
            ...event,
            _source: 'database'
          }))
          allEvents.push(...dbEvents)
        }
      } catch (error) {
        console.error('Error loading database events:', error)
      }
      
      // Sort by date
      allEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      
      setEvents(allEvents)
    } catch (error) {
      console.error('Error loading events:', error)
    } finally {
      setLoading(false)
    }
  }

  const getFilteredEvents = () => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    
    return events.filter(event => {
      const eventDate = new Date(event.date)
      
      switch (selectedFilter) {
        case 'tonight':
          return eventDate.toDateString() === today.toDateString()
          
        case 'this-weekend':
          const startOfWeekend = new Date(today)
          const dayOfWeek = today.getDay()
          const daysToFriday = dayOfWeek <= 5 ? 5 - dayOfWeek : 0
          startOfWeekend.setDate(today.getDate() + daysToFriday)
          
          const endOfWeekend = new Date(startOfWeekend)
          endOfWeekend.setDate(startOfWeekend.getDate() + 2)
          
          return eventDate >= startOfWeekend && eventDate <= endOfWeekend
          
        case 'this-month':
          const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
          const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
          return eventDate >= startOfMonth && eventDate <= endOfMonth
          
        case 'next-month':
          const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)
          const endOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 2, 0)
          return eventDate >= nextMonth && eventDate <= endOfNextMonth
          
        case 'custom':
          if (!customStartDate || !customEndDate) return true
          const customStart = new Date(customStartDate)
          const customEnd = new Date(customEndDate)
          return eventDate >= customStart && eventDate <= customEnd
          
        default:
          return true
      }
    })
  }

  const filteredEvents = getFilteredEvents()
  
  const getDateRangeText = () => {
    const now = new Date()
    switch (selectedFilter) {
      case 'tonight': return 'Tonight'
      case 'this-weekend': return 'This Weekend'
      case 'this-month': return `${now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`
      case 'next-month': {
        const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1)
        return nextMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      }
      case 'custom': {
        if (!customStartDate || !customEndDate) return 'Custom Range'
        return `${new Date(customStartDate).toLocaleDateString()} - ${new Date(customEndDate).toLocaleDateString()}`
      }
      default: return 'All Events'
    }
  }

  const renderListView = () => (
    <div className="space-y-6">
      {filteredEvents.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📅</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No events found</h3>
          <p className="text-gray-600 mb-6">Try selecting a different date range or check back later.</p>
        </div>
      ) : (
        Object.entries(
          filteredEvents.reduce((groups: { [key: string]: Event[] }, event) => {
            const dateKey = new Date(event.date).toDateString()
            if (!groups[dateKey]) groups[dateKey] = []
            groups[dateKey].push(event)
            return groups
          }, {})
        ).map(([dateStr, dayEvents]) => (
          <div key={dateStr} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {new Date(dateStr).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h3>
              <p className="text-sm text-gray-600">
                {dayEvents.length} event{dayEvents.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dayEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )

  const renderCalendarView = () => {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    const firstDay = new Date(currentYear, currentMonth, 1)
    const lastDay = new Date(currentYear, currentMonth + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())
    
    const days = []
    const eventsByDate: { [key: string]: Event[] } = {}
    
    // Group events by date
    filteredEvents.forEach(event => {
      const dateKey = new Date(event.date).toDateString()
      if (!eventsByDate[dateKey]) eventsByDate[dateKey] = []
      eventsByDate[dateKey].push(event)
    })
    
    // Generate calendar grid
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)
      const dateKey = date.toDateString()
      const dayEvents = eventsByDate[dateKey] || []
      const isCurrentMonth = date.getMonth() === currentMonth
      const isToday = date.toDateString() === now.toDateString()
      
      days.push({
        date,
        dateKey,
        events: dayEvents,
        isCurrentMonth,
        isToday
      })
    }

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-7 gap-0">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="bg-gray-50 p-4 text-center font-medium text-gray-700 border-b border-gray-200">
              {day}
            </div>
          ))}
          {days.map((day, index) => (
            <div
              key={index}
              className={`min-h-[120px] p-2 border-b border-r border-gray-200 ${
                !day.isCurrentMonth ? 'bg-gray-50 text-gray-400' : 'bg-white'
              } ${day.isToday ? 'bg-blue-50' : ''}`}
            >
              <div className={`text-sm font-medium mb-1 ${
                day.isToday ? 'text-blue-600 bg-blue-100 rounded-full w-6 h-6 flex items-center justify-center' : ''
              }`}>
                {day.date.getDate()}
              </div>
              <div className="space-y-1">
                {day.events.slice(0, 2).map((event, eventIndex) => (
                  <div
                    key={eventIndex}
                    className="text-xs p-1 bg-music-purple-100 text-music-purple-800 rounded truncate"
                    title={event.title}
                  >
                    {event.title}
                  </div>
                ))}
                {day.events.length > 2 && (
                  <div className="text-xs text-gray-500">
                    +{day.events.length - 2} more
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderPostView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredEvents.length === 0 ? (
        <div className="col-span-full text-center py-16">
          <div className="text-6xl mb-4">🎵</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No events found</h3>
          <p className="text-gray-600 mb-6">Try selecting a different date range or check back later.</p>
        </div>
      ) : (
        filteredEvents.map((event) => (
          <EventCard key={event.id} event={event} />
        ))
      )}
    </div>
  )

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50">
          <div className="bg-gradient-to-r from-music-purple-50 to-music-blue-100 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <div className="h-12 bg-gray-200 rounded mb-6 animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded mx-auto max-w-2xl animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-music-purple-50 to-music-blue-100 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl font-bold text-music-purple-950 mb-4">
                Event Calendar
              </h1>
              <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-8">
                Stay up to date with all the live music events happening in St. Louis.
              </p>
              
              {/* Quick Stats */}
              <div className="flex justify-center space-x-8 text-center">
                <div>
                  <div className="text-2xl font-bold text-music-purple-600">{filteredEvents.length}</div>
                  <div className="text-sm text-gray-600">{getDateRangeText()}</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-music-blue-600">{events.length}</div>
                  <div className="text-sm text-gray-600">Total Events</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-wrap gap-4 justify-between items-center">
              {/* Date Filters - Left Side */}
              <div className="flex flex-wrap gap-3 items-center">
                <span className="text-sm font-medium text-gray-700">Filter by:</span>
                
                <button
                  onClick={() => setSelectedFilter('tonight')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedFilter === 'tonight'
                      ? 'bg-music-purple-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Tonight
                </button>
                
                <button
                  onClick={() => setSelectedFilter('this-weekend')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedFilter === 'this-weekend'
                      ? 'bg-music-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  This Weekend
                </button>
                
                <button
                  onClick={() => setSelectedFilter('this-month')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedFilter === 'this-month'
                      ? 'bg-music-accent-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  This Month
                </button>
                
                <button
                  onClick={() => setSelectedFilter('next-month')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedFilter === 'next-month'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Next Month
                </button>
                
                <button
                  onClick={() => setSelectedFilter('custom')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedFilter === 'custom'
                      ? 'bg-orange-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Custom
                </button>
                
                {selectedFilter === 'custom' && (
                  <div className="flex gap-2 items-center">
                    <input
                      type="date"
                      value={customStartDate}
                      onChange={(e) => setCustomStartDate(e.target.value)}
                      className="px-3 py-1 border border-gray-300 rounded text-sm"
                    />
                    <span className="text-gray-500">to</span>
                    <input
                      type="date"
                      value={customEndDate}
                      onChange={(e) => setCustomEndDate(e.target.value)}
                      className="px-3 py-1 border border-gray-300 rounded text-sm"
                    />
                  </div>
                )}
              </div>

              {/* View Mode Selector - Right Side */}
              <div className="flex items-center gap-3">
                <label htmlFor="view-select" className="text-sm font-medium text-gray-700">
                  View:
                </label>
                <select
                  id="view-select"
                  value={selectedView}
                  onChange={(e) => setSelectedView(e.target.value as ViewMode)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium bg-white text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-music-purple-500 focus:border-transparent"
                >
                  <option value="list">📋 List View</option>
                  <option value="calendar">📅 Calendar View</option>
                  <option value="post">🎵 Post View</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {getDateRangeText()} Events
            </h2>
            <p className="text-gray-600">
              {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} found
            </p>
          </div>

          {selectedView === 'list' && renderListView()}
          {selectedView === 'calendar' && renderCalendarView()}
          {selectedView === 'post' && renderPostView()}
        </div>
      </div>
    </Layout>
  )
}