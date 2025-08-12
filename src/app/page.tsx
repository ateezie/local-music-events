import Link from 'next/link'
import Layout from '@/components/Layout'
import Hero from '@/components/Hero'
import EventCard from '@/components/EventCard'
// import EventFilter from '@/components/EventFilter' // Currently unused
import { getAllGenres, getFeaturedEvents, getAllEvents, getEventStats } from '@/lib/events'

export default function HomePage() {
  const genres = getAllGenres()
  const featuredEvents = getFeaturedEvents().slice(0, 4)
  const allEvents = getAllEvents().slice(0, 8)
  const stats = getEventStats()
  
  // Get the first featured event for the hero (or fallback to first event)
  const heroFeaturedEvent = featuredEvents[0] || allEvents[0]

  return (
    <Layout>
      {/* Hero Section */}
      <Hero featuredEvent={heroFeaturedEvent} />

      {/* Featured Events Section */}
      <section className="section-container bg-white">
        <div className="content-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-music-purple-950 mb-4">
              Featured Events
            </h2>
            <p className="text-lg font-body text-music-neutral-700 max-w-2xl mx-auto">
              Don&apos;t miss these hand-picked live music experiences happening in your city this week.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {featuredEvents.map((event) => (
              <EventCard key={event.id} event={event} featured />
            ))}
          </div>

          <div className="text-center">
            <Link 
              href="/events?featured=true"
              className="btn-primary inline-flex items-center"
            >
              View All Featured Events
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Genres Section */}
      <section className="section-container bg-music-neutral-100">
        <div className="content-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-music-purple-950 mb-4">
              Browse by Genre
            </h2>
            <p className="text-lg font-body text-music-neutral-700 max-w-2xl mx-auto">
              Discover live music events that match your taste. From indie rock to jazz, electronic to acoustic.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
            {genres.slice(0, 8).map((genre) => (
              <Link
                key={genre.id}
                href={`/events?genre=${genre.id}`}
                className="feature-card group hover:scale-105 transform transition-all duration-200 hover:shadow-lg"
              >
                <div 
                  className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center text-white font-bold text-xl group-hover:scale-110 transition-transform duration-200"
                  style={{ backgroundColor: genre.color }}
                >
                  🎵
                </div>
                <h3 className="text-lg font-heading font-semibold text-music-purple-950 mb-2 group-hover:text-music-purple-600 transition-colors duration-200">
                  {genre.name}
                </h3>
                <p className="text-music-neutral-700 font-body text-sm mb-3">
                  {genre.description}
                </p>
                <span className="text-music-purple-600 font-medium text-sm">
                  {genre.count} events →
                </span>
              </Link>
            ))}
          </div>

          <div className="text-center">
            <Link 
              href="/events"
              className="btn-secondary inline-flex items-center"
            >
              View All Events
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Today's Events Section */}
      <section className="section-container bg-white">
        <div className="content-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-music-purple-950 mb-4">
              Happening Today
            </h2>
            <p className="text-lg font-body text-music-neutral-700 max-w-2xl mx-auto">
              Don&apos;t miss out! These live music events are happening today in your area.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {allEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-container gradient-music-warm">
        <div className="content-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-music-purple-950 mb-4">
              Why Choose Local Music Events?
            </h2>
            <p className="text-lg font-body text-music-neutral-700 max-w-2xl mx-auto">
              We&apos;re passionate about connecting music lovers with amazing live experiences in their city.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="feature-card text-center group hover:scale-105 transform transition-all duration-200">
              <div className="w-16 h-16 mx-auto mb-6 bg-music-purple-600 text-white rounded-full flex items-center justify-center text-2xl group-hover:bg-music-purple-700 transition-colors duration-200 shadow-lg shadow-music-purple-600/20">
                🎯
              </div>
              <h3 className="text-xl font-heading font-semibold text-music-purple-950 mb-4">
                Curated Events
              </h3>
              <p className="text-music-neutral-700 font-body leading-relaxed">
                Every event is hand-picked by local music enthusiasts to ensure quality live music experiences.
              </p>
            </div>

            <div className="feature-card text-center group hover:scale-105 transform transition-all duration-200">
              <div className="w-16 h-16 mx-auto mb-6 bg-music-blue-600 text-white rounded-full flex items-center justify-center text-2xl group-hover:bg-music-blue-700 transition-colors duration-200 shadow-lg shadow-music-blue-600/20">
                📍
              </div>
              <h3 className="text-xl font-heading font-semibold text-music-purple-950 mb-4">
                Local Focus
              </h3>
              <p className="text-music-neutral-700 font-body leading-relaxed">
                Discover hidden gems and support local venues and artists in your community.
              </p>
            </div>

            <div className="feature-card text-center group hover:scale-105 transform transition-all duration-200">
              <div className="w-16 h-16 mx-auto mb-6 bg-music-accent-600 text-white rounded-full flex items-center justify-center text-2xl group-hover:bg-music-accent-700 transition-colors duration-200 shadow-lg shadow-music-accent-600/20">
                🎪
              </div>
              <h3 className="text-xl font-heading font-semibold text-music-purple-950 mb-4">
                All Genres
              </h3>
              <p className="text-music-neutral-700 font-body leading-relaxed">
                From intimate acoustic sets to high-energy electronic shows, we cover every musical taste.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white rounded-2xl shadow-lg shadow-music-purple-950/10 border border-music-neutral-100 p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-heading font-bold text-music-purple-600 mb-2">
                  {stats.totalEvents}+
                </div>
                <div className="text-music-neutral-700 font-body font-medium">Live Events</div>
              </div>
              <div>
                <div className="text-3xl font-heading font-bold text-music-blue-600 mb-2">
                  {stats.totalVenues}+
                </div>
                <div className="text-music-neutral-700 font-body font-medium">Local Venues</div>
              </div>
              <div>
                <div className="text-3xl font-heading font-bold text-music-accent-600 mb-2">
                  {stats.totalArtists}+
                </div>
                <div className="text-music-neutral-700 font-body font-medium">Featured Artists</div>
              </div>
              <div>
                <div className="text-3xl font-heading font-bold text-music-purple-700 mb-2">
                  {stats.upcomingEvents}
                </div>
                <div className="text-music-neutral-700 font-body font-medium">This Week</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="section-container bg-music-purple-950 text-white">
        <div className="content-container">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold mb-4">
              Never Miss a Beat
            </h2>
            <p className="text-xl font-body text-music-neutral-200 mb-8">
              Subscribe to our newsletter and get the latest events, artist spotlights, and exclusive concert alerts delivered to your inbox.
            </p>
            
            <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-6 py-3 rounded-lg border-0 text-music-purple-950 font-body placeholder-music-neutral-500 focus:outline-none focus:ring-2 focus:ring-music-purple-400"
              />
              <button className="btn-primary whitespace-nowrap">
                Subscribe Now
              </button>
            </div>
            
            <p className="text-music-neutral-400 font-body text-sm mt-4">
              Join 5,000+ music lovers. No spam, unsubscribe anytime.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  )
}