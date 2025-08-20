# Local Music Events - Project Overview

## Project Summary

Local Music Events is a React/Next.js music event discovery platform transformed from the Chang Cookbook codebase. Features comprehensive event management, venue directory, artist profiles, and calendar integration with music-themed branding.

**Current Status:** Production Ready - Complete Facebook integration, PostgreSQL database, venue architecture with clean permalinks, persistent image uploads, streamlined development environment, and all infrastructure operational.

## Technical Architecture

### Framework & Stack
- Next.js 15.4.6 with React 19.1.1
- TypeScript with complete type system
- Tailwind CSS 3.4.17 with music-themed color palette
- PostgreSQL via Neon database
- Development Server: http://localhost:3000

### Database Configuration
- Database: PostgreSQL via Neon
- Connection: `postgresql://neondb_owner:npg_PXLi0N4RnYqf@ep-late-dust-aea8s1uw-pooler.c-2.us-east-2.aws.neon.tech/neondb`
- Schema: Migrated from SQLite to PostgreSQL, fully synchronized

## Current Features

### Core Functionality
- Event discovery with date, genre, venue, artist filtering
- Venue directory with capacity, amenities, contact information
- Artist profiles with social links and event listings
- Multi-genre selection system with electronic music sub-genre support
- Permalink system with SEO-friendly URLs
- Hero event management for homepage features
- Multi-select promoter management interface

### Data Structure
**Events Table fields:**
- id, title, slug, description, date, time, endTime
- genre, subGenres (JSON), category, promoter, promoters (JSON)
- ticketUrl, facebookEvent, instagramPost, flyer, bannerImage
- price, ageRestriction, featured, hero, status, tags (JSON)
- venueId (FK), authorId (FK), createdAt, updatedAt

**Venues Table fields:**
- id, name, slug, address, city, state, zipCode, capacity
- website, phone, email, description, image
- facebook, instagram, twitter, latitude, longitude
- amenities (JSON), accessibility (JSON), authorId (FK)
- createdAt, updatedAt

### Admin Credentials
- Email: `hello@alexthip.com`
- Password: `admin123`
- Access: http://localhost:3000/admin

## Key Components

### Recent Implementations (August 2025)
- **Venue Architecture Overhaul**: Dedicated edit pages with clean permalinks (`/admin/venues/mississippi-underground/edit`)
- **Image Upload System**: Fixed persistent preview with immediate display and proper event handling
- **Database Schema**: Added venue slug field with unique constraint and backward compatibility
- **Admin UX Improvements**: Removed success dialogs, doubled description textarea height
- **Event Detail Page**: 40vh hero section, centered genre pills, Google Maps integration
- **Multi-Genre System**: Comprehensive genre/sub-genre selection with JSON storage
- **Chrome Extension**: Facebook event import with catbox.moe image hosting
- **Cross-Page API Integration**: Hybrid JSON + PostgreSQL data system

### Color System
- Primary Purple: `music-purple-600` (#8b4aff)
- Deep Purple: `music-purple-950` (#2D1B69)
- Secondary Blue: `music-blue-600` (#0284c7)
- Accent Pink: `music-accent-600` (#e83f6f)
- Primary Accent: #4C6286 (blue-gray) for links and genre pills
- Genre-specific color coding for event categorization

## Development Environment

### 🚀 Streamlined Development Scripts (August 2025)

**Complete development environment with automated process management:**

```bash
cd /Users/alexthip/Projects/local-music-events

# Recommended: Complete environment
npm run dev:full          # Dev server + Playwright + Archon integration

# Specific environments
npm run dev:playwright     # Dev server + Playwright browser with testing
npm run dev:server        # Development server only  
npm run dev:archon        # Archon MCP integration status
npm run dev:health        # Health check all components

# Legacy command (still works)
npm run dev               # Basic Next.js development server
```

**🛠️ Development Scripts Features:**
- ✅ **Automatic Process Cleanup** - No more port conflicts or hanging processes
- ✅ **Playwright Integration** - Browser automation with injected dev helpers
- ✅ **Archon MCP Integration** - Project management and task tracking
- ✅ **Health Monitoring** - Comprehensive environment status checking
- ✅ **Unified Management** - Single command for complete development setup

**📋 Browser Development Helpers (Playwright mode):**
```javascript
// Available in browser console
window.devHelpers.admin()     // Navigate to admin panel
window.devHelpers.events()    // Navigate to events page
window.devHelpers.venues()    // Navigate to venues page
window.devHelpers.reload()    // Reload page
```

📖 **Detailed documentation:** [`scripts/README.md`](../scripts/README.md)

### Database Operations
```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
DATABASE_URL="postgresql://neondb_owner:npg_PXLi0N4RnYqf@ep-late-dust-aea8s1uw-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require" npx prisma db push

# Build for production
npm run build
```

## Key Files

### Core Application
- `src/app/events/[id]/page.tsx` - Event detail page with 40vh hero
- `src/components/EventCard.tsx` - Event display with genre pills
- `src/components/GenreMultiSelect.tsx` - Multi-genre selection
- `src/components/PromoterMultiSelect.tsx` - Multi-select promoter interface
- `src/lib/events.ts` - Event data access and filtering
- `src/lib/slug.ts` - Permalink generation utilities
- `src/lib/dateUtils.ts` - UTC-safe date formatting

### Configuration
- `prisma/schema.prisma` - Database schema with all fields
- `tailwind.config.js` - Music-themed color system
- `next.config.js` - Standalone output, image domains
- `.env.local` - Environment variables with Neon DB

## Current System Status

### Operational Features
- Development server running without errors
- Database connected and schema synchronized
- All CRUD operations functional
- Chrome extension Facebook import working
- Multi-genre and promoter management operational
- Permalink system with SEO-friendly URLs active
- Admin interface fully functional
- Image system with catbox.moe integration working

### Infrastructure
- Docker multi-stage builds ready
- GitHub Actions CI/CD configured
- PostgreSQL database operational
- Next.js image optimization configured
- Production-ready environment setup

## Production Ready

All major systems operational:
- Database integration complete
- Multi-genre taxonomy system functional
- Permalink system with backward compatibility
- Professional UI with proper styling
- Admin interface with multi-select components
- Chrome extension with port auto-detection
- Cross-page navigation consistency

System ready for continued development or production deployment.