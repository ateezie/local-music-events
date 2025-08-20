# Development Scripts

Streamlined development environment management for Local Music Events with integrated Playwright and Archon MCP support.

## Quick Start

```bash
# Full development environment (recommended)
npm run dev:full

# Development server + Playwright with testing
npm run dev:playwright

# Development server only
npm run dev:server

# Check environment health
npm run dev:health

# Archon integration status
npm run dev:archon
```

## Scripts Overview

### 🚀 `dev.js` - Unified Development Launcher
**Primary script for launching the complete development environment**

```bash
# Full environment (dev server + Playwright + Archon integration)
node scripts/dev.js

# Available modes
node scripts/dev.js server-only    # Dev server only
node scripts/dev.js playwright     # Dev server + Playwright
node scripts/dev.js archon        # Archon integration only

# Options
node scripts/dev.js --quick-test   # Run navigation tests after startup
node scripts/dev.js --no-cleanup   # Skip cleanup of existing processes
node scripts/dev.js --health       # Health check only
```

### 🌐 `dev-manager.js` - Development Server Management
**Handles Next.js development server lifecycle**

Features:
- Automatic cleanup of conflicting processes
- Health monitoring and startup verification
- Process management and graceful shutdown
- Port conflict resolution

```bash
node scripts/dev-manager.js                # Start dev server
node scripts/dev-manager.js --playwright   # Start with Playwright
node scripts/dev-manager.js --no-cleanup   # Skip cleanup
```

### 🎭 `playwright-dev.js` - Playwright Integration
**Streamlined Playwright browser automation for development**

Features:
- Automatic dev server startup
- Injected development helpers
- Console and error monitoring
- Quick navigation testing

```bash
node scripts/playwright-dev.js              # Launch with Playwright
node scripts/playwright-dev.js --quick-test # Include navigation tests
```

**Browser Development Helpers:**
```javascript
// Available in browser console
window.devHelpers.navigate('/path')    // Navigate to any path
window.devHelpers.admin()              // Go to admin panel
window.devHelpers.events()             // Go to events page
window.devHelpers.venues()             // Go to venues page
window.devHelpers.reload()             // Reload page
```

### 🏗️ `archon-dev.js` - Archon MCP Integration
**Integration with Archon MCP server for project management**

Features:
- MCP connectivity verification
- Project discovery and task management
- Health monitoring
- Development workflow setup

```bash
node scripts/archon-dev.js --status      # Show comprehensive status
node scripts/archon-dev.js --tasks       # List project tasks
node scripts/archon-dev.js --health      # Run health check
node scripts/archon-dev.js --setup       # Setup development workflow
```

## Development Workflow

### 1. **Daily Development Startup**
```bash
npm run dev:full
```
This will:
- Clean up any existing conflicting processes
- Start the Next.js development server
- Check Archon MCP connectivity
- Launch Playwright browser with dev helpers
- Display comprehensive status information

### 2. **Frontend-Only Development**
```bash
npm run dev:playwright
```
For UI work with browser automation and testing.

### 3. **Backend-Only Development**
```bash
npm run dev:server
```
For API development without browser overhead.

### 4. **Project Management with Archon**
```bash
npm run dev:archon
```
Check project status, tasks, and Archon integration.

### 5. **Health Monitoring**
```bash
npm run dev:health
```
Verify all components are working correctly.

## Troubleshooting

### Common Issues

**"Port 3000 is already in use"**
```bash
# The scripts automatically handle this, but you can manually clean up:
pkill -f "npm run dev"
pkill -f "next-server"
```

**"Archon MCP not connected"**
- Ensure Archon MCP server is running
- Check Claude Code MCP configuration
- Verify environment variables

**"Playwright browser fails to launch"**
- Install Playwright: `npx playwright install`
- Check system dependencies
- Use server-only mode as fallback

### Manual Process Management

**View running processes:**
```bash
ps aux | grep "npm run dev"
lsof -i :3000
```

**Kill specific processes:**
```bash
pkill -f "npm run dev"    # Kill npm dev processes
pkill -f "node.*next"     # Kill Next.js processes
```

## Environment Requirements

- **Node.js**: 18+ recommended
- **npm**: Latest version
- **Playwright** (optional): For browser automation
- **Claude Code**: For Archon MCP integration
- **Archon MCP Server**: For project management integration

## Configuration

### Environment Variables
```bash
# .env.local
DATABASE_URL="postgresql://..."
ADMIN_EMAIL="hello@alexthip.com"
ADMIN_PASSWORD="admin123"
```

### MCP Configuration
Ensure Archon MCP server is configured in Claude Code's MCP settings.

## Integration Benefits

✅ **Automatic Process Management** - No more port conflicts or hanging processes
✅ **Streamlined Testing** - Playwright integration with dev helpers
✅ **Project Management** - Archon integration for task tracking
✅ **Health Monitoring** - Comprehensive status checking
✅ **Development Efficiency** - Single command for complete environment
✅ **Error Prevention** - Automatic cleanup and validation

## NPM Script Reference

| Script | Purpose | Use Case |
|--------|---------|----------|
| `npm run dev:full` | Complete environment | Daily development |
| `npm run dev:playwright` | Browser testing | Frontend development |
| `npm run dev:server` | Server only | Backend development |
| `npm run dev:archon` | Archon status | Project management |
| `npm run dev:health` | Health check | Troubleshooting |

---

🎉 **Ready to develop!** Start with `npm run dev:full` for the complete experience.