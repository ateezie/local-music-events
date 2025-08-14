/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './reulme/**/*.{js,jsx}', // Include Relume components
  ],
  theme: {
    extend: {
      colors: {
        // Relume-inspired scheme colors for music events
        'scheme': {
          'background': '#fafafa',      // Light background
          'surface': '#ffffff',        // Card/surface backgrounds
          'border': '#e5e7eb',         // Subtle borders
          'accent': '#3b82f6',         // Primary blue accent
          'accent-hover': '#2563eb',   // Darker blue for hovers
          'text': '#111827',           // Primary text
          'text-muted': '#6b7280',     // Secondary text
          'text-light': '#9ca3af',     // Light text
        },
        
        // Dark mode scheme
        'scheme-dark': {
          'background': '#0f172a',     // Dark background
          'surface': '#1e293b',        // Card/surface backgrounds
          'border': '#334155',         // Subtle borders
          'accent': '#60a5fa',         // Lighter blue for dark mode
          'accent-hover': '#3b82f6',   // Blue hover in dark mode
          'text': '#f1f5f9',           // Primary text
          'text-muted': '#cbd5e1',     // Secondary text
          'text-light': '#94a3b8',     // Light text
        },

        // Music-themed brand colors (updated)
        'music': {
          'primary': '#3b82f6',        // Blue primary
          'primary-dark': '#1e40af',   // Darker blue
          'secondary': '#8b5cf6',      // Purple secondary
          'accent': '#f59e0b',         // Amber accent
          'success': '#10b981',        // Green success
          'warning': '#f59e0b',        // Amber warning
          'danger': '#ef4444',         // Red danger
        },

        // Genre colors with better contrast
        'genre': {
          'house': '#f59e0b',          // Amber
          'drum-and-bass': '#3b82f6',  // Blue
          'ukg': '#ef4444',            // Red
          'dubstep': '#8b5cf6',        // Purple
          'trance': '#06b6d4',         // Cyan
          'techno': '#6366f1',         // Indigo
          'other': '#6b7280',          // Gray
        },

        // Professional Event Brand Colors (enhanced)
        'music-blue': {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',  // Better contrast for dark backgrounds
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },

        // Keep backward compatibility
        'music-purple': {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          950: '#2e1065',
        },

        // Chang's Cookbook compatibility (reduced importance)
        'chang-brown': {
          50: '#faf8f5',
          100: '#f4ede2',
          200: '#e8d5c4',
          300: '#d6b894',
          400: '#c49969',
          500: '#b8804a',
          600: '#aa6c3e',
          700: '#8d5735',
          800: '#724630',
          900: '#5e3a2a',
          950: '#321d15',
        },
        'chang-orange': {
          50: '#fff5f0',
          100: '#ffe8db',
          200: '#ffceb3',
          300: '#ffab80',
          400: '#ff9966',
          500: '#ff8247',
          600: '#e6824e',
          700: '#cc6633',
          800: '#b85a2b',
          900: '#a04d26',
        },
      },

      // Relume-inspired typography
      fontSize: {
        'heading-h1': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'heading-h2': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'heading-h3': ['2.5rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'heading-h4': ['2rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'heading-h5': ['1.5rem', { lineHeight: '1.3' }],
        'heading-h6': ['1.25rem', { lineHeight: '1.3' }],
        'text-large': ['1.125rem', { lineHeight: '1.6' }],
        'text-medium': ['1rem', { lineHeight: '1.6' }],
        'text-small': ['0.875rem', { lineHeight: '1.5' }],
        'text-xs': ['0.75rem', { lineHeight: '1.4' }],
      },

      // Relume-inspired spacing
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },

      // Enhanced border radius for modern look
      borderRadius: {
        'image': '0.75rem',
        'card': '1rem',
        'button': '0.5rem',
      },

      // Container improvements
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '1.5rem',
          md: '2rem',
          lg: '3rem',
          xl: '4rem',
        },
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
          '2xl': '1536px',
        },
      },

      // Animation improvements
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    // Add custom utilities for Relume-style classes
    function({ addUtilities, theme }) {
      const newUtilities = {
        // Heading utilities
        '.heading-h1': {
          fontSize: theme('fontSize.heading-h1[0]'),
          lineHeight: theme('fontSize.heading-h1[1].lineHeight'),
          letterSpacing: theme('fontSize.heading-h1[1].letterSpacing'),
          fontWeight: '700',
        },
        '.heading-h2': {
          fontSize: theme('fontSize.heading-h2[0]'),
          lineHeight: theme('fontSize.heading-h2[1].lineHeight'),
          letterSpacing: theme('fontSize.heading-h2[1].letterSpacing'),
          fontWeight: '700',
        },
        '.heading-h3': {
          fontSize: theme('fontSize.heading-h3[0]'),
          lineHeight: theme('fontSize.heading-h3[1].lineHeight'),
          letterSpacing: theme('fontSize.heading-h3[1].letterSpacing'),
          fontWeight: '600',
        },
        '.heading-h4': {
          fontSize: theme('fontSize.heading-h4[0]'),
          lineHeight: theme('fontSize.heading-h4[1].lineHeight'),
          letterSpacing: theme('fontSize.heading-h4[1].letterSpacing'),
          fontWeight: '600',
        },
        '.heading-h5': {
          fontSize: theme('fontSize.heading-h5[0]'),
          lineHeight: theme('fontSize.heading-h5[1].lineHeight'),
          fontWeight: '600',
        },
        '.heading-h6': {
          fontSize: theme('fontSize.heading-h6[0]'),
          lineHeight: theme('fontSize.heading-h6[1].lineHeight'),
          fontWeight: '600',
        },
        // Text utilities
        '.text-large': {
          fontSize: theme('fontSize.text-large[0]'),
          lineHeight: theme('fontSize.text-large[1].lineHeight'),
        },
        '.text-medium': {
          fontSize: theme('fontSize.text-medium[0]'),
          lineHeight: theme('fontSize.text-medium[1].lineHeight'),
        },
        '.text-small': {
          fontSize: theme('fontSize.text-small[0]'),
          lineHeight: theme('fontSize.text-small[1].lineHeight'),
        },
      }
      
      addUtilities(newUtilities)
    }
  ],
}