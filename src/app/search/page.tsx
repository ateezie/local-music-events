'use client'

import { useState, useEffect, useMemo, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Layout from '@/components/Layout'
import EventCard from '@/components/EventCard'
import SearchBar from '@/components/SearchBar'
// import CategoryFilter from '@/components/CategoryFilter' // Not used for events yet
import { RecipeGridSkeleton } from '@/components/Loading'
import { searchEvents, getAllGenres } from '@/lib/events'
import { Event } from '@/types'

const RESULTS_PER_PAGE = 12

function SearchContent() {
  const searchParams = useSearchParams()
  // const router = useRouter() // Currently unused
  const [loading, setLoading] = useState(true)
  const [searchResults, setSearchResults] = useState<Event[]>([])
  const [displayedResults, setDisplayedResults] = useState<Event[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  
  // Filter state
  const [selectedGenre, setSelectedGenre] = useState('all')

  // Initialize search from URL params
  useEffect(() => {
    const query = searchParams.get('q') || ''
    setSearchQuery(query)
    setLoading(false)
  }, [searchParams])

  // Get search results
  useEffect(() => {
    if (searchQuery.trim()) {
      const results = searchEvents(searchQuery)
      setSearchResults(results)
    } else {
      setSearchResults([])
    }
    setCurrentPage(1) // Reset to first page on new search
  }, [searchQuery])

  // Get filtered results
  const filteredResults = useMemo(() => {
    if (selectedGenre === 'all') {
      return searchResults
    }
    return searchResults.filter(event => event.genre === selectedGenre)
  }, [searchResults, selectedGenre])

  // Pagination
  const totalResults = filteredResults.length
  const totalPages = Math.ceil(totalResults / RESULTS_PER_PAGE)
  
  useEffect(() => {
    const startIndex = (currentPage - 1) * RESULTS_PER_PAGE
    const endIndex = startIndex + RESULTS_PER_PAGE
    setDisplayedResults(filteredResults.slice(startIndex, endIndex))
  }, [filteredResults, currentPage])

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedGenre])

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    
    // Update URL without page refresh
    if (query.trim()) {
      window.history.pushState(null, '', `/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  // Handle filter changes
  const handleGenreChange = (genreId: string) => {
    setSelectedGenre(genreId)
  }

  // Clear all filters
  const clearFilters = () => {
    setSelectedGenre('all')
  }

  // Load more results
  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1)
    }
  }

  const genres = getAllGenres()
  const hasActiveFilters = selectedGenre !== 'all'
  const hasResults = searchResults.length > 0
  const hasQuery = searchQuery.trim().length > 0

  if (loading) {
    return (
      <Layout>
        <div className="section-container">
          <div className="content-container">
            <div className="max-w-2xl mx-auto mb-8">
              <div className="h-12 bg-music-neutral-200 rounded animate-pulse"></div>
            </div>
            <RecipeGridSkeleton count={8} />
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      {/* Search Header */}
      <div className="gradient-music-warm py-16">
        <div className="content-container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-heading font-bold text-music-purple-900 mb-8">
              Search Events
            </h1>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                onSubmit={handleSearch}
                placeholder="Search by event name, venue, or artist..."
                className="w-full"
              />
            </div>

            {/* Search Results Info */}
            {hasQuery && (
              <div className="text-lg font-body text-music-neutral-700">
                {hasResults ? (
                  <>
                    Found <span className="font-semibold text-music-purple-900">{totalResults}</span> event{totalResults !== 1 ? 's' : ''} 
                    for &quot;<span className="font-semibold text-music-purple-900">{searchQuery}</span>&quot;
                  </>
                ) : (
                  <>
                    No events found for &quot;<span className="font-semibold text-music-purple-900">{searchQuery}</span>&quot;
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="section-container">
        <div className="content-container">
          {/* No search query */}
          {!hasQuery && (
            <div className="text-center py-12">
              <div className="text-6xl mb-6">🔍</div>
              <h2 className="text-2xl font-heading font-bold text-music-purple-900 mb-4">
                What music are you in the mood for?
              </h2>
              <p className="text-lg font-body text-music-neutral-700 mb-8">
                Search for events by name, venue, artist, or genre
              </p>
              
              {/* Popular Searches */}
              <div className="max-w-2xl mx-auto">
                <h3 className="text-lg font-heading font-semibold text-music-purple-900 mb-4">Popular Searches</h3>
                <div className="flex flex-wrap gap-2 justify-center">
                  {['rock', 'jazz', 'electronic', 'acoustic', 'indie', 'punk', 'hip-hop'].map((genre) => (
                    <button
                      key={genre}
                      onClick={() => handleSearch(genre)}
                      className="px-4 py-2 bg-music-purple-100 text-music-purple-700 rounded-full text-sm font-body font-medium hover:bg-music-purple-200 transition-colors duration-200"
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Search Results */}
          {hasQuery && (
            <>
              {/* Genre Filter - only show if there are results */}
              {hasResults && (
                <div className="mb-8">
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => handleGenreChange('all')}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                        selectedGenre === 'all'
                          ? 'bg-music-purple-600 text-white shadow-md'
                          : 'bg-music-neutral-200 text-music-neutral-700 hover:bg-music-neutral-300'
                      }`}
                    >
                      All Genres ({searchResults.length})
                    </button>
                    {genres.map((genre) => {
                      const genreCount = searchResults.filter(event => event.genre === genre.id).length
                      return genreCount > 0 ? (
                        <button
                          key={genre.id}
                          onClick={() => handleGenreChange(genre.id)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                            selectedGenre === genre.id
                              ? 'bg-music-purple-600 text-white shadow-md'
                              : 'bg-music-neutral-200 text-music-neutral-700 hover:bg-music-neutral-300'
                          }`}
                        >
                          {genre.name} ({genreCount})
                        </button>
                      ) : null
                    })}
                    {hasActiveFilters && (
                      <button
                        onClick={clearFilters}
                        className="text-music-purple-400 hover:text-music-purple-600 font-body font-medium text-sm"
                      >
                        Clear filters
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Results */}
              {displayedResults.length === 0 && hasResults === false ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">😔</div>
                  <h3 className="text-2xl font-heading font-bold text-music-purple-900 mb-2">No events found</h3>
                  <p className="text-music-neutral-700 font-body mb-6">
                    Try searching for different genres, venues, or artist names.
                  </p>
                  
                  {/* Search Suggestions */}
                  <div className="max-w-md mx-auto">
                    <h4 className="font-heading font-semibold text-music-purple-900 mb-4">Try searching for:</h4>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {['rock', 'jazz', 'electronic', 'acoustic', 'live music'].map((suggestion) => (
                        <button
                          key={suggestion}
                          onClick={() => handleSearch(suggestion)}
                          className="px-3 py-1 bg-music-neutral-200 text-music-neutral-800 font-body rounded-full text-sm hover:bg-music-neutral-300 transition-colors duration-200"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : displayedResults.length === 0 && hasActiveFilters ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-2xl font-heading font-bold text-music-purple-900 mb-2">No events match your filters</h3>
                  <p className="text-music-neutral-700 font-body mb-6">
                    Try adjusting your filters to see more results.
                  </p>
                  <button
                    onClick={clearFilters}
                    className="btn-primary"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : displayedResults.length > 0 ? (
                <>
                  {/* Results Count */}
                  <div className="flex justify-between items-center mb-6">
                    <p className="text-music-neutral-700 font-body">
                      Showing {displayedResults.length} of {totalResults} results
                    </p>
                  </div>

                  {/* Event Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {displayedResults.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-12 text-center">
                      {currentPage < totalPages && (
                        <button
                          onClick={handleLoadMore}
                          className="btn-primary mr-4"
                        >
                          Load More Results
                        </button>
                      )}
                      <p className="text-music-neutral-700 font-body mt-4">
                        Page {currentPage} of {totalPages}
                      </p>
                    </div>
                  )}
                </>
              ) : null}
            </>
          )}

          {/* Popular Genres for empty search */}
          {!hasQuery && (
            <div className="mt-16">
              <h2 className="text-2xl font-heading font-bold text-music-purple-900 mb-8 text-center">
                Browse by Genre
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {genres.slice(0, 8).map((genre) => (
                  <Link
                    key={genre.id}
                    href={`/events?genre=${genre.id}`}
                    className="feature-card group hover:scale-105 transform transition-all duration-200 hover:shadow-lg text-center"
                  >
                    <div 
                      className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center text-white font-bold text-xl group-hover:scale-110 transition-transform duration-200"
                      style={{ backgroundColor: genre.color }}
                    >
                      🎵
                    </div>
                    <h3 className="font-heading font-semibold text-music-purple-900 group-hover:text-music-purple-400 transition-colors duration-200">
                      {genre.name}
                    </h3>
                    <p className="text-music-neutral-600 font-body text-sm mt-1">
                      {genre.count} events
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<RecipeGridSkeleton count={8} />}>
      <SearchContent />
    </Suspense>
  )
}