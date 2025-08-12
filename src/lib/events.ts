import { Event, Venue, Artist, EventCategoryInfo, GenreInfo, EventFilterOptions, EventSortOptions } from '@/types'
import eventsData from '@/data/events.json'

// Get all events
export function getAllEvents(): Event[] {
  return eventsData.events as Event[]
}

// Get all venues
export function getAllVenues(): Venue[] {
  return eventsData.venues as Venue[]
}

// Get all artists
export function getAllArtists(): Artist[] {
  return eventsData.artists as Artist[]
}

// Get all categories
export function getAllCategories(): EventCategoryInfo[] {
  return eventsData.categories as EventCategoryInfo[]
}

// Get all genres
export function getAllGenres(): GenreInfo[] {
  return eventsData.genres as GenreInfo[]
}

// Get event by ID
export function getEventById(id: string): Event | undefined {
  return getAllEvents().find(event => event.id === id)
}

// Get venue by ID
export function getVenueById(id: string): Venue | undefined {
  return getAllVenues().find(venue => venue.id === id)
}

// Get artist by ID
export function getArtistById(id: string): Artist | undefined {
  return getAllArtists().find(artist => artist.id === id)
}

// Get events by category
export function getEventsByCategory(categoryId: string): Event[] {
  if (categoryId === 'all') return getAllEvents()
  return getAllEvents().filter(event => event.category === categoryId)
}

// Get events by genre
export function getEventsByGenre(genreId: string): Event[] {
  if (genreId === 'all') return getAllEvents()
  return getAllEvents().filter(event => event.genre === genreId)
}

// Get events by venue
export function getEventsByVenue(venueId: string): Event[] {
  return getAllEvents().filter(event => event.venue.id === venueId)
}

// Get events by artist
export function getEventsByArtist(artistId: string): Event[] {
  return getAllEvents().filter(event => 
    event.artists.some(artist => artist.id === artistId)
  )
}

// Get featured events
export function getFeaturedEvents(): Event[] {
  return getAllEvents().filter(event => event.featured)
}

// Get upcoming events
export function getUpcomingEvents(): Event[] {
  const now = new Date()
  return getAllEvents().filter(event => {
    const eventDate = new Date(event.date)
    return eventDate >= now && event.status === 'upcoming'
  })
}

// Get today's events
export function getTodaysEvents(): Event[] {
  const today = new Date().toISOString().split('T')[0]
  return getAllEvents().filter(event => 
    event.date === today && event.status === 'upcoming'
  )
}

// Get this weekend's events (Friday to Sunday)
export function getWeekendEvents(): Event[] {
  const today = new Date()
  const dayOfWeek = today.getDay() // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  
  // Calculate days until Friday (if today is before Friday)
  // or get the current weekend (if today is Friday, Saturday, or Sunday)
  let daysToFriday = 5 - dayOfWeek // Friday is day 5
  if (daysToFriday < 0) daysToFriday += 7 // Next week's Friday if past Friday
  
  const friday = new Date(today)
  friday.setDate(today.getDate() + daysToFriday)
  
  const sunday = new Date(friday)
  sunday.setDate(friday.getDate() + 2)
  
  const fridayStr = friday.toISOString().split('T')[0]
  const saturdayStr = new Date(friday.getTime() + 86400000).toISOString().split('T')[0]
  const sundayStr = sunday.toISOString().split('T')[0]
  
  return getAllEvents().filter(event => 
    [fridayStr, saturdayStr, sundayStr].includes(event.date) && 
    event.status === 'upcoming'
  )
}

// Get events in date range
export function getEventsByDateRange(startDate: string, endDate: string): Event[] {
  return getAllEvents().filter(event => {
    return event.date >= startDate && event.date <= endDate && event.status === 'upcoming'
  })
}

// Search events by query
export function searchEvents(query: string): Event[] {
  if (!query.trim()) return getAllEvents()
  
  const searchTerm = query.toLowerCase()
  
  return getAllEvents().filter(event => {
    // Search in title
    if (event.title.toLowerCase().includes(searchTerm)) return true
    
    // Search in description
    if (event.description.toLowerCase().includes(searchTerm)) return true
    
    // Search in venue name
    if (event.venue.name.toLowerCase().includes(searchTerm)) return true
    
    // Search in artist names
    if (event.artists.some(artist => 
      artist.name.toLowerCase().includes(searchTerm)
    )) return true
    
    // Search in genre
    if (event.genre.toLowerCase().includes(searchTerm)) return true
    
    // Search in tags
    if (event.tags.some(tag => tag.toLowerCase().includes(searchTerm))) return true
    
    return false
  })
}

