/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Professional Event Brand Colors
        'music-blue': {
          50: '#f0f4ff',
          100: '#e0e9ff',
          200: '#c7d7ff',
          300: '#a4bfff',
          400: '#809bff',
          500: '#5c77ff',
          600: '#002B88', // Resolution Blue - primary buttons/interactive
          700: '#002466',
          800: '#002053', // Oxford Blue - primary backgrounds/headings
          900: '#001a44',
          950: '#001133',
        },
        'music-yellow': {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fed27a',
          300: '#fdb541',
          400: '#fd9e09',
          500: '#FCB60C', // Spanish Yellow - primary accent
          600: '#dc9006',
          700: '#b76e02',
          800: '#92550a',
          900: '#78460c',
        },
        'music-red': {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#c41e3a', // Cardinals Red - urgent CTAs
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        'music-neutral': {
          50: '#ffffff', // White - text, clean backgrounds
          100: '#f9fafb',
          200: '#f3f4f6',
          300: '#e5e7eb',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#333333', // Dark Gray - body text, subtle UI
          900: '#1f2937',
        },
        // Genre-specific colors using brand palette
        'genre': {
          'house': '#FCB60C',           // Spanish Yellow - energetic house vibes
          'drum-and-bass': '#002B88',   // Resolution Blue - high energy
          'ukg': '#c41e3a',             // Cardinals Red - UK garage heritage  
          'dubstep': '#002053',         // Oxford Blue - heavy bass
          'trance': '#FCB60C',          // Spanish Yellow - euphoric energy
          'techno': '#002B88',          // Resolution Blue - detroit techno
          'multi-genre': '#c41e3a',     // Cardinals Red - diverse lineup
          'other': '#333333',           // Dark Gray - catch-all
        },
        
        // Brand color aliases for easier use
        'music-primary': {
          DEFAULT: '#002053',           // Oxford Blue
          light: '#002B88',             // Resolution Blue
          dark: '#001133',
        },
        'music-accent': {
          DEFAULT: '#FCB60C',           // Spanish Yellow
          light: '#fed27a',
          dark: '#b76e02',
        },
        'music-danger': {
          DEFAULT: '#c41e3a',           // Cardinals Red
          light: '#fca5a5',
          dark: '#991b1b',
        },
        
        // Backward compatibility - map purple to blue
        'music-purple': {
          50: '#f0f4ff',
          100: '#e0e9ff',
          200: '#c7d7ff',
          300: '#a4bfff',
          400: '#809bff',
          500: '#5c77ff',
          600: '#002B88', // Resolution Blue
          700: '#002466',
          800: '#002053', // Oxford Blue
          900: '#001a44',
          950: '#001133',
        },
        // Chang's Cookbook compatibility colors
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
        // Legacy colors for compatibility
        orange: {
          50: '#fff5f0',
          100: '#ffe8db',
          200: '#ffceb3',
          300: '#ffab80',
          400: '#ff9966',
          500: '#ff8247',
          600: '#e6824e',
          700: '#cc6633',
        },
        red: {
          50: '#FDF2F2',
          500: '#E74C3C',
          600: '#DC2626',
        },
        green: {
          600: '#7D8471',
        },
        stone: {
          100: '#F5F1EB',
        },
        slate: {
          200: '#ECF0F1',
          400: '#95A5A6',
          700: '#2C3E50',
        },
      },
      fontFamily: {
        'heading': ['Quicksand', 'Inter', 'system-ui', 'sans-serif'],
        'body': ['Source Sans Pro', 'Inter', 'system-ui', 'sans-serif'],
        sans: ['Source Sans Pro', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'serif'],
      },
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
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      lineHeight: {
        'tight': '1.25',
        'relaxed': '1.625',
      },
      aspectRatio: {
        'video': '16 / 9',
        '4/3': '4 / 3',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
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
      },
    },
  },
  plugins: [],
}