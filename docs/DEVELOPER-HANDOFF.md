# Developer Handoff Documentation

**Local Music Events Platform - Complete Development Environment**

## 🚀 Quick Start for New Developers

### 1. Environment Setup

```bash
# Clone repository
git clone [repository-url]
cd local-music-events

# Install dependencies
npm install

# Start complete development environment
npm run dev:full
```

**That's it!** The unified development script will:
- ✅ Clean up any conflicting processes
- ✅ Start Next.js development server
- ✅ Launch Playwright browser with dev helpers
- ✅ Check Archon MCP integration
- ✅ Display comprehensive status

## 📋 Development Commands Reference

### Primary Commands (Use These)

```bash
# Complete development environment (RECOMMENDED)
npm run dev:full          # Dev server + Playwright + Archon integration

# Specific environments
npm run dev:playwright     # Dev server + Playwright browser with testing
npm run dev:server        # Development server only
npm run dev:archon        # Archon MCP integration status
npm run dev:health        # Health check all components
```

### Legacy Commands (Still Work)

```bash
npm run dev               # Basic Next.js development server
npm run build             # Production build
npm run start             # Production server
```

## 🛠️ Advanced Development Features

### Browser Development Helpers (Playwright Mode)

When using `npm run dev:playwright`, these helpers are available in the browser console:

```javascript
// Quick navigation
window.devHelpers.admin()     // Go to admin panel
window.devHelpers.events()    // Go to events page
window.devHelpers.venues()    // Go to venues page
window.devHelpers.promoters() // Go to promoters page
window.devHelpers.calendar()  // Go to calendar page

// Utilities
window.devHelpers.reload()    // Reload page
window.devHelpers.navigate('/custom-path')  // Navigate to any path
```

### Archon MCP Integration

**Project Management through Archon:**
- Task tracking and management
- Knowledge base integration
- Project workflow automation
- Development progress monitoring

**Check integration status:**
```bash
npm run dev:archon
```

## 🏗️ Project Architecture

### Technology Stack
- **Framework**: Next.js 15.4.6 with React 19.1.1
- **Language**: TypeScript with complete type system
- **Styling**: Tailwind CSS 3.4.17 with music-themed colors
- **Database**: PostgreSQL via Neon
- **Development**: Streamlined automation scripts
- **Music APIs**: Spotify, Last.fm, MusicBrainz integration
- **Browser Testing**: Playwright automation

### Key Directories
```
local-music-events/
├── src/                    # Application source code
│   ├── app/               # Next.js app router
│   ├── components/        # React components
│   └── lib/              # Utility functions
├── scripts/               # Development automation scripts
│   ├── dev.js            # Unified development launcher
│   ├── dev-manager.js    # Development server management
│   ├── playwright-dev.js # Playwright integration
│   ├── archon-dev.js     # Archon MCP integration
│   └── README.md         # Detailed scripts documentation
├── docs/                  # Project documentation
├── prisma/               # Database schema and migrations
└── public/               # Static assets
```

## 📊 System Status & Monitoring

### Health Check
```bash
npm run dev:health
```

**Monitors:**
- ✅ Development server status
- ✅ Archon MCP connectivity
- ✅ Playwright availability
- ✅ Database connection
- ✅ Overall environment health

### Troubleshooting Common Issues

**"Port 3000 already in use"**
- The development scripts automatically handle this
- Manual cleanup: `pkill -f "npm run dev"`

**"Events hanging at Loading..."**
- Restart with clean environment: `npm run dev:full`
- Check database connection in health check

**"Archon MCP not connected"**
- Ensure Archon MCP server is running
- Check Claude Code MCP configuration
- Run: `npm run dev:archon` for detailed status

**"Playwright browser fails to launch"**
- Install Playwright: `npx playwright install`
- Fallback to server-only: `npm run dev:server`

## 🗄️ Database & Admin

### Database Configuration
- **Provider**: PostgreSQL via Neon
- **Schema**: Fully migrated and synchronized
- **Connection**: Configured in environment variables

### Admin Access
- **URL**: http://localhost:3000/admin
- **Email**: `hello@alexthip.com`
- **Password**: `admin123`

### Database Commands
```bash
# Generate Prisma client
npx prisma generate

# Push schema changes
DATABASE_URL="[connection-string]" npx prisma db push

# Open database studio
npx prisma studio
```

## 🎯 Development Workflow

### Daily Development Routine

1. **Start Environment:**
   ```bash
   npm run dev:full
   ```

2. **Check Archon Tasks (if using Archon):**
   - Use Claude Code with Archon MCP tools
   - Or run: `npm run dev:archon`

3. **Develop with Browser Helpers:**
   - Use `window.devHelpers` for quick navigation
   - Automatic error monitoring and logging

4. **Test Changes:**
   - Playwright browser automatically refreshes
   - Use quick test option: `npm run dev:playwright`

5. **Monitor Health:**
   ```bash
   npm run dev:health
   ```

### Code Quality & Standards

**Automatic Process Management:**
- ✅ No manual process cleanup needed
- ✅ Automatic port conflict resolution
- ✅ Environment health monitoring
- ✅ Error detection and reporting

**Development Efficiency:**
- ✅ Single command for complete setup
- ✅ Browser automation with dev helpers
- ✅ Integrated project management (Archon)
- ✅ Comprehensive status monitoring

## 📚 Documentation Structure

### Primary Documentation
- **[CLAUDE.md](../CLAUDE.md)** - Quick reference and project instructions
- **[PROJECT-OVERVIEW.md](PROJECT-OVERVIEW.md)** - Technical architecture and features
- **[ARCHON-WORKFLOW.md](ARCHON-WORKFLOW.md)** - Archon integration and workflow
- **[scripts/README.md](../scripts/README.md)** - Development scripts detailed documentation

