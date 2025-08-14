'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Event } from '@/types'

export default function RelumeDemo() {
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([])
  const [allEvents, setAllEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('view-all')
  
  // Get the hero event (event with hero: true), fallback to first featured event
  const heroFeaturedEvent = [...featuredEvents, ...allEvents].find(event => event.hero) || featuredEvents[0] || allEvents[0]

  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = async () => {
    try {
      let combinedEvents: Event[] = []
      
      // Load JSON events
      try {
        const jsonResponse = await fetch('/api/events/json')
        if (jsonResponse.ok) {
          const jsonData = await jsonResponse.json()
          const jsonEvents = (jsonData.events || []).map((event: any) => ({
            ...event,
            _source: 'json'
          }))
          combinedEvents.push(...jsonEvents)
        }
      } catch (error) {
        console.error('Error loading JSON events:', error)
      }
      
      // Load database events  
      try {
        const dbResponse = await fetch('/api/events?limit=100')
        if (dbResponse.ok) {
          const dbData = await dbResponse.json()
          const dbEvents = (dbData.events || []).map((event: any) => ({
            ...event,
            _source: 'database'
          }))
          combinedEvents.push(...dbEvents)
        }
      } catch (error) {
        console.error('Error loading database events:', error)
      }
      
      // Sort events by date
      combinedEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      
      // Separate featured and all events
      const featured = combinedEvents.filter(event => event.featured)
      
      setFeaturedEvents(featured)
      setAllEvents(combinedEvents)
      setLoading(false)
    } catch (error) {
      console.error('Error loading events:', error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-scheme-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-scheme-accent mx-auto mb-4"></div>
          <p className="text-scheme-text-muted">Loading events...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white">
      {/* Header Navigation - Matching Relume Design */}
      <section className="flex w-full items-center bg-black text-white lg:min-h-18 lg:px-[5%]">
        <div className="mx-auto size-full lg:grid lg:grid-cols-[0.375fr_1fr_0.375fr] lg:items-center lg:justify-between lg:gap-4">
          <div className="flex min-h-16 items-center justify-between px-[5%] md:min-h-18 lg:min-h-full lg:px-0">
            <Link href="/" className="text-white font-bold text-lg">
              Logo
            </Link>
            <div className="hidden lg:flex items-center justify-center space-x-8">
              <Link href="/events" className="text-white hover:text-gray-300 transition-colors font-medium">Events Calendar</Link>
              <Link href="/artists" className="text-white hover:text-gray-300 transition-colors font-medium">Artist Spotlight</Link>
              <Link href="/venues" className="text-white hover:text-gray-300 transition-colors font-medium">Venue Guide</Link>
              <div className="relative group">
                <button className="text-white hover:text-gray-300 transition-colors font-medium flex items-center">
                  Get Involved
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/admin" className="hidden lg:inline-flex bg-white text-black px-4 py-2 rounded font-medium hover:bg-gray-100 transition-colors">
                Join
              </Link>
              <button className="lg:hidden flex items-center justify-center w-10 h-10">
                <span className="sr-only">Menu</span>
                <div className="space-y-1">
                  <div className="w-5 h-0.5 bg-white"></div>
                  <div className="w-5 h-0.5 bg-white"></div>
                  <div className="w-5 h-0.5 bg-white"></div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Section - Matching Relume Blue Design */}
      <section className="bg-blue-900 text-white px-[5%] py-16 md:py-24 lg:py-28">
        <div className="container">
          <div className="grid grid-cols-1 gap-x-20 gap-y-12 md:gap-y-16 lg:grid-cols-2 lg:items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 uppercase tracking-tight">
                DISCOVER THE HOTTEST<br />
                DANCE EVENTS IN ST. LOUIS
              </h1>
              <p className="text-lg mb-8 text-blue-100 leading-relaxed">
                Get ready to dance! Explore our curated list of the latest and most popular dance music events happening right now in Saint Louis.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  href="/events" 
                  className="bg-white text-blue-900 px-6 py-3 rounded font-semibold hover:bg-gray-100 transition-colors"
                >
                  Explore
                </Link>
                <Link 
                  href="/venues" 
                  className="border border-white text-white px-6 py-3 rounded font-semibold hover:bg-white hover:text-blue-900 transition-colors"
                >
                  Learn More
                </Link>
              </div>
            </div>
            <div>
              <div className="rounded-lg overflow-hidden shadow-2xl">
                <img
                  src="/api/placeholder/600/400"
                  alt="Person working on laptop in stylish setting"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section - Light Gray Background */}
      <section className="px-[5%] py-16 md:py-24 lg:py-28 bg-gray-100">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-6 uppercase">
              EXPLORE THE BEST DANCE MUSIC EVENTS IN<br />
              SAINT LOUIS
            </h2>
            <p className="text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed">
              Dive into a vibrant world of dance music events tailored just for you. Our platform helps you discover the hottest parties and gigs happening in Saint Louis. Stay updated and never miss out on an unforgettable night!
            </p>
          </div>
          
          {/* Three Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mb-6">
                <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-black mb-4 uppercase">
                CONNECT WITH YOUR FAVOURITE DJS AND ARTISTS
              </h3>
              <p className="text-gray-700 mb-6">
                Get to know the talent behind the decks and their music.
              </p>
              <Link href="/artists" className="text-black font-semibold hover:underline flex items-center justify-center">
                Learn More
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            
            <div className="text-center">
              <div className="mb-6">
                <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-black mb-4 uppercase">
                JOIN A THRIVING COMMUNITY OF DANCE MUSIC LOVERS
              </h3>
              <p className="text-gray-700 mb-6">
                Become part of a passionate network that shares your love for dance music.
              </p>
              <Link href="/community" className="text-black font-semibold hover:underline flex items-center justify-center">
                Sign Up
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            
            <div className="text-center">
              <div className="mb-6">
                <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-black mb-4 uppercase">
                STAY INFORMED WITH THE LATEST DANCE MUSIC NEWS
              </h3>
              <p className="text-gray-700 mb-6">
                Get exclusive updates on events, new releases, and more.
              </p>
              <Link href="/news" className="text-black font-semibold hover:underline flex items-center justify-center">
                Subscribe
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Events Section - Dark Blue Background */}
      <section className="px-[5%] py-16 md:py-24 lg:py-28 bg-blue-900 text-white">
        <div className="container">
          <div className="text-center mb-12">
            <h4 className="text-blue-300 font-semibold mb-3">Vibe</h4>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 uppercase">EVENTS</h2>
            <p className="text-lg text-blue-100 max-w-3xl mx-auto">
              Discover the hottest upcoming dance music events happening in Saint Louis this February!
            </p>
          </div>
            
          {/* Tabs - Matching Relume Style */}
          <div className="flex justify-center mb-12">
            <div className="flex space-x-8">
              {[
                { id: 'view-all', label: 'View all' },
                { id: 'house', label: 'House Beats' },
                { id: 'techno', label: 'Techno Nights' },
                { id: 'dubstep', label: 'Live DJs' },
                { id: 'trance', label: 'Festival Fun' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 font-medium transition-all ${
                    activeTab === tab.id
                      ? 'text-white border-b-2 border-white'
                      : 'text-blue-300 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
              
          {/* Event Cards - Matching Relume Design */}
          <div className="space-y-6">
            {/* Event 1 - DJ Night Fever */}
            <div className="grid grid-cols-1 md:grid-cols-[200px_1fr_auto] gap-6 items-center border-t border-blue-700 pt-6">
              <div className="relative aspect-square w-full md:w-48">
                <img
                  src="/api/placeholder/200/200"
                  alt="DJ Night Fever Event"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Link href="/events/dj-night-fever">
                    <h3 className="text-2xl font-bold text-white hover:text-blue-300 transition-colors">
                      DJ NIGHT FEVER
                    </h3>
                  </Link>
                  <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Sold out
                  </span>
                </div>
                <div className="flex items-center text-blue-300 mb-3">
                  <span>Fri 09 Feb 2024</span>
                  <span className="mx-2">•</span>
                  <span>Downtown</span>
                </div>
                <p className="text-blue-100">
                  Join us for an unforgettable night with top DJs and vibrant dance music!
                </p>
              </div>
              <div>
                <button className="bg-white text-blue-900 px-6 py-2 rounded font-semibold hover:bg-gray-100 transition-colors">
                  Save my spot
                </button>
              </div>
            </div>

            {/* Event 2 - Rave Under Stars */}
            <div className="grid grid-cols-1 md:grid-cols-[200px_1fr_auto] gap-6 items-center border-t border-blue-700 pt-6">
              <div className="relative aspect-square w-full md:w-48">
                <img
                  src="/api/placeholder/200/200"
                  alt="Rave Under Stars Event"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Link href="/events/rave-under-stars">
                    <h3 className="text-2xl font-bold text-white hover:text-blue-300 transition-colors">
                      RAVE UNDER STARS
                    </h3>
                  </Link>
                </div>
                <div className="flex items-center text-blue-300 mb-3">
                  <span>Sat 10 Feb 2024</span>
                  <span className="mx-2">•</span>
                  <span>U City</span>
                </div>
                <p className="text-blue-100">
                  Experience a night filled with electrifying beats and an amazing crowd!
                </p>
              </div>
              <div>
                <button className="bg-white text-blue-900 px-6 py-2 rounded font-semibold hover:bg-gray-100 transition-colors">
                  Save my spot
                </button>
              </div>
            </div>

            {/* Event 3 - Sunday Chill Vibes */}
            <div className="grid grid-cols-1 md:grid-cols-[200px_1fr_auto] gap-6 items-center border-t border-blue-700 pt-6 border-b border-blue-700 pb-6">
              <div className="relative aspect-square w-full md:w-48">
                <img
                  src="/api/placeholder/200/200"
                  alt="Sunday Chill Vibes Event"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Link href="/events/sunday-chill-vibes">
                    <h3 className="text-2xl font-bold text-white hover:text-blue-300 transition-colors">
                      SUNDAY CHILL VIBES
                    </h3>
                  </Link>
                </div>
                <div className="flex items-center text-blue-300 mb-3">
                  <span>Sun 11 Feb 2024</span>
                  <span className="mx-2">•</span>
                  <span>Soulard</span>
                </div>
                <p className="text-blue-100">
                  Wind down your weekend with smooth tunes and great company!
                </p>
              </div>
              <div>
                <button className="bg-white text-blue-900 px-6 py-2 rounded font-semibold hover:bg-gray-100 transition-colors">
                  Save my spot
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Black Background Matching Relume */}
      <footer className="bg-black text-white px-[5%] py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            <div>
              <div className="text-white font-bold text-lg mb-6">Logo</div>
            </div>
            <div>
              <h4 className="font-bold mb-4">Event Listings</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/events" className="hover:text-white transition-colors">All Events</Link></li>
                <li><Link href="/events?genre=house" className="hover:text-white transition-colors">House</Link></li>
                <li><Link href="/events?genre=techno" className="hover:text-white transition-colors">Techno</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Get Involved</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/community" className="hover:text-white transition-colors">Community</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contact Us</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/contact" className="hover:text-white transition-colors">Get in Touch</Link></li>
                <li><Link href="/support" className="hover:text-white transition-colors">Support</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">About Us</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white transition-colors">Our Story</Link></li>
                <li><Link href="/team" className="hover:text-white transition-colors">Team</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2025 What's The Move? All rights reserved.
            </div>
            <div className="flex space-x-6">
              <div className="flex space-x-4">
                {/* Social Icons */}
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M20 10C20 4.477 15.523 0 10 0S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.017 0H7.98C3.578 0 0 3.578 0 7.98v4.04C0 16.422 3.578 20 7.98 20h4.036C16.422 20 20 16.422 20 12.02V7.98C20 3.578 16.422 0 12.018 0zM10 15c-2.761 0-5-2.239-5-5s2.239-5 5-5 5 2.239 5 5-2.239 5-5 5zm5.5-9.5c-.689 0-1.25-.561-1.25-1.25S14.811 3 15.5 3s1.25.561 1.25 1.25-.561 1.25-1.25 1.25z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
              <div className="flex space-x-6 text-gray-400 text-sm">
                <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                <Link href="/terms" className="hover:text-white transition-colors">Terms of Use</Link>
                <Link href="/cookies" className="hover:text-white transition-colors">Cookie Preferences</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Join Now CTA Button - Fixed Position */}
      <div className="fixed bottom-6 right-6">
        <Link href="/admin" className="bg-white text-black px-6 py-3 rounded-full font-semibold shadow-lg hover:bg-gray-100 transition-colors">
          Join Now
        </Link>
      </div>

      {/* Demo Notice - Top Banner */}
      <div className="fixed top-0 left-0 right-0 bg-blue-600 text-white py-2 text-center text-sm z-50">
        🎨 <strong>Relume Demo</strong> - Design matching your Relume.io mockup • 
        <Link href="/admin" className="underline ml-2 hover:no-underline">View Admin</Link> • 
        <Link href="/" className="underline ml-2 hover:no-underline">Original Site</Link>
      </div>
    </div>
  )
}