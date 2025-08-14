export interface Event {
  id: string
  title: string
  slug?: string // URL-friendly version of title
  description: string
  date: string // ISO date string
  time: string // HH:MM format
  endTime?: string // HH:MM format
  venue: Venue
  artists: Artist[]
  genre: string
  subGenres?: string[] // Additional genres when genre is "multi-genre"
  category: EventCategory
  promoter?: string
  ticketUrl?: string
  facebookEvent?: string
  instagramPost?: string
  flyer?: string
  price?: string
  ageRestriction?: string
  featured: boolean
  hero?: boolean
  tags: string[]
  createdAt: string
  updatedAt?: string
  status: EventStatus
}

export interface Venue {
  id: string
  name: string
  address: string
  city: string
  state: string
  zipCode?: string
  capacity?: number
  website?: string
  phone?: string
  email?: string
  description?: string
  image?: string
  socialMedia?: SocialMedia
  amenities?: string[]
  accessibility?: string[]
  coordinates?: {
    lat: number
    lng: number
  }
}

export interface Artist {
  id: string
  name: string
  genre: string
  bio?: string
  image?: string
  website?: string
  socialMedia?: SocialMedia
  mediaLinks?: MediaLinks
  hometown?: string
  formed?: string // year or date
  members?: string[]
  tags: string[]
}

export interface Promoter {
  id: string
  name: string
  description: string
  website?: string
  contact?: string
  specialties: string[]
  eventCount: number
}

export interface SocialMedia {
  website?: string
  facebook?: string
  instagram?: string
  twitter?: string
  tiktok?: string
  youtube?: string
  spotify?: string
  bandcamp?: string
  soundcloud?: string
}

export interface MediaLinks {
  spotify?: string
  appleMusic?: string
  youtube?: string
  bandcamp?: string
  soundcloud?: string
  deezer?: string
}

// Enums and constants
export type EventCategory = 
  | 'concert' 
  | 'festival' 
  | 'open-mic' 
  | 'dj-set' 
  | 'album-release' 
  | 'acoustic' 
  | 'battle-of-bands' 
  | 'tribute'
  | 'comedy-music'
  | 'karaoke'

export type EventStatus = 'upcoming' | 'cancelled' | 'postponed' | 'sold-out' | 'past'

export type MusicGenre = 
  | 'house' 
  | 'drum-and-bass' 
  | 'ukg' 
  | 'dubstep' 
  | 'trance' 
  | 'techno' 
  | 'other'

// Category definitions for filtering
export interface EventCategoryInfo {
  id: EventCategory
  name: string
  description: string
  emoji: string
  count: number
}

export interface GenreInfo {
  id: MusicGenre
  name: string
  description: string
  color: string
  count: number
}

// Data container interfaces
export interface EventData {
  events: Event[]
  venues: Venue[]
  artists: Artist[]
  categories: EventCategoryInfo[]
  genres: GenreInfo[]
  promoters: Promoter[]
}

// Filter and search types
export interface EventFilterOptions {
  date?: string | 'today' | 'this-weekend' | 'this-month'
  dateRange?: {
    start: string
    end: string
  }
  venue?: string
  genre?: MusicGenre | MusicGenre[]
  category?: EventCategory | EventCategory[]
  promoter?: string
  priceRange?: {
    min: number
    max: number
  }
  ageRestriction?: string
  searchQuery?: string
  tags?: string[]
  status?: EventStatus[]
}

export interface EventSortOptions {
  sortBy: 'date' | 'title' | 'venue' | 'genre' | 'popularity' | 'price'
  order: 'asc' | 'desc'
}

// Component prop types
export interface EventCardProps {
  event: Event
  className?: string
  featured?: boolean
  compact?: boolean
}

export interface VenueCardProps {
  venue: Venue
  className?: string
  showUpcomingCount?: boolean
  upcomingEvents?: number
}

export interface ArtistCardProps {
  artist: Artist
  className?: string
  showUpcomingEvents?: boolean
  upcomingEvents?: Event[]
}

export interface CalendarProps {
  events: Event[]
  selectedDate?: Date
  onDateSelect?: (date: Date) => void
  view?: 'month' | 'week' | 'day'
  className?: string
}

export interface EventFiltersProps {
  filters: EventFilterOptions
  onFilterChange: (filters: EventFilterOptions) => void
  genres: GenreInfo[]
  categories: EventCategoryInfo[]
  venues: Venue[]
  className?: string
}

// Search and pagination
export interface EventSearchResult {
  events: Event[]
  totalCount: number
  currentPage: number
  totalPages: number
  filters: EventFilterOptions
}

export interface VenueSearchResult {
  venues: Venue[]
  totalCount: number
  currentPage: number
  totalPages: number
}

export interface ArtistSearchResult {
  artists: Artist[]
  totalCount: number
  currentPage: number
  totalPages: number
}

// Calendar specific types
export interface CalendarEvent {
  id: string
  title: string
  date: Date
  time: string
  venue: string
  genre: MusicGenre
  category: EventCategory
  color: string
}

export interface CalendarDay {
  date: Date
  events: CalendarEvent[]
  isToday: boolean
  isSelected: boolean
  isCurrentMonth: boolean
}

// Form types
export interface EventFormData {
  title: string
  description: string
  date: string
  time: string
  endTime?: string
  venueId: string
  artistIds: string[]
  genre: MusicGenre
  category: EventCategory
  promoter?: string
  ticketUrl?: string
  facebookEvent?: string
  price?: string
  ageRestriction?: string
  tags: string[]
}

export interface VenueFormData {
  name: string
  address: string
  city: string
  state: string
  zipCode?: string
  capacity?: number
  website?: string
  phone?: string
  email?: string
  description?: string
}

export interface ArtistFormData {
  name: string
  genre: MusicGenre
  bio?: string
  website?: string
  hometown?: string
  formed?: string
  members?: string[]
  tags: string[]
}

// Utility types
export type EventId = Event['id']
export type VenueId = Venue['id']
export type ArtistId = Artist['id']
export type PromoterId = Promoter['id']
export type EventGenre = Event['genre']
export type EventTitle = Event['title']

// Calendar utilities
export interface DateRange {
  start: Date
  end: Date
}

export interface CalendarViewState {
  view: 'month' | 'week' | 'day'
  selectedDate: Date
  currentMonth: Date
  filters: EventFilterOptions
}

// Statistics and analytics
export interface EventStats {
  totalEvents: number
  totalVenues: number
  totalArtists: number
  upcomingEvents: number
  thisWeekEvents: number
  popularGenres: Array<{ genre: MusicGenre; count: number }>
  popularVenues: Array<{ venue: Venue; eventCount: number }>
}

// Navigation and breadcrumb types (adapted from recipe types)
export interface EventNavItem {
  href: string
  label: string
  active?: boolean
}

export interface EventBreadcrumbItem {
  href?: string
  label: string
  active?: boolean
}

// Error handling
export interface EventErrorState {
  message: string
  code?: number
  retry?: () => void
}

// Loading states for events
export type EventLoadingState = 'idle' | 'loading' | 'success' | 'error'

// Theme and styling
export interface EventThemeColors {
  genre: Record<MusicGenre, string>
  category: Record<EventCategory, string>
  status: Record<EventStatus, string>
}

// API endpoints and responses
export interface EventApiResponse<T = unknown> {
  success: boolean
  data: T
  message?: string
  errors?: string[]
}

// Import/export types for data management
export interface EventImportData {
  events?: Event[]
  venues?: Venue[]
  artists?: Artist[]
}

export interface EventExportOptions {
  format: 'json' | 'csv' | 'ics'
  dateRange?: DateRange
  filters?: EventFilterOptions
}