// Search venues by query
export function searchVenues(query: string): Venue[] {
  if (!query.trim()) return getAllVenues()
  
  const searchTerm = query.toLowerCase()
  
  return getAllVenues().filter(venue => {
    return venue.name.toLowerCase().includes(searchTerm) ||
           venue.city.toLowerCase().includes(searchTerm) ||
           venue.address.toLowerCase().includes(searchTerm)
  })
}

// Search artists by query
export function searchArtists(query: string): Artist[] {
  if (!query.trim()) return getAllArtists()
  
  const searchTerm = query.toLowerCase()
  
  return getAllArtists().filter(artist => {
    return artist.name.toLowerCase().includes(searchTerm) ||
           artist.genre.toLowerCase().includes(searchTerm) ||
           (artist.hometown && artist.hometown.toLowerCase().includes(searchTerm)) ||
           artist.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  })
}

// Filter events
export function filterEvents(events: Event[], filters: EventFilterOptions): Event[] {
  let filtered = [...events]
  
  // Filter by date
  if (filters.date) {
    if (filters.date === 'today') {
      const today = new Date().toISOString().split('T')[0]
      filtered = filtered.filter(event => event.date === today)
    } else if (filters.date === 'this-weekend') {
      const weekendEvents = getWeekendEvents()
      const weekendIds = weekendEvents.map(e => e.id)
      filtered = filtered.filter(event => weekendIds.includes(event.id))
    } else if (filters.date === 'this-month') {
      const today = new Date()
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0]
      const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0]
      filtered = filtered.filter(event => event.date >= firstDay && event.date <= lastDay)
    } else {
      filtered = filtered.filter(event => event.date === filters.date)
    }
  }
  
  // Filter by date range
  if (filters.dateRange) {
    filtered = filtered.filter(event => 
      event.date >= filters.dateRange!.start && event.date <= filters.dateRange!.end
    )
  }
  
  // Filter by venue
  if (filters.venue) {
    filtered = filtered.filter(event => event.venue.id === filters.venue)
  }
  
  // Filter by genre
  if (filters.genre) {
    const genres = Array.isArray(filters.genre) ? filters.genre : [filters.genre]
    filtered = filtered.filter(event => genres.includes(event.genre as any))
  }
  
  // Filter by category
  if (filters.category) {
    const categories = Array.isArray(filters.category) ? filters.category : [filters.category]
    filtered = filtered.filter(event => categories.includes(event.category as any))
  }
  
  // Filter by status
  if (filters.status && filters.status.length > 0) {
    filtered = filtered.filter(event => filters.status!.includes(event.status))
  }
  
  // Filter by tags
  if (filters.tags && filters.tags.length > 0) {
    filtered = filtered.filter(event => 
      filters.tags!.some(tag => event.tags.includes(tag))
    )
  }
  
  // Filter by search query
  if (filters.searchQuery) {
    const searchResults = searchEvents(filters.searchQuery)
    const searchIds = searchResults.map(event => event.id)
    filtered = filtered.filter(event => searchIds.includes(event.id))
  }
  
  return filtered
}

// Sort events
export function sortEvents(events: Event[], sortOptions: EventSortOptions): Event[] {
  const sorted = [...events]
  
  switch (sortOptions.sortBy) {
    case 'date':
      sorted.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      break
      
    case 'title':
      sorted.sort((a, b) => a.title.localeCompare(b.title))
      break
      
    case 'venue':
      sorted.sort((a, b) => a.venue.name.localeCompare(b.venue.name))
      break
      
    case 'genre':
      sorted.sort((a, b) => a.genre.localeCompare(b.genre))
      break
      
    case 'popularity':
      // Sort by featured first, then by artist count, then by venue capacity
      sorted.sort((a, b) => {
        if (a.featured && !b.featured) return -1
        if (!a.featured && b.featured) return 1
        
        const aCapacity = a.venue.capacity || 0
        const bCapacity = b.venue.capacity || 0
        return bCapacity - aCapacity
      })
      break
      
    default:
      // Default to date
      sorted.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }
  
  if (sortOptions.order === 'desc') {
    return sorted.reverse()
  }
  
  return sorted
}