### Session History
- **[SESSION-LOGS.md](SESSION-LOGS.md)** - Detailed development history and decisions

## 🎵 Artist Pages & Music API Integration

### Artist Page Features (NEW)
**Complete artist profiles with rich data integration:**

- **Dynamic Route**: `/artists/[id]` or `/artists/[slug]`
- **API Endpoint**: `/api/artists/[id]` with comprehensive data
- **Data Sources**: Spotify, Last.fm, MusicBrainz integration
- **Admin Management**: Full CRUD interface at `/admin/artists`

### Key Artist Page Components
```
Artist Page Structure:
├── Hero Section (with genres and stats)
├── Biography (Last.fm integration)
├── Popular Tracks (Spotify integration)
├── Upcoming/Past Events
├── Artist Info Sidebar
└── Social Media Links
```

### Music API Integration
**Spotify Integration:**
- Artist profiles and images
- Top tracks with album artwork
- Follower counts and popularity
- Genre classifications

**Last.fm Integration:**
- Comprehensive artist biographies
- Listener statistics and play counts
- Additional metadata and tags

**MusicBrainz Integration:**
- Social media URL discovery
- Artist hometown and formation data
- Cross-platform link verification

### Image Configuration
**Required CDN Domains in `next.config.js`:**
```javascript
remotePatterns: [
  {
    protocol: 'https',
    hostname: 'i.scdn.co',  // Spotify images
    pathname: '/**',
  },
  // ... other domains
]
```

### Artist API Sync
**Trigger data sync for artists:**
```bash
# Via API endpoint
POST /api/artists/[id]/sync-spotify

# Admin interface provides sync buttons
# Navigate to: /admin/artists/[id]/edit
```

## 🔧 Customization & Extension

### Adding New Development Scripts

1. Create script in `scripts/` directory
2. Add npm script to `package.json`
3. Update `scripts/README.md` documentation
4. Test integration with unified launcher

### Environment Variables

**Required:**
```bash
DATABASE_URL="postgresql://..."
ADMIN_EMAIL="hello@alexthip.com"
ADMIN_PASSWORD="admin123"
```

**Optional:**
```bash
ARCHON_MCP_PORT="8051"           # Archon MCP server port
DISABLE_SESSION_VALIDATION="true" # For Archon MCP integration
```

## 🚀 Production Deployment

### Build Process
```bash
npm run build               # Create production build
npm run start               # Start production server
```

### Pre-deployment Checklist
- [ ] Run health check: `npm run dev:health`
- [ ] Verify database connectivity
- [ ] Test admin interface functionality
- [ ] Confirm all environment variables set
- [ ] Validate image upload system
- [ ] Test Facebook event import (Chrome extension)
- [ ] Verify Spotify API integration for artist data
- [ ] Test artist page functionality at `/artists/[id]`
- [ ] Confirm image CDN domains in next.config.js

## 🎉 Success Indicators

**Environment is working correctly when:**
- ✅ `npm run dev:full` completes without errors
- ✅ Browser opens automatically with dev helpers available
- ✅ Health check shows all components healthy
- ✅ Admin interface accessible at `/admin`
- ✅ Events load properly on homepage
- ✅ Archon MCP integration functional (if configured)

## 📞 Support & Resources

### Key Files for Reference
- **Development Scripts**: `scripts/` directory
- **Main Configuration**: `package.json`, `next.config.js`, `tailwind.config.js`
- **Database Schema**: `prisma/schema.prisma`
- **Environment Setup**: `.env.local` (create from `.env.example`)

### Common Tasks Quick Reference
```bash
# Development
npm run dev:full                 # Start everything
npm run dev:health              # Check status

# Database
npx prisma generate             # Generate client
npx prisma studio               # Database GUI

# Admin
# Navigate to: http://localhost:3000/admin
# Credentials: hello@alexthip.com / admin123

# Troubleshooting
pkill -f "npm run dev"          # Manual process cleanup
lsof -i :3000                   # Check port usage
```

---

## 🚨 **URGENT: Current Issue Status (August 25, 2025)**

### **PRIORITY FIX NEEDED: Homepage Loading Issue** ⚠️

**Problem**: Homepage stuck in loading state despite API working correctly.

**Status**:
- ✅ **API Layer**: COMPLETELY FIXED - Hero events return first as expected
- ✅ **Database**: All data correct, hero event properly flagged
- ❌ **Frontend**: React hydration/state update issue preventing data display

**Evidence**:
```bash
# API works perfectly
curl -s "localhost:3000/api/events?limit=2" | jq '.events[0].hero'
# Returns: true (Wicked Warehouse event)

# But homepage shows "Loading events..." indefinitely
```

**Investigation Done**:
- Confirmed API returns correct data with hero events first
- Database verified - "Wicked Warehouse Ft. Troyboi" has `hero: true`
- Server logs show successful API calls but client shows "0 events"
- Issue isolated to React client-side rendering

**Next Developer Action Required**:
1. Fix React state management in `/src/app/page.tsx:158-202`
2. Check why `setFeaturedEvents()` and `setAllEvents()` don't update state
3. Verify `useEffect` and API call completion on client-side
4. Remove debug logging once fixed

**Files Modified This Session**:
- ✅ `/src/app/api/events/route.ts` - Hero event ordering fixed
- ✅ `/src/app/events/page.tsx` - Genre label formatting fixed  
- ⚠️ `/src/app/page.tsx` - Debugging added, needs state fix

---

## 🎯 Ready to Develop!

**Start with:** `npm run dev:full`

This comprehensive development environment setup ensures a smooth, efficient development experience with automatic process management, browser automation, and integrated project management tools.

**Questions?** Check the detailed documentation in `scripts/README.md` or examine the source code in the `scripts/` directory.