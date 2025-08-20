'use client'

import { useState, useRef, useEffect } from 'react'

interface GenreMultiSelectProps {
  selectedGenres: string[]
  onChange: (genres: string[]) => void
  placeholder?: string
  className?: string
}

// Genre list matching artist form options
const AVAILABLE_GENRES = [
  'house',
  'techno',
  'trance',
  'drum-and-bass',
  'dubstep',
  'ukg', // UK Garage
  'hip-hop',
  'rock',
  'indie-rock',
  'jazz',
  'folk',
  'acoustic',
  'other'
]

export default function GenreMultiSelect({
  selectedGenres,
  onChange,
  placeholder = "Select genres...",
  className = ""
}: GenreMultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [newGenre, setNewGenre] = useState('')
  const [showAddNew, setShowAddNew] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setShowAddNew(false)
        setNewGenre('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleGenre = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      const newGenres = selectedGenres.filter(g => g !== genre)
      onChange(newGenres)
    } else {
      const newGenres = [...selectedGenres, genre]
      onChange(newGenres)
    }
  }

  const addNewGenre = () => {
    if (newGenre.trim() && !AVAILABLE_GENRES.includes(newGenre.trim().toLowerCase()) && !selectedGenres.includes(newGenre.trim().toLowerCase())) {
      const updatedGenres = [...selectedGenres, newGenre.trim().toLowerCase()]
      onChange(updatedGenres)
      setNewGenre('')
      setShowAddNew(false)
      setIsOpen(false)
    }
  }

  const removeGenre = (genre: string) => {
    onChange(selectedGenres.filter(g => g !== genre))
  }

  const formatGenreName = (genre: string) => {
    if (genre === 'ukg') return 'UK Garage'
    if (genre === 'drum-and-bass') return 'Drum & Bass'
    if (genre === 'hip-hop') return 'Hip-Hop'
    if (genre === 'indie-rock') return 'Indie Rock'
    return genre.charAt(0).toUpperCase() + genre.slice(1)
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Selected genres display */}
      <div
        className="w-full min-h-[42px] px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-music-purple-500 cursor-pointer bg-gray-700 text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedGenres.length === 0 ? (
          <span className="text-gray-400">{placeholder}</span>
        ) : (
          <div className="flex flex-wrap gap-1">
            {selectedGenres.map((genre) => (
              <span
                key={genre}
                className="inline-flex items-center px-2 py-1 bg-music-purple-600 text-white text-xs rounded-full"
              >
                {formatGenreName(genre)}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeGenre(genre)
                  }}
                  className="ml-1 text-white hover:text-gray-200"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
        {/* Dropdown arrow */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {/* Available genres */}
          {AVAILABLE_GENRES.map((genre) => (
            <div
              key={genre}
              className="flex items-center px-3 py-2 hover:bg-gray-700 cursor-pointer"
              onClick={() => toggleGenre(genre)}
            >
              <input
                type="checkbox"
                checked={selectedGenres.includes(genre)}
                readOnly
                className="mr-2 rounded border-gray-600 text-music-purple-600 focus:ring-music-purple-500 bg-gray-700"
              />
              <span className="text-white">{formatGenreName(genre)}</span>
            </div>
          ))}

          {/* Add new genre section */}
          <div className="border-t border-gray-600">
            {!showAddNew ? (
              <button
                type="button"
                onClick={() => setShowAddNew(true)}
                className="w-full px-3 py-2 text-left text-music-purple-400 hover:bg-gray-700 text-sm"
              >
                + Add new genre
              </button>
            ) : (
              <div className="px-3 py-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newGenre}
                    onChange={(e) => setNewGenre(e.target.value)}
                    placeholder="Enter genre name"
                    className="flex-1 px-2 py-1 border border-gray-600 rounded text-sm focus:outline-none focus:ring-1 focus:ring-music-purple-500 bg-gray-700 text-white"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addNewGenre()
                      }
                    }}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={addNewGenre}
                    className="px-2 py-1 bg-music-purple-600 text-white rounded text-sm hover:bg-music-purple-700"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddNew(false)
                      setNewGenre('')
                    }}
                    className="px-2 py-1 bg-gray-600 text-gray-300 rounded text-sm hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}