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
        // New design system colors
        'primary': {
          50: '#f0f9ff',
          100: '#e0f2fe', 
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',  // Main primary
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },

        // Prussian Blue palette (from Variables.png)
        'prussian': {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd', 
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',  // Primary Prussian Blue
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',  // Darker Prussian
          950: '#082f49',
        },

        // Resolution Blue palette (from Variables.png) 
        'resolution': {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',  // Main Resolution Blue
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },

        // Neutrals (from Variables.png)
        'neutral': {
          50: '#ffffff',   // Pure white
          100: '#f8f9fa',  // Lightest gray
          200: '#f1f3f4',  // Light gray
          300: '#e8eaed',  // Border gray
          400: '#9aa0a6',  // Medium gray
          500: '#5f6368',  // Text gray
          600: '#3c4043',  // Dark gray
          700: '#202124',  // Very dark gray
          800: '#111827',  // Near black
          900: '#000000',  // Pure black
        },

        // Sun palette (from Variables.png) - for accents
        'sun': {
          50: '#fffdf7',
          100: '#fffbeb',
          200: '#fef3c7',
          300: '#fde68a',
          400: '#fcd34d',  // Main sun yellow
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },

        // Cardinal palette (from Variables.png) - for errors/warnings
        'cardinal': {
          50: '#fff5f5',
          100: '#fed7d7',
          200: '#feb2b2', 
          300: '#fc8181',
          400: '#f56565',  // Main cardinal red
          500: '#e53e3e',
          600: '#c53030',
          700: '#9b2c2c',
          800: '#742a2a',
          900: '#553c3c',
        },
        
        // Dark scheme for ADMIN pages (keep current)
        'admin': {
          'background': '#111827',     // Dark background (gray-900)
          'surface': '#1f2937',        // Card backgrounds (gray-800)
          'border': '#374151',         // Borders (gray-700)
          'accent': '#60a5fa',         // Light blue for good contrast
          'accent-hover': '#3b82f6',   // Blue hover
          'text': '#f9fafb',           // Primary text (white)
          'text-muted': '#d1d5db',     // Secondary text (gray-300)
          'text-light': '#9ca3af',     // Light text (gray-400)
        },

        // Enhanced music brand colors
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

        // Enhanced blue palette with better contrast
        'music-blue': {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',  // Improved contrast for dark backgrounds
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },

        // Enhanced purple palette
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

        // Music accent colors
        'music-accent': {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fed27a',
          300: '#fdb541',
          400: '#fd9e09',
          500: '#f59e0b',
          600: '#dc9006',
          700: '#b76e02',
          800: '#92550a',
          900: '#78460c',
        },

        // Neutral grays for flexibility
        'music-neutral': {
          50: '#ffffff',
          100: '#f9fafb',
          200: '#f3f4f6',
          300: '#e5e7eb',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
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

      // Typography system from design/Typography.png
      fontSize: {
        // Desktop heading sizes (Bebas Neue)
        'heading-h1-desktop': ['4.5rem', { lineHeight: '0.9' }],     // 72px
        'heading-h2-desktop': ['3.6875rem', { lineHeight: '1.2' }],  // 59px  
        'heading-h3-desktop': ['2.75rem', { lineHeight: '1.2' }],    // 44px
        'heading-h4-desktop': ['2.25rem', { lineHeight: '1.3' }],    // 36px
        'heading-h5-desktop': ['1.75rem', { lineHeight: '1' }],    // 28px
        'heading-h6-desktop': ['1.375rem', { lineHeight: '1.4' }],   // 22px
        
        // Mobile heading sizes (Bebas Neue)
        'heading-h1-mobile': ['2.75rem', { lineHeight: '0.9' }],     // 44px
        'heading-h2-mobile': ['2.5rem', { lineHeight: '1.2' }],      // 40px
        'heading-h3-mobile': ['2rem', { lineHeight: '1.2' }],        // 32px
        'heading-h4-mobile': ['1.5rem', { lineHeight: '1.3' }],      // 24px
        'heading-h5-mobile': ['1.25rem', { lineHeight: '1.4' }],     // 20px
        'heading-h6-mobile': ['1.125rem', { lineHeight: '1.4' }],    // 18px
        
        // Body text sizes (Montserrat)
        'text-large': ['1.375rem', { lineHeight: '1.5' }],           // 22px - Extra bold
        'text-medium': ['1.125rem', { lineHeight: '1.5' }],          // 18px - Bold  
        'text-regular': ['1rem', { lineHeight: '1.5' }],             // 16px - Regular
        'text-small': ['0.875rem', { lineHeight: '1.5' }],           // 14px - Small
        'text-tiny': ['0.75rem', { lineHeight: '1.5' }],             // 12px - Tiny
        'tagline': ['1rem', { lineHeight: '1.5' }],                  // 16px - Tagline
      },

      fontFamily: {
        'heading': ['Bebas Neue', 'Inter', 'system-ui', 'sans-serif'],
        'body': ['Montserrat', 'Inter', 'system-ui', 'sans-serif'],
        sans: ['Montserrat', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'serif'],
      },

      // Enhanced spacing
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },

      // Modern border radius (matching design system)
      borderRadius: {
        'none': '0px',
        'small': '6px',    // Small radius for smaller elements
        'medium': '12px',  // Medium radius for cards (2-3 columns)  
        'large': '24px',   // Large radius for wider elements (1-2 columns)
        'image': '12px',
        'card': '12px',
        'button': '6px',
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

      lineHeight: {
        'tight': '1.25',
        'relaxed': '1.625',
      },

      aspectRatio: {
        'video': '16 / 9',
        '4/3': '4 / 3',
      },

      // Design system shadows (from Shadows.png)
      boxShadow: {
        'xxsmall': '0px 1px 2px 0px rgba(16, 24, 40, 0.05)',
        'xsmall': '0px 1px 3px 0px rgba(16, 24, 40, 0.1), 0px 1px 2px 0px rgba(16, 24, 40, 0.06)',
        'small': '0px 1px 3px 0px rgba(16, 24, 40, 0.1), 0px 1px 2px -1px rgba(16, 24, 40, 0.1)',
        'medium': '0px 4px 8px -2px rgba(16, 24, 40, 0.1), 0px 2px 4px -2px rgba(16, 24, 40, 0.06)',
        'large': '0px 12px 16px -4px rgba(16, 24, 40, 0.08), 0px 4px 6px -2px rgba(16, 24, 40, 0.03)',
        'xlarge': '0px 20px 24px -4px rgba(16, 24, 40, 0.08), 0px 8px 8px -4px rgba(16, 24, 40, 0.03)',
        'xxlarge': '0px 24px 48px -12px rgba(16, 24, 40, 0.18)',
      },

      // Enhanced animations
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
    function({ addUtilities, addComponents, theme }) {
      const newUtilities = {
        // Responsive heading utilities (Bebas Neue) - Desktop first, mobile override
        '.heading-h1': {
          fontSize: theme('fontSize.heading-h1-desktop[0]'),
          lineHeight: theme('fontSize.heading-h1-desktop[1].lineHeight'),
          fontFamily: theme('fontFamily.heading'),
          fontWeight: '400',
          textTransform: 'uppercase',
          letterSpacing: '0.025em',
          '@media (max-width: 768px)': {
            fontSize: theme('fontSize.heading-h1-mobile[0]'),
            lineHeight: theme('fontSize.heading-h1-mobile[1].lineHeight'),
          },
        },
        '.heading-h2': {
          fontSize: theme('fontSize.heading-h2-desktop[0]'),
          lineHeight: theme('fontSize.heading-h2-desktop[1].lineHeight'),
          fontFamily: theme('fontFamily.heading'),
          fontWeight: '400',
          textTransform: 'uppercase',
          letterSpacing: '0.025em',
          '@media (max-width: 768px)': {
            fontSize: theme('fontSize.heading-h2-mobile[0]'),
            lineHeight: theme('fontSize.heading-h2-mobile[1].lineHeight'),
          },
        },
        '.heading-h3': {
          fontSize: theme('fontSize.heading-h3-desktop[0]'),
          lineHeight: theme('fontSize.heading-h3-desktop[1].lineHeight'),
          fontFamily: theme('fontFamily.heading'),
          fontWeight: '400',
          textTransform: 'uppercase',
          letterSpacing: '0.025em',
          '@media (max-width: 768px)': {
            fontSize: theme('fontSize.heading-h3-mobile[0]'),
            lineHeight: theme('fontSize.heading-h3-mobile[1].lineHeight'),
          },
        },
        '.heading-h4': {
          fontSize: theme('fontSize.heading-h4-desktop[0]'),
          lineHeight: theme('fontSize.heading-h4-desktop[1].lineHeight'),
          fontFamily: theme('fontFamily.heading'),
          fontWeight: '400',
          textTransform: 'uppercase',
          letterSpacing: '0.025em',
          '@media (max-width: 768px)': {
            fontSize: theme('fontSize.heading-h4-mobile[0]'),
            lineHeight: theme('fontSize.heading-h4-mobile[1].lineHeight'),
          },
        },
        '.heading-h5': {
          fontSize: theme('fontSize.heading-h5-desktop[0]'),
          lineHeight: theme('fontSize.heading-h5-desktop[1].lineHeight'),
          fontFamily: theme('fontFamily.heading'),
          fontWeight: '400',
          textTransform: 'uppercase',
          letterSpacing: '0.025em',
          '@media (max-width: 768px)': {
            fontSize: theme('fontSize.heading-h5-mobile[0]'),
            lineHeight: theme('fontSize.heading-h5-mobile[1].lineHeight'),
          },
        },
        '.heading-h6': {
          fontSize: theme('fontSize.heading-h6-desktop[0]'),
          lineHeight: theme('fontSize.heading-h6-desktop[1].lineHeight'),
          fontFamily: theme('fontFamily.heading'),
          fontWeight: '400',
          textTransform: 'uppercase',
          letterSpacing: '0.025em',
          '@media (max-width: 768px)': {
            fontSize: theme('fontSize.heading-h6-mobile[0]'),
            lineHeight: theme('fontSize.heading-h6-mobile[1].lineHeight'),
          },
        },
        // Body text utilities (Montserrat)
        '.text-large': {
          fontSize: theme('fontSize.text-large[0]'),
          lineHeight: theme('fontSize.text-large[1].lineHeight'),
          fontFamily: theme('fontFamily.body'),
          fontWeight: '800', // Extra bold
        },
        '.text-medium': {
          fontSize: theme('fontSize.text-medium[0]'),
          lineHeight: theme('fontSize.text-medium[1].lineHeight'),
          fontFamily: theme('fontFamily.body'),
          fontWeight: '700', // Bold
        },
        '.text-regular': {
          fontSize: theme('fontSize.text-regular[0]'),
          lineHeight: theme('fontSize.text-regular[1].lineHeight'),
          fontFamily: theme('fontFamily.body'),
          fontWeight: '400', // Regular
        },
        '.text-small': {
          fontSize: theme('fontSize.text-small[0]'),
          lineHeight: theme('fontSize.text-small[1].lineHeight'),
          fontFamily: theme('fontFamily.body'),
          fontWeight: '400', // Small
        },
        '.text-tiny': {
          fontSize: theme('fontSize.text-tiny[0]'),
          lineHeight: theme('fontSize.text-tiny[1].lineHeight'),
          fontFamily: theme('fontFamily.body'),
          fontWeight: '400', // Tiny
        },
        '.tagline': {
          fontSize: theme('fontSize.tagline[0]'),
          lineHeight: theme('fontSize.tagline[1].lineHeight'),
          fontFamily: theme('fontFamily.body'),
          fontWeight: '400', // Tagline
        },
      }

      // Admin-specific component classes
      const adminComponents = {
        '.admin-page': {
          backgroundColor: theme('colors.admin.background'),
          color: theme('colors.admin.text'),
          minHeight: '100vh',
        },
        '.admin-card': {
          backgroundColor: theme('colors.admin.surface'),
          borderColor: theme('colors.admin.border'),
          borderWidth: '1px',
          borderRadius: theme('borderRadius.card'),
          padding: theme('spacing.6'),
          boxShadow: theme('boxShadow.lg'),
        },
        '.admin-input': {
          backgroundColor: theme('colors.gray.700'),
          borderColor: theme('colors.gray.600'),
          color: theme('colors.white'),
          borderWidth: '1px',
          borderRadius: theme('borderRadius.md'),
          padding: `${theme('spacing.2')} ${theme('spacing.3')}`,
          '&:focus': {
            outline: 'none',
            ringWidth: '2px',
            ringColor: theme('colors.music.primary'),
          },
        },
        '.admin-button': {
          backgroundColor: theme('colors.admin.accent'),
          color: theme('colors.white'),
          padding: `${theme('spacing.2')} ${theme('spacing.4')}`,
          borderRadius: theme('borderRadius.button'),
          fontWeight: '500',
          transition: 'all 0.2s',
          '&:hover': {
            backgroundColor: theme('colors.admin.accent-hover'),
          },
        },
      }

      // Public page component classes
      const publicComponents = {
        '.public-page': {
          backgroundColor: theme('colors.scheme.background'),
          color: theme('colors.scheme.text'),
        },
        '.public-card': {
          backgroundColor: theme('colors.scheme.surface'),
          borderColor: theme('colors.scheme.border'),
          borderWidth: '1px',
          borderRadius: theme('borderRadius.card'),
          padding: theme('spacing.6'),
          boxShadow: theme('boxShadow.sm'),
        },
        '.public-button': {
          backgroundColor: theme('colors.scheme.accent'),
          color: theme('colors.white'),
          padding: `${theme('spacing.3')} ${theme('spacing.6')}`,
          borderRadius: theme('borderRadius.button'),
          fontWeight: '500',
          transition: 'all 0.2s',
          '&:hover': {
            backgroundColor: theme('colors.scheme.accent-hover'),
          },
        },
      }
      
      addUtilities(newUtilities)
      addComponents({...adminComponents, ...publicComponents})
    }
  ],
}