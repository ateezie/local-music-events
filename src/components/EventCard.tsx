import Link from 'next/link'
import { EventCardProps } from '@/types'
import RecipeImage from './RecipeImage' // We'll rename this to EventImage later

function GenreBadge({ genre }: { genre: string }) {
  const genreColors: Record<string, string> = {
    rock: 'bg-orange-100 text-orange-700',
    'indie-rock': 'bg-pink-100 text-pink-700',
    punk: 'bg-red-100 text-red-700',
    metal: 'bg-gray-100 text-gray-800',
    alternative: 'bg-pink-100 text-pink-700',
    pop: 'bg-pink-100 text-pink-600',
    'hip-hop': 'bg-purple-100 text-purple-700',
    rap: 'bg-purple-100 text-purple-700',
    'r-b': 'bg-purple-100 text-purple-600',
    jazz: 'bg-yellow-100 text-yellow-700',
    blues: 'bg-blue-100 text-blue-700',
    country: 'bg-amber-100 text-amber-700',
    folk: 'bg-amber-100 text-amber-600',
    acoustic: 'bg-green-100 text-green-700',
    electronic: 'bg-cyan-100 text-cyan-700',
    edm: 'bg-cyan-100 text-cyan-600',
    house: 'bg-teal-100 text-teal-700',
    techno: 'bg-blue-100 text-blue-600',
    reggae: 'bg-green-100 text-green-600',
    ska: 'bg-lime-100 text-lime-700',
    classical: 'bg-purple-100 text-purple-600',
    experimental: 'bg-orange-100 text-orange-600',
    indie: 'bg-pink-100 text-pink-600',
    'singer-songwriter': 'bg-purple-100 text-purple-600',
    covers: 'bg-gray-100 text-gray-600',
    tribute: 'bg-blue-100 text-blue-600',
    'multi-genre': 'bg-yellow-100 text-yellow-700',
  }

  const colorClass = genreColors[genre] || 'bg-music-neutral-100 text-music-neutral-700'

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
      {genre.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
    </span>
  )
}

function PriceBadge({ price }: { price: string }) {
  const isFree = price.toLowerCase().includes('free')
  const colorClass = isFree 
    ? 'bg-green-100 text-green-700' 
    : 'bg-music-purple-100 text-music-purple-700'

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
      {price}
    </span>
  )
}

function formatEventDate(dateString: string) {
  const date = new Date(dateString)
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  }
  return date.toLocaleDateString('en-US', options)
}

function formatEventTime(timeString: string) {
  const [hours, minutes] = timeString.split(':')
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 || 12
  return `${displayHour}:${minutes} ${ampm}`
}

export default function EventCard({ event, className = '', featured = false }: EventCardProps) {
  const cardClasses = featured
    ? `event-card ${className} transform hover:scale-[1.02]`
    : `event-card ${className}`

  const primaryArtist = event.artists[0]
  const additionalArtistCount = event.artists.length - 1

  return (
    <Link href={`/events/${event.id}`} className={cardClasses}>
      {/* Event Image/Flyer */}
      <div className="aspect-video overflow-hidden relative">
        <RecipeImage
          src={event.flyer || '/images/flyers/default-event-flyer.jpg'}
          alt={event.title}
          width={400}
          height={225}
          className="object-cover group-hover:scale-105 transition-transform duration-300 w-full h-full"
        />
        
        {/* Featured Badge */}
        {event.featured && (
          <div className="absolute top-3 right-3">
            <span className="bg-music-accent-600 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
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
              <div className="flex items-center text-white text-sm space-x-4">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{formatEventDate(event.date)}</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{formatEventTime(event.time)}</span>
                </div>
                <GenreBadge genre={event.genre} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Event Content */}
      <div className={featured ? 'p-8' : 'p-6'}>
        <h3 className={`font-heading font-semibold text-music-purple-950 mb-2 group-hover:text-music-purple-600 transition-colors duration-200 ${featured ? 'text-2xl' : 'text-xl'}`}>
          {event.title}
        </h3>
        
        <p className={`text-music-neutral-700 font-body mb-4 line-clamp-2 leading-relaxed ${featured ? 'text-base' : 'text-sm'}`}>
          {event.description}
        </p>

        {/* Event Metadata */}
        <div className="flex items-center justify-between text-xs text-music-neutral-600 mb-3">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{formatEventDate(event.date)}</span>
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{formatEventTime(event.time)}</span>
            </div>
            <GenreBadge genre={event.genre} />
          </div>
        </div>

        {/* Venue and Artist Info */}
        <div className="flex items-center justify-between pt-3 border-t border-music-neutral-200">
          <div className="flex-1">
            {/* Venue Info */}
            <div className="flex items-center text-xs text-music-neutral-600 font-body mb-1">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{event.venue.name}</span>
            </div>
            
            {/* Artist Info */}
            <div className="flex items-center text-xs text-music-neutral-600 font-body">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>
                {primaryArtist.name}
                {additionalArtistCount > 0 && (
                  <span className="text-music-neutral-500">
                    {` + ${additionalArtistCount} more`}
                  </span>
                )}
              </span>
            </div>
          </div>
          
          {/* Price */}
          {event.price && (
            <PriceBadge price={event.price} />
          )}
        </div>

        {/* Tags (for featured cards) */}
        {featured && event.tags.slice(0, 3).length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {event.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-music-purple-100 text-music-purple-700 rounded-full text-xs font-medium"
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