import { Event, MusicGenre, SocialMedia, MediaLinks } from './event'

export interface Artist {
  id: string
  name: string
  genre: MusicGenre
  subGenres?: MusicGenre[]
  bio?: string
  image?: string
  website?: string
  socialMedia?: SocialMedia
  mediaLinks?: MediaLinks
  hometown?: string
  formed?: string // year or date
  members?: ArtistMember[]
  tags: string[]
  createdAt: string
  updatedAt?: string
  verified?: boolean
}

export interface ArtistMember {
  name: string
  instrument?: string
  role?: string
  joinDate?: string
  active: boolean
}

export interface ArtistAlbum {
  id: string
  title: string
  releaseDate: string
  image?: string
  tracks?: string[]
  streamingLinks?: MediaLinks
}

export interface ArtistSong {
  id: string
  title: string
  duration?: string // MM:SS format
  album?: string
  releaseDate?: string
  streamingLinks?: MediaLinks
}

export type ArtistType = 
  | 'solo'
  | 'band' 
  | 'duo'
  | 'group'
  | 'orchestra'
  | 'choir'
  | 'dj'
  | 'producer'
  | 'tribute-band'
  | 'cover-band'

export type CareerStage = 
  | 'emerging'
  | 'local'
  | 'regional'
  | 'national'
  | 'international'
  | 'legendary'

export interface ArtistStats {
  totalEvents: number
  upcomingEvents: number
  pastEvents: number
  favoriteVenues: string[]
  mostPlayedGenres: MusicGenre[]
  yearsActive: number
  followers?: number
  monthlyListeners?: number
}

// Extended artist interface with related data
export interface ArtistWithEvents extends Artist {
  upcomingEvents: Event[]
  pastEvents: Event[]
  stats: ArtistStats
  albums?: ArtistAlbum[]
  topSongs?: ArtistSong[]
  collaborators?: Artist[]
}

export interface ArtistContact {
  type: 'booking' | 'management' | 'press' | 'general'
  name: string
  email?: string
  phone?: string
  company?: string
}

// Filtering and search
export interface ArtistFilterOptions {
  genre?: MusicGenre | MusicGenre[]
  hometown?: string
  artistType?: ArtistType[]
  careerStage?: CareerStage[]
  hasUpcomingEvents?: boolean
  yearFormed?: {
    min?: number
    max?: number
  }
  searchQuery?: string
  tags?: string[]
  verified?: boolean
}

export interface ArtistSortOptions {
  sortBy: 'name' | 'genre' | 'hometown' | 'upcomingEvents' | 'popularity' | 'yearFormed'
  order: 'asc' | 'desc'
}

// Component props
export interface ArtistCardProps {
  artist: Artist
  className?: string
  showUpcomingEvents?: boolean
  upcomingEventsCount?: number
  showGenre?: boolean
  showHometown?: boolean
  compact?: boolean
}

export interface ArtistDetailsProps {
  artist: ArtistWithEvents
  className?: string
}

export interface ArtistListProps {
  artists: Artist[]
  loading?: boolean
  onArtistClick?: (artist: Artist) => void
  className?: string
}

export interface ArtistProfileProps {
  artist: ArtistWithEvents
  onBookingClick?: (artist: Artist) => void
  onFollowClick?: (artist: Artist) => void
  className?: string
}

// Form data for artist creation/editing
export interface ArtistFormData {
  name: string
  genre: MusicGenre
  subGenres?: MusicGenre[]
  bio?: string
  website?: string
  socialMedia?: SocialMedia
  mediaLinks?: MediaLinks
  hometown?: string
  formed?: string
  members?: ArtistMember[]
  tags: string[]
  artistType?: ArtistType
  careerStage?: CareerStage
}

export interface ArtistMemberFormData {
  name: string
  instrument?: string
  role?: string
  joinDate?: string
  active: boolean
}

export interface ArtistAlbumFormData {
  title: string
  releaseDate: string
  tracks?: string[]
  streamingLinks?: MediaLinks
}

// Search results and API responses
export interface ArtistSearchResult {
  artists: Artist[]
  totalCount: number
  currentPage: number
  totalPages: number
  filters?: ArtistFilterOptions
}

export interface ArtistApiResponse<T = unknown> {
  success: boolean
  data: T
  message?: string
  errors?: string[]
}

// Collaboration and networking
export interface ArtistCollaboration {
  id: string
  artists: Artist[]
  type: 'performance' | 'recording' | 'songwriting' | 'touring'
  startDate?: string
  endDate?: string
  description?: string
  events?: Event[]
}

export interface ArtistRecommendation {
  artist: Artist
  reason: string
  similarity: number
  commonTags: string[]
  sharedEvents?: Event[]
}

// Booking and management
export interface BookingInquiry {
  id: string
  artistId: string
  venueId?: string
  eventDate: string
  eventType: string
  budget?: string
  message: string
  contactInfo: {
    name: string
    email: string
    phone?: string
  }
  status: 'pending' | 'accepted' | 'declined' | 'negotiating'
  createdAt: string
}

export interface ArtistAvailability {
  artistId: string
  availableDates: string[]
  unavailableDates: string[]
  tourDates?: {
    start: string
    end: string
    cities: string[]
  }[]
  preferredVenues?: string[]
  minimumNotice?: number // days
}

// Utility types
export type ArtistId = Artist['id']
export type ArtistName = Artist['name']
export type ArtistGenre = Artist['genre']
export type ArtistHometown = Artist['hometown']

// Genre and tag management
export interface GenreInfo {
  id: MusicGenre
  name: string
  description: string
  color: string
  relatedGenres: MusicGenre[]
  popularArtists: Artist[]
  upcomingEvents: Event[]
}

export interface ArtistTag {
  id: string
  name: string
  description?: string
  category: 'style' | 'mood' | 'era' | 'instrument' | 'other'
  artistCount: number
}

// Analytics and insights
export interface ArtistAnalytics {
  artistId: string
  period: 'week' | 'month' | 'quarter' | 'year'
  metrics: {
    profileViews: number
    eventAttendance: number
    bookingInquiries: number
    socialMediaGrowth: Record<string, number>
    topSongs: ArtistSong[]
    fanDemographics?: {
      ageGroups: Record<string, number>
      locations: Record<string, number>
    }
  }
}