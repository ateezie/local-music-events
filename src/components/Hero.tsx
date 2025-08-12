import Link from 'next/link'
import Image from 'next/image'
import { Event } from '@/types'

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
  const eventLink = featuredEvent ? `/events/${featuredEvent.id}` : "/events"
  return (
    <section className={`relative bg-gradient-to-r from-music-purple-50 to-music-purple-100 overflow-hidden ${className}`}>
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
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-music-purple-950 leading-tight mb-6">
              {title}
              <span className="text-music-purple-600 block">{subtitle}</span>
              <span className="text-music-blue-600">Near You</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-music-neutral-700 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
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

            {/* Stats */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-8 mt-12 text-music-neutral-700">
              <div className="text-center lg:text-left">
                <div className="text-2xl sm:text-3xl font-bold text-music-purple-600">50+</div>
                <div className="text-sm">Live Events</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl sm:text-3xl font-bold text-music-purple-600">25+</div>
                <div className="text-sm">Local Venues</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl sm:text-3xl font-bold text-music-purple-600">100+</div>
                <div className="text-sm">Artists Featured</div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative animate-slide-up">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={heroImage}
                alt={featuredEvent ? `${eventName} - Featured Event` : "Live music concert"}
                width={600}
                height={400}
                className="w-full h-auto object-cover aspect-video"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
              />
              
              {/* Image Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
              
              {/* Floating Event Card */}
              <div className="absolute bottom-4 left-4 right-4 lg:bottom-6 lg:left-6 lg:right-6">
                <Link href={eventLink} className="block">
                  <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg hover:bg-white/95 transition-colors duration-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-heading font-semibold text-music-purple-950 text-sm lg:text-base">
                          Featured Event
                        </h3>
                        <p className="text-music-neutral-700 text-xs lg:text-sm font-body">
                          {eventName}
                        </p>
                        {featuredEvent && (
                          <p className="text-music-purple-600 text-xs font-body mt-1">
                            {new Date(featuredEvent.date).toLocaleDateString()} • {eventVenue}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center text-music-accent-500">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="ml-1 text-xs lg:text-sm font-medium text-music-purple-950">
                          {featuredEvent?.genre || 'Live Music'}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-music-purple-200 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-music-blue-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
          </div>
        </div>
      </div>

      {/* Wave Separator */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg className="w-full h-8 sm:h-12" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path 
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
            opacity=".25" 
            className="fill-white"
          />
          <path 
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" 
            opacity=".5" 
            className="fill-white"
          />
          <path 
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" 
            className="fill-white"
          />
        </svg>
      </div>
    </section>
  )
}