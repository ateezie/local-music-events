'use client'

import Image from 'next/image'
import { useState } from 'react'

interface MusicLogoProps {
  size?: 'small' | 'medium' | 'large'
  className?: string
}

export default function MusicLogo({ size = 'medium', className = '' }: MusicLogoProps) {
  const [hasError, setHasError] = useState(false)
  
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  }

  const sizePixels = {
    small: 32,
    medium: 48,
    large: 64
  }

  // Fallback placeholder logo
  const PlaceholderLogo = () => (
    <div className="w-full h-full rounded-full bg-gradient-to-br from-music-blue-600 to-music-blue-800 border-2 border-music-yellow-500 flex items-center justify-center shadow-lg">
      <span className="text-music-yellow-500 font-bold text-xl">🎵</span>
    </div>
  )

  // Try to load your uploaded logo first, fallback to placeholder
  if (hasError) {
    return (
      <div className={`${sizeClasses[size]} ${className}`}>
        <PlaceholderLogo />
      </div>
    )
  }

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      {/* Your logo - will automatically use your uploaded file */}
      <Image
        src="/images/logo/music-note.svg"
        alt="Local Music Events"
        width={sizePixels[size]}
        height={sizePixels[size]}
        className="w-full h-full object-contain"
        onError={() => setHasError(true)}
        priority={size === 'medium'} // Prioritize header logo
      />
    </div>
  )
}

// Alternative SVG version for when you upload your logo
export function MusicLogoSVG({ size = 'medium', className = '' }: MusicLogoProps) {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12', 
    large: 'w-16 h-16'
  }

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      {/* This is where your actual logo will go */}
      {/* Replace with: <Image src="/logo.svg" alt="Local Music Events" width={48} height={48} /> */}
      
      {/* Placeholder SVG logo */}
      <svg viewBox="0 0 48 48" className="w-full h-full">
        <defs>
          <linearGradient id="musicLogoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b4aff" />
            <stop offset="100%" stopColor="#6d28d9" />
          </linearGradient>
        </defs>
        <circle 
          cx="24" 
          cy="24" 
          r="22" 
          fill="url(#musicLogoGradient)"
          stroke="#2d1b69"
          strokeWidth="2"
        />
        <text 
          x="24" 
          y="30" 
          textAnchor="middle" 
          fontSize="20"
          fill="white"
        >
          🎵
        </text>
      </svg>
    </div>
  )
}