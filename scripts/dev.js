#!/usr/bin/env node

/**
 * Unified Development Environment Launcher
 * 
 * Single command to launch the complete Local Music Events development environment:
 * - Next.js development server
 * - Playwright browser (optional)
 * - Archon MCP integration
 * - Development helpers and monitoring
 */

const DevManager = require('./dev-manager');
const PlaywrightDev = require('./playwright-dev');
const ArchonDev = require('./archon-dev');

class UnifiedDevEnvironment {
  constructor() {
    this.devManager = new DevManager();
    this.playwrightDev = new PlaywrightDev();
    this.archonDev = new ArchonDev();
    this.mode = 'full'; // full, server-only, playwright, archon
  }

  async launch(options = {}) {
    const {
      mode = 'full',
      skipCleanup = false,
      quickTest = false,
      archonStatus = true
    } = options;

    this.mode = mode;

    console.log('🚀 Launching Local Music Events Development Environment');
    console.log(`📋 Mode: ${mode}`);
    console.log('=' .repeat(60));

    try {
      switch (mode) {
        case 'server-only':
          await this.launchServerOnly(skipCleanup);
          break;
          
        case 'playwright':
          await this.launchWithPlaywright(skipCleanup, quickTest);
          break;
          
        case 'archon':
          await this.launchArchonOnly();
          break;
          
        case 'full':
        default:
          await this.launchFull(skipCleanup, quickTest, archonStatus);
          break;
      }

      this.showSummary();

    } catch (error) {
      console.error('❌ Failed to launch development environment:', error.message);
      process.exit(1);
    }
  }

  async launchServerOnly(skipCleanup) {
    console.log('🌐 Launching development server only...\n');
    
    await this.devManager.start({
      playwright: false,
      skipCleanup,
      checkArchon: false
    });
  }

  async launchWithPlaywright(skipCleanup, quickTest) {
    console.log('🎭 Launching with Playwright browser...\n');
    
    await this.playwrightDev.start();
    
    if (quickTest) {
      console.log('\n🧪 Running quick test...');
      setTimeout(async () => {
        await this.playwrightDev.quickTest();
      }, 3000);
    }
  }

  async launchArchonOnly() {
    console.log('🏗️  Launching Archon integration only...\n');
    
    await this.archonDev.showStatus();
  }

  async launchFull(skipCleanup, quickTest, archonStatus) {
    console.log('🎪 Launching full development environment...\n');

    // 1. Check Archon connectivity first (optional)
    if (archonStatus) {
      console.log('🔍 Checking Archon MCP connectivity...');
      const archonConnected = await this.archonDev.checkMCPConnectivity();
      if (archonConnected) {
        await this.archonDev.findProject();
      }
      console.log('');
    }

    // 2. Launch development server with Playwright
    await this.playwrightDev.start();

    // 3. Run quick test if requested
    if (quickTest) {
      console.log('\n🧪 Running quick test...');
      setTimeout(async () => {
        await this.playwrightDev.quickTest();
      }, 3000);
    }
  }

  showSummary() {
    console.log('\n🎉 Development Environment Ready!');
    console.log('=' .repeat(60));
    
    console.log('🌐 Local Music Events: http://localhost:3000');
    
    if (this.mode === 'playwright' || this.mode === 'full') {
      console.log('🎭 Playwright: Browser launched with dev helpers');
      console.log('   💡 Try: window.devHelpers.admin() in browser console');
    }
    
    if (this.mode === 'archon' || this.mode === 'full') {
      console.log('🏗️  Archon: MCP integration available through Claude Code');
      console.log('   💡 Use: Claude Code MCP tools for project management');
    }

    console.log('\n🛠️  Quick Commands:');
    console.log('   ctrl+c                     - Stop all processes');
    console.log('   node scripts/dev.js        - Restart full environment');
    console.log('   node scripts/archon-dev.js --status  - Check Archon status');
    
    if (this.mode === 'playwright' || this.mode === 'full') {
      console.log('\n🎭 Browser Dev Helpers:');
      console.log('   window.devHelpers.admin()     - Go to admin panel');
      console.log('   window.devHelpers.events()    - Go to events page');
      console.log('   window.devHelpers.venues()    - Go to venues page');
    }

    console.log('\n💻 Press Ctrl+C to stop all processes');
  }

  async healthCheck() {
    console.log('🏥 Running comprehensive health check...\n');

    const results = {
      devServer: false,
      archonMCP: false,
      playwright: false
    };

    // Check development server
    try {
      const response = await this.devManager.checkServer();
      results.devServer = response;
      console.log(`🌐 Dev Server: ${response ? '✅ Running' : '❌ Not responding'}`);
    } catch (error) {
      console.log('🌐 Dev Server: ❌ Not running');
    }

    // Check Archon MCP
    try {
      const archonConnected = await this.archonDev.checkMCPConnectivity();
      results.archonMCP = archonConnected;
      console.log(`🏗️  Archon MCP: ${archonConnected ? '✅ Connected' : '❌ Disconnected'}`);
    } catch (error) {
      console.log('🏗️  Archon MCP: ❌ Error checking');
    }

    // Check Playwright (if available)
    try {
      require('playwright');
      results.playwright = true;
      console.log('🎭 Playwright: ✅ Available');
    } catch (error) {
      console.log('🎭 Playwright: ⚠️  Not installed');
    }

    console.log('\n📊 Overall Status:');
    const healthy = Object.values(results).filter(Boolean).length;
    const total = Object.keys(results).length;
    console.log(`   ${healthy}/${total} components healthy`);

    return results;
  }
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Unified Development Environment Launcher

Usage: node scripts/dev.js [mode] [options]

Modes:
  (no mode)         Full environment (default)
  server-only       Development server only
  playwright        Development server + Playwright
  archon           Archon integration only

Options:
  --quick-test      Run quick navigation test after startup
  --no-cleanup      Skip cleanup of existing processes
  --no-archon       Skip Archon MCP integration
  --health          Run health check only
  -h, --help        Show this help message

Examples:
  node scripts/dev.js                     # Full environment
  node scripts/dev.js server-only         # Server only
  node scripts/dev.js playwright          # Server + Playwright
  node scripts/dev.js --health            # Health check
  node scripts/dev.js --quick-test        # Full environment with test

This is the recommended way to start Local Music Events development.
`);
    process.exit(0);
  }

  const environment = new UnifiedDevEnvironment();

  // Handle health check
  if (args.includes('--health')) {
    environment.healthCheck().then(() => {
      process.exit(0);
    });
    return;
  }

  // Determine mode
  let mode = 'full';
  if (args.includes('server-only')) mode = 'server-only';
  else if (args.includes('playwright')) mode = 'playwright';
  else if (args.includes('archon')) mode = 'archon';

  // Parse options
  const options = {
    mode,
    skipCleanup: args.includes('--no-cleanup'),
    quickTest: args.includes('--quick-test'),
    archonStatus: !args.includes('--no-archon')
  };

  // Launch environment
  environment.launch(options);
}

module.exports = UnifiedDevEnvironment;