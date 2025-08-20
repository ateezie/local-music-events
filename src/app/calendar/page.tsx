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
  const [selectedView, setSelectedView] = useState<ViewMode>('calendar')
  const [selectedFilter, setSelectedFilter] = useState<DateFilter>('this-month')
  const [customStartDate, setCustomStartDate] = useState('')
  const [customEndDate, setCustomEndDate] = useState('')
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  
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

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth)
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1)
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1)
    }
    setCurrentMonth(newMonth)
  }

  const getEventsForMonth = () => {
    const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
    const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)
    
    return events.filter(event => {
      const eventDate = new Date(event.date)
      return eventDate >= startOfMonth && eventDate <= endOfMonth
    })
  }

  const renderCalendarView = () => {
    const monthEvents = getEventsForMonth()
    const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
    const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())
    
    const today = new Date()
    const days = []
    const eventsByDate: { [key: string]: Event[] } = {}
    
    // Group events by date
    monthEvents.forEach(event => {
      const dateKey = new Date(event.date).toDateString()
      if (!eventsByDate[dateKey]) eventsByDate[dateKey] = []
      eventsByDate[dateKey].push(event)
    })
    
    // Generate calendar grid (6 weeks)
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)
      const dateKey = date.toDateString()
      const dayEvents = eventsByDate[dateKey] || []
      const isCurrentMonth = date.getMonth() === currentMonth.getMonth()
      const isToday = date.toDateString() === today.toDateString()
      
      days.push({
        date,
        dateKey,
        events: dayEvents,
        isCurrentMonth,
        isToday
      })
    }

    const getEventColor = (event: Event) => {
      const colors = {
        'rock': 'bg-red-100 text-red-800 border-red-200',
        'electronic': 'bg-blue-100 text-blue-800 border-blue-200',
        'jazz': 'bg-yellow-100 text-yellow-800 border-yellow-200',
        'hip-hop': 'bg-purple-100 text-purple-800 border-purple-200',
        'indie-rock': 'bg-pink-100 text-pink-800 border-pink-200',
        'punk': 'bg-orange-100 text-orange-800 border-orange-200',
        'acoustic': 'bg-green-100 text-green-800 border-green-200',
        'folk': 'bg-amber-100 text-amber-800 border-amber-200',
        'blues': 'bg-indigo-100 text-indigo-800 border-indigo-200',
        'default': 'bg-gray-100 text-gray-800 border-gray-200'
      }
      return colors[event.genre as keyof typeof colors] || colors.default
    }

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Calendar Header with Navigation */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            aria-label="Previous month"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <h2 className="text-xl font-semibold text-gray-900">
            {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h2>
          
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            aria-label="Next month"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-0">
          {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
            <div key={day} className="bg-gray-50 p-3 text-center font-medium text-gray-700 border-b border-gray-200">
              <span className="hidden sm:inline">{day}</span>
              <span className="sm:hidden">{day.slice(0, 3)}</span>
            </div>
          ))}
          
          {days.map((day, index) => (
            <div
              key={index}
              className={`min-h-[140px] sm:min-h-[160px] p-2 border-b border-r border-gray-200 transition-colors ${
                !day.isCurrentMonth ? 'bg-gray-50' : 'bg-white hover:bg-gray-50'
              } ${day.isToday ? 'bg-blue-50' : ''}`}
            >
              {/* Date Number */}
              <div className={`text-sm font-medium mb-2 ${
                day.isToday 
                  ? 'text-blue-600 bg-blue-600 text-white rounded-full w-7 h-7 flex items-center justify-center' 
                  : day.isCurrentMonth 
                    ? 'text-gray-900' 
                    : 'text-gray-400'
              }`}>
                {day.date.getDate()}
              </div>
              
              {/* Events */}
              <div className="space-y-1">
                {day.events.slice(0, 3).map((event, eventIndex) => (
                  <div
                    key={eventIndex}
                    onClick={() => setSelectedEvent(event)}
                    className={`text-xs p-2 rounded border cursor-pointer hover:shadow-sm transition-all ${getEventColor(event)}`}
                    title={`${event.title} - ${event.time} at ${event.venue?.name || 'TBA'}`}
                  >
                    <div className="font-medium truncate">{event.title}</div>
                    <div className="text-xs opacity-75 truncate">
                      {event.time} • {event.venue?.name || 'TBA'}
                    </div>
                  </div>
                ))}
                
                {day.events.length > 3 && (
                  <div className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded cursor-pointer hover:bg-gray-200 transition-colors">
                    +{day.events.length - 3} more events
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Event Details Modal */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{selectedEvent.title}</h3>
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                {selectedEvent.flyer && (
                  <img 
                    src={selectedEvent.flyer} 
                    alt={selectedEvent.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-center text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {new Date(selectedEvent.date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {(() => {
                      const [hours, minutes] = selectedEvent.time.split(':');
                      const hour = parseInt(hours);
                      const ampm = hour >= 12 ? 'PM' : 'AM';
                      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
                      return `${displayHour}:${minutes} ${ampm}`;
                    })()}
                  </div>
                  
                  {selectedEvent.venue && (
                    <div className="flex items-center text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {selectedEvent.venue.name}
                    </div>
                  )}
                  
                  {selectedEvent.price && (
                    <div className="flex items-center text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                      {selectedEvent.price}
                    </div>
                  )}
                  
                  {selectedEvent.genre && (
                    <div className="flex items-center">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getEventColor(selectedEvent)}`}>
                        {selectedEvent.genre.replace('-', ' & ').toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                
                {selectedEvent.description && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600">{selectedEvent.description}</p>
                  </div>
                )}
                
                <div className="mt-6 flex gap-3">
                  {selectedEvent.ticketUrl && (
                    <a
                      href={selectedEvent.ticketUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-music-purple-600 text-white px-4 py-2 rounded-lg font-medium text-center hover:bg-music-purple-700 transition-colors"
                    >
                      Get Tickets
                    </a>
                  )}
                  {selectedEvent.facebookEvent && (
                    <a
                      href={selectedEvent.facebookEvent}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium text-center hover:bg-blue-700 transition-colors"
                    >
                      Facebook Event
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
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
                  <div className="text-2xl font-bold text-music-purple-600">
                    {selectedView === 'calendar' ? getEventsForMonth().length : filteredEvents.length}
                  </div>
                  <div className="text-sm text-gray-600">
                    {selectedView === 'calendar' 
                      ? currentMonth.toLocaleDateString('en-US', { month: 'long' })
                      : getDateRangeText()
                    }
                  </div>
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