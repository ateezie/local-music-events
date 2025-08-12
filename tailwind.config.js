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
        // Local Music Events Brand Colors
        'music-purple': {
          50: '#faf7ff',
          100: '#f0ebff',
          200: '#e3daff',
          300: '#d1bfff',
          400: '#b899ff',
          500: '#9d6dff',
          600: '#8b4aff', // primary purple
          700: '#7c3aed',
          800: '#6b21a8', // deep purple
          900: '#581c87', // primary dark purple
          950: '#2D1B69', // darkest for backgrounds
        },
        'music-blue': {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7', // primary blue
          700: '#0369a1',
          800: '#075985', // deep blue
          900: '#0c4a6e', // primary dark blue
          950: '#082f49', // darkest blue
        },
        'music-accent': {
          50: '#fff0f3',
          100: '#ffe1e7',
          200: '#ffc7d4',
          300: '#ff9fb4',
          400: '#ff6b8a',
          500: '#ff3d71', // electric pink
          600: '#e83f6f', // primary accent
          700: '#d1345b',
          800: '#b02a47',
          900: '#922b3e',
        },
        'music-neutral': {
          50: '#fafafa', // light background
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626', // dark backgrounds
          900: '#171717', // primary dark
        },
        // Genre-specific colors
        'genre': {
          'rock': '#FF6B35',
          'indie-rock': '#E83F6F',
          'punk': '#FF1493',
          'metal': '#4B0000',
          'alternative': '#FF1493',
          'pop': '#FF69B4',
          'hip-hop': '#9370DB',
          'rap': '#8A2BE2',
          'r-b': '#DA70D6',
          'jazz': '#FFD700',
          'blues': '#4169E1',
          'country': '#8B4513',
          'folk': '#CD853F',
          'acoustic': '#8FBC8F',
          'electronic': '#00FFFF',
          'edm': '#00CED1',
          'house': '#20B2AA',
          'techno': '#00BFFF',
          'reggae': '#228B22',
          'ska': '#32CD32',
          'classical': '#800080',
          'experimental': '#FF6347',
          'indie': '#FF69B4',
          'singer-songwriter': '#DDA0DD',
          'covers': '#B0C4DE',
          'tribute': '#87CEEB',
          'multi-genre': '#F0E68C',
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