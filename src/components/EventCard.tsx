import Link from 'next/link'
import { EventCardProps } from '@/types'
import EventImage from './EventImage'
import { formatEventDateSafe, formatEventTime } from '@/lib/dateUtils'

function GenreBadge({ genre }: { genre: string }) {
  return (
    <span 
      className="px-2 py-1 rounded-full text-xs font-medium text-white"
      style={{ backgroundColor: 'rgb(76, 98, 134)' }}
    >
      {genre.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
    </span>
  )
}

function PriceBadge({ price }: { price: string | object }) {
  // Handle both string and object price formats
  let priceText: string
  if (typeof price === 'object' && price !== null) {
    const priceObj = price as any
    if (priceObj.min === 0 && priceObj.max === null) {
      // Only show 'Free' if explicitly set, not for missing price info
      priceText = ''
    } else if (priceObj.max) {
      priceText = `$${priceObj.min}-$${priceObj.max}`
    } else if (priceObj.min > 0) {
      priceText = `$${priceObj.min}`
    } else {
      priceText = ''
    }
  } else {
    priceText = (price as string) || ''
  }

  // Don't render anything if there's no price
  if (!priceText) {
    return null
  }

  const isFree = priceText.toLowerCase().includes('free')
  const colorClass = isFree 
    ? 'bg-green-100 text-green-700' 
    : 'bg-resolution-100 text-resolution-700'

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
      {priceText}
    </span>
  )
}

// Removed local functions - now using imported utilities from @/lib/dateUtils

export default function EventCard({ event, className = '', featured = false }: EventCardProps) {
  const cardClasses = featured
    ? `event-card ${className} transform hover:scale-[1.02]`
    : `event-card ${className}`


  // Use slug if available, otherwise fall back to ID
  const eventUrl = event.slug ? `/events/${event.slug}` : `/events/${event.id}`

  return (
    <Link href={eventUrl} className={cardClasses}>
      {/* Event Image/Flyer */}
      <div className="aspect-video overflow-hidden relative">
        <EventImage
          src={event.flyer}
          alt={event.title}
          width={400}
          height={225}
          className="object-cover group-hover:scale-105 transition-transform duration-300 w-full h-full"
          category={event.category}
          genre={event.genre}
        />
        
        {/* Featured Badge */}
        {event.featured && (
          <div className="absolute top-3 right-3">
            <span className="bg-sun-400 text-neutral-900 px-3 py-1 rounded-full text-xs font-semibold shadow-large">
              Featured
            </span>
          </div>
        )}

        {/* Status Badge */}
        {event.status === 'sold-out' && (
          <div className="absolute top-3 left-3">
            <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
              Sold Out
            </span>
          </div>
        )}

        {/* Quick Info Overlay for Featured Cards */}
        {featured && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center text-white text-sm">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{formatEventDateSafe(event.date)}</span>
                </div>
                <span className="mx-2">•</span>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{formatEventTime(event.time)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Event Content */}
      <div className={featured ? 'p-8' : 'p-6'}>
        <h3 
          className={`${featured ? 'heading-h3' : 'heading-h4'} text-neutral-900 mb-2 group-hover:text-resolution-600 transition-colors duration-200`}
        >
          {event.title}
        </h3>
        

        {/* Event Metadata - Date and Time on one line */}
        <div className="flex items-center text-tiny text-neutral-500 mb-3">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{formatEventDateSafe(event.date)}</span>
          </div>
          <span className="mx-2">•</span>
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{formatEventTime(event.time)}</span>
          </div>
        </div>

        {/* Venue and Artist Info */}
        <div className="pt-3 border-t border-neutral-200">
          <div className="mb-3">
            {/* Venue Info */}
            <div className="flex items-center text-tiny text-neutral-500 mb-1">
              <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{event.venue.name}</span>
            </div>
            
            {/* Promoter Info */}
            {(event.promoter || (event.promoters && event.promoters.length > 0)) && (
              <div className="flex items-center text-tiny text-neutral-500">
                <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span>
                  {event.promoters && event.promoters.length > 0 
                    ? event.promoters.join(', ') 
                    : event.promoter}
                </span>
              </div>
            )}
          </div>

          {/* Genre Pills */}
          <div className="flex flex-wrap gap-1">
            {event.genre === 'multi-genre' && event.subGenres && Array.isArray(event.subGenres) && event.subGenres.length > 0 ? (
              // Show only sub-genres as pills for multi-genre events (not the main "multi-genre" badge)
              event.subGenres.map((genre) => (
                <GenreBadge key={genre} genre={genre} />
              ))
            ) : event.genre !== 'multi-genre' ? (
              // Show main genre for single-genre events (but not if it's multi-genre with no subGenres)
              <GenreBadge genre={event.genre} />
            ) : null}
          </div>
        </div>

        {/* Tags (for featured cards) */}
        {featured && event.tags && event.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {event.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-resolution-100 text-resolution-700 rounded-full text-xs font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}