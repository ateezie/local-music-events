'use client'

import { useState, useRef, useEffect } from 'react'

interface PromoterMultiSelectProps {
  selectedPromoters: string[]
  availablePromoters: string[]
  onChange: (promoters: string[]) => void
  placeholder?: string
  className?: string
}

export default function PromoterMultiSelect({
  selectedPromoters,
  availablePromoters,
  onChange,
  placeholder = "Select promoters...",
  className = ""
}: PromoterMultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [newPromoter, setNewPromoter] = useState('')
  const [showAddNew, setShowAddNew] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setShowAddNew(false)
        setNewPromoter('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const togglePromoter = (promoter: string) => {
    if (selectedPromoters.includes(promoter)) {
      onChange(selectedPromoters.filter(p => p !== promoter))
    } else {
      onChange([...selectedPromoters, promoter])
    }
  }

  const addNewPromoter = () => {
    if (newPromoter.trim() && !availablePromoters.includes(newPromoter.trim())) {
      const updatedPromoters = [...selectedPromoters, newPromoter.trim()]
      onChange(updatedPromoters)
      setNewPromoter('')
      setShowAddNew(false)
      setIsOpen(false)
    }
  }

  const removePromoter = (promoter: string) => {
    onChange(selectedPromoters.filter(p => p !== promoter))
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Selected promoters display */}
      <div
        className="w-full min-h-[42px] px-3 py-2 border border-chang-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-music-purple-500 cursor-pointer bg-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedPromoters.length === 0 ? (
          <span className="text-chang-neutral-500">{placeholder}</span>
        ) : (
          <div className="flex flex-wrap gap-1">
            {selectedPromoters.map((promoter) => (
              <span
                key={promoter}
                className="inline-flex items-center px-2 py-1 bg-music-purple-100 text-music-purple-800 text-xs rounded-full"
              >
                {promoter}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    removePromoter(promoter)
                  }}
                  className="ml-1 text-music-purple-600 hover:text-music-purple-800"
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
            className={`w-4 h-4 text-chang-neutral-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
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
        <div className="absolute z-10 w-full mt-1 bg-white border border-chang-neutral-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {/* Available promoters */}
          {availablePromoters.map((promoter) => (
            <div
              key={promoter}
              className="flex items-center px-3 py-2 hover:bg-chang-neutral-50 cursor-pointer"
              onClick={() => togglePromoter(promoter)}
            >
              <input
                type="checkbox"
                checked={selectedPromoters.includes(promoter)}
                onChange={() => togglePromoter(promoter)}
                className="mr-2 rounded border-chang-neutral-300 text-music-purple-600 focus:ring-music-purple-500"
              />
              <span className="text-chang-brown-700">{promoter}</span>
            </div>
          ))}

          {/* Add new promoter section */}
          <div className="border-t border-chang-neutral-200">
            {!showAddNew ? (
              <button
                type="button"
                onClick={() => setShowAddNew(true)}
                className="w-full px-3 py-2 text-left text-music-purple-600 hover:bg-chang-neutral-50 text-sm"
              >
                + Add new promoter
              </button>
            ) : (
              <div className="px-3 py-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newPromoter}
                    onChange={(e) => setNewPromoter(e.target.value)}
                    placeholder="Enter promoter name"
                    className="flex-1 px-2 py-1 border border-chang-neutral-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-music-purple-500"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addNewPromoter()
                      }
                    }}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={addNewPromoter}
                    className="px-2 py-1 bg-music-purple-600 text-white rounded text-sm hover:bg-music-purple-700"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddNew(false)
                      setNewPromoter('')
                    }}
                    className="px-2 py-1 bg-chang-neutral-300 text-chang-neutral-700 rounded text-sm hover:bg-chang-neutral-400"
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