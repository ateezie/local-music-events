import Link from 'next/link'
import { Event } from '@/types'
import EventImage from './EventImage'
import { formatEventDateShort } from '@/lib/dateUtils'

interface HeroProps {
  title?: string
  subtitle?: string
  description?: string
  primaryButtonText?: string
  primaryButtonHref?: string
  secondaryButtonText?: string
  secondaryButtonHref?: string
  backgroundImage?: string
  className?: string
  featuredEvent?: Event
}

export default function Hero({
  title = "Discover Live",
  subtitle = "Music Events",
  description = "From intimate acoustic sets to massive festivals, find your next favorite live music experience in your city.",
  primaryButtonText = "Find Events",
  primaryButtonHref = "/events",
  secondaryButtonText = "Browse Venues",
  secondaryButtonHref = "/venues",
  backgroundImage = "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&q=80",
  className = "",
  featuredEvent
}: HeroProps) {
  
  // Use featured event data if provided
  const heroImage = featuredEvent?.flyer || backgroundImage
  const eventName = featuredEvent?.title || "Featured Event"
  const eventVenue = featuredEvent?.venue?.name || "Local Venue"
  const eventLink = featuredEvent 
    ? (featuredEvent.slug ? `/events/${featuredEvent.slug}` : `/events/${featuredEvent.id}`)
    : "/events"
  return (
    <section className={`relative bg-prussian-900 overflow-hidden ${className}`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
          <defs>
            <pattern id="hero-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="currentColor" />
              <circle cx="12" cy="12" r="1" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-pattern)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <div className="text-center lg:text-left animate-fade-in">
            <h1 className="heading-h1 text-white mb-6">
              {title}
              <span className="block">{subtitle}</span>
              <span className="text-sun-400">Near You</span>
            </h1>
            
            <p className="text-medium text-neutral-300 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              {description}
            </p>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link 
                href={primaryButtonHref}
                className="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center group"
              >
                {primaryButtonText}
                <svg 
                  className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              
              <Link 
                href={secondaryButtonHref}
                className="btn-secondary text-lg px-8 py-4 inline-flex items-center justify-center"
              >
                {secondaryButtonText}
              </Link>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative animate-slide-up">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <EventImage
                src={heroImage}
                alt={featuredEvent ? `${eventName} - Featured Event` : "Live music concert"}
                width={600}
                height={400}
                className="w-full h-auto object-cover aspect-video"
                category={featuredEvent?.category || 'concert'}
                genre={featuredEvent?.genre || 'indie-rock'}
              />
              
              {/* Image Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
              
              {/* Floating Event Card */}
              <div className="absolute bottom-4 left-4 right-4 lg:bottom-6 lg:left-6 lg:right-6">
                <Link href={eventLink} className="block">
                  <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg hover:bg-white/95 transition-colors duration-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-heading font-semibold text-neutral-900" style={{ fontSize: '1.4rem' }}>
                          Featured Event
                        </h3>
                        <p className="text-neutral-700 text-xs lg:text-sm font-body">
                          {eventName}
                        </p>
                        {featuredEvent && (
                          <p className="text-resolution-600 text-xs font-body mt-1">
                            {formatEventDateShort(featuredEvent.date)} • {eventVenue}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>

    </section>
  )
}