// Get related events based on current event
export function getRelatedEvents(currentEvent: Event, limit: number = 4): Event[] {
  const allEvents = getAllEvents()
    .filter(event => event.id !== currentEvent.id && event.status === 'upcoming')
  
  // Score events based on similarity
  const scored = allEvents.map(event => {
    let score = 0
    
    // Same genre gets high score
    if (event.genre === currentEvent.genre) score += 50
    
    // Same venue gets high score
    if (event.venue.id === currentEvent.venue.id) score += 40
    
    // Same category
    if (event.category === currentEvent.category) score += 30
    
    // Shared artists
    const sharedArtists = currentEvent.artists.filter(artist => 
      event.artists.some(a => a.id === artist.id)
    )
    score += sharedArtists.length * 25
    
    // Similar date (within 7 days)
    const daysDiff = Math.abs(
      new Date(event.date).getTime() - new Date(currentEvent.date).getTime()
    ) / (1000 * 60 * 60 * 24)
    if (daysDiff <= 7) score += 15
    
    // Shared tags
    const sharedTags = currentEvent.tags.filter(tag => event.tags.includes(tag))
    score += sharedTags.length * 10
    
    return { event, score }
  })
  
  // Sort by score and return top results
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.event)
}

// Get popular tags
export function getPopularTags(limit: number = 10): Array<{ tag: string, count: number }> {
  const tagCounts = new Map<string, number>()
  
  getAllEvents().forEach(event => {
    event.tags.forEach(tag => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1)
    })
  })
  
  return Array.from(tagCounts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
}

// Get event statistics
export function getEventStats() {
  const events = getAllEvents()
  const venues = getAllVenues()
  const artists = getAllArtists()
  const upcomingEvents = getUpcomingEvents()
  
  // Count events by genre
  const genreCounts = new Map<string, number>()
  events.forEach(event => {
    genreCounts.set(event.genre, (genreCounts.get(event.genre) || 0) + 1)
  })
  
  const popularGenres = Array.from(genreCounts.entries())
    .map(([genre, count]) => ({ genre: genre as any, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
  
  return {
    totalEvents: events.length,
    totalVenues: venues.length,
    totalArtists: artists.length,
    upcomingEvents: upcomingEvents.length,
    thisWeekEvents: getWeekendEvents().length,
    popularGenres
  }
}

// Pagination helper
export function paginateEvents(events: Event[], page: number, limit: number) {
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  
  return {
    events: events.slice(startIndex, endIndex),
    totalCount: events.length,
    currentPage: page,
    totalPages: Math.ceil(events.length / limit),
    hasNextPage: endIndex < events.length,
    hasPrevPage: page > 1
  }
}

// Format date helpers
export function formatEventDate(dateString: string): string {
  const date = new Date(dateString)
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }
  return date.toLocaleDateString('en-US', options)
}

export function formatEventTime(timeString: string): string {
  const [hours, minutes] = timeString.split(':')
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 || 12
  return `${displayHour}:${minutes} ${ampm}`
}

// Generate URLs
export function getEventUrl(event: Event): string {
  return `/events/${event.id}`
}

export function getVenueUrl(venue: Venue): string {
  return `/venues/${venue.id}`
}

export function getArtistUrl(artist: Artist): string {
  return `/artists/${artist.id}`
}

export function getCategoryUrl(categoryId: string): string {
  return `/events?category=${categoryId}`
}

export function getGenreUrl(genreId: string): string {
  return `/events?genre=${genreId}`
}

export function getSearchUrl(query: string): string {
  return `/search?q=${encodeURIComponent(query)}`
}

// Calendar helpers
export function getEventsForDate(date: Date): Event[] {
  const dateString = date.toISOString().split('T')[0]
  return getAllEvents().filter(event => event.date === dateString)
}

export function getEventsForMonth(year: number, month: number): Event[] {
  const firstDay = new Date(year, month, 1).toISOString().split('T')[0]
  const lastDay = new Date(year, month + 1, 0).toISOString().split('T')[0]
  
  return getAllEvents().filter(event => 
    event.date >= firstDay && event.date <= lastDay
  )
}