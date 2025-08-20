'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import SearchBar from './SearchBar'
import MusicLogo from './MusicLogo'

interface NavItemProps {
  href: string
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

function NavItem({ href, children, className = '', onClick }: NavItemProps) {
  return (
    <Link
      href={href}
      className={`nav-link ${className}`}
      onClick={onClick}
    >
      {children}
    </Link>
  )
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileSearchQuery, setMobileSearchQuery] = useState('')
  const router = useRouter()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const toggleMobileSearch = () => {
    setIsMobileSearchOpen(!isMobileSearchOpen)
  }

  const closeMobileSearch = () => {
    setIsMobileSearchOpen(false)
    setMobileSearchQuery('')
  }

  const handleMobileSearch = (query: string) => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
      closeMobileSearch()
    }
  }

  const handleSearch = (query: string) => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
      setSearchQuery('')
    }
  }

  const navItems = [
    { href: '/events', label: 'Events' },
    { href: '/venues', label: 'Venues' },
    { href: '/promoters', label: 'Promoters' },
    { href: '/artists', label: 'Artists' },
    { href: '/calendar', label: 'Calendar' },
  ]

  return (
    <header className="bg-black text-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              {/* Music Events Logo */}
              <div className="w-10 h-10 sm:w-14 sm:h-14 bg-resolution-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                </svg>
              </div>
              <h1 className="text-xl sm:text-2xl font-heading font-bold text-white">
                Local Music Events
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <NavItem key={item.href} href={item.href}>
                {item.label}
              </NavItem>
            ))}
          </nav>

          {/* Desktop Search & Profile */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="w-64">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                onSubmit={handleSearch}
                placeholder="Search"
              />
            </div>
            <button 
              className="text-gray-300 hover:text-white transition-colors duration-200 p-2"
              aria-label="User profile"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <button 
              className="text-gray-300 hover:text-white transition-colors duration-200 p-2"
              aria-label="Search"
              onClick={toggleMobileSearch}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <button
              className="text-gray-300 hover:text-white transition-colors duration-200 p-2"
              onClick={toggleMenu}
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Interface */}
        {isMobileSearchOpen && (
          <div className="md:hidden border-t border-gray-700 bg-black animate-fade-in">
            <div className="px-4 py-4">
              <div className="flex items-center space-x-2">
                <div className="flex-1">
                  <SearchBar
                    value={mobileSearchQuery}
                    onChange={setMobileSearchQuery}
                    onSubmit={handleMobileSearch}
                    placeholder="Search"
                    autoFocus
                  />
                </div>
                <button
                  onClick={closeMobileSearch}
                  className="text-gray-300 hover:text-white transition-colors duration-200 p-2"
                  aria-label="Close search"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-700 py-4 animate-fade-in bg-gray-900">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <NavItem 
                  key={item.href} 
                  href={item.href}
                  onClick={closeMenu}
                  className="block px-4 py-2 text-base"
                >
                  {item.label}
                </NavItem>
              ))}
              <div className="px-4 py-2">
                <SearchBar
                  value={searchQuery}
                  onChange={setSearchQuery}
                  onSubmit={(query) => {
                    handleSearch(query)
                    closeMenu()
                  }}
                  placeholder="Search"
                />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}