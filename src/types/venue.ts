import { Event, SocialMedia } from './event'

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
  amenities?: VenueAmenity[]
  accessibility?: AccessibilityFeature[]
  coordinates?: {
    lat: number
    lng: number
  }
  hours?: VenueHours
  parkingInfo?: string
  publicTransit?: string[]
  createdAt: string
  updatedAt?: string
}

export interface VenueHours {
  monday?: string
  tuesday?: string
  wednesday?: string
  thursday?: string
  friday?: string
  saturday?: string
  sunday?: string
  notes?: string
}

export type VenueAmenity = 
  | 'parking'
  | 'bar'
  | 'food'
  | 'coat-check'
  | 'atm'
  | 'outdoor-area'
  | 'dance-floor'
  | 'vip-area'
  | 'multiple-stages'
  | 'green-room'
  | 'wifi'
  | 'air-conditioning'
  | 'heating'

export type AccessibilityFeature =
  | 'wheelchair-accessible'
  | 'accessible-parking'
  | 'accessible-restrooms'
  | 'elevator'
  | 'ramp-access'
  | 'accessible-seating'
  | 'braille-signage'
  | 'hearing-loop'
  | 'sign-language-interpreter'

export type VenueType = 
  | 'concert-hall'
  | 'bar'
  | 'club'
  | 'outdoor-venue'
  | 'festival-grounds'
  | 'theater'
  | 'coffee-shop'
  | 'restaurant'
  | 'warehouse'
  | 'community-center'
  | 'house-venue'
  | 'arena'
  | 'stadium'
  | 'amphitheater'

export interface VenueCategory {
  id: VenueType
  name: string
  description: string
  icon: string
  count: number
}

export interface VenueStats {
  totalEvents: number
  upcomingEvents: number
  pastEvents: number
  averageCapacity?: number
  popularGenres: string[]
  busyDays: string[]
  rating?: number
  reviewCount?: number
}

export interface VenueContact {
  name: string
  role: string
  email?: string
  phone?: string
}

// Extended venue interface with related data
export interface VenueWithEvents extends Venue {
  upcomingEvents: Event[]
  pastEvents: Event[]
  stats: VenueStats
  contacts?: VenueContact[]
}

// Venue filtering and search
export interface VenueFilterOptions {
  city?: string
  state?: string
  capacity?: {
    min?: number
    max?: number
  }
  amenities?: VenueAmenity[]
  accessibility?: AccessibilityFeature[]
  venueType?: VenueType[]
  hasUpcomingEvents?: boolean
  searchQuery?: string
}

export interface VenueSortOptions {
  sortBy: 'name' | 'city' | 'capacity' | 'upcomingEvents' | 'rating'
  order: 'asc' | 'desc'
}

// Component props
export interface VenueCardProps {
  venue: Venue
  className?: string
  showUpcomingCount?: boolean
  upcomingEvents?: number
  showStats?: boolean
  compact?: boolean
}

export interface VenueDetailsProps {
  venue: VenueWithEvents
  className?: string
}

export interface VenueListProps {
  venues: Venue[]
  loading?: boolean
  onVenueClick?: (venue: Venue) => void
  className?: string
}

// Form data for venue creation/editing
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
  amenities?: VenueAmenity[]
  accessibility?: AccessibilityFeature[]
  socialMedia?: SocialMedia
  hours?: VenueHours
  parkingInfo?: string
  publicTransit?: string[]
}

// API responses
export interface VenueSearchResult {
  venues: Venue[]
  totalCount: number
  currentPage: number
  totalPages: number
  filters?: VenueFilterOptions
}

export interface VenueApiResponse<T = unknown> {
  success: boolean
  data: T
  message?: string
  errors?: string[]
}

// Utility types
export type VenueId = Venue['id']
export type VenueName = Venue['name']
export type VenueCity = Venue['city']