#!/usr/bin/env node

/**
 * Playwright Development Helper
 * 
 * Streamlined script for launching Local Music Events in Playwright
 * with automatic dev server management and common testing scenarios.
 */

const DevManager = require('./dev-manager');

class PlaywrightDev {
  constructor() {
    this.devManager = new DevManager();
    this.browser = null;
    this.context = null;
    this.page = null;
  }

  async start() {
    console.log('🎭 Starting Playwright development environment...');

    try {
      // Start development environment with Playwright
      const result = await this.devManager.start({
        playwright: true,
        checkArchon: true
      });

      if (result.playwright) {
        this.browser = result.playwright.browser;
        this.context = result.playwright.context;
        this.page = result.playwright.page;

        // Setup development helpers
        await this.setupDevHelpers();
        
        console.log('\n🛠️  Development helpers available:');
        console.log('   window.devHelpers.navigate(path)    - Navigate to path');
        console.log('   window.devHelpers.admin()           - Go to admin panel');
        console.log('   window.devHelpers.events()          - Go to events page');
        console.log('   window.devHelpers.venues()          - Go to venues page');
        console.log('   window.devHelpers.takeScreenshot()  - Take screenshot');
        console.log('   window.devHelpers.reload()          - Reload page');
      }

      return result;

    } catch (error) {
      console.error('❌ Failed to start Playwright dev environment:', error.message);
      process.exit(1);
    }
  }

  async setupDevHelpers() {
    if (!this.page) return;

    // Inject development helpers into the page
    await this.page.addInitScript(() => {
      window.devHelpers = {
        navigate: (path) => {
          window.location.href = path.startsWith('/') ? path : `/${path}`;
        },
        
        admin: () => {
          window.location.href = '/admin';
        },
        
        events: () => {
          window.location.href = '/events';
        },
        
        venues: () => {
          window.location.href = '/venues';
        },
        
        promoters: () => {
          window.location.href = '/promoters';
        },
        
        calendar: () => {
          window.location.href = '/calendar';
        },
        
        takeScreenshot: async () => {
          // This would need to be implemented via MCP if available
          console.log('Screenshot functionality would be handled by Claude Code MCP');
        },
        
        reload: () => {
          window.location.reload();
        },
        
        waitForEvents: (timeout = 5000) => {
          return new Promise((resolve, reject) => {
            const checkEvents = () => {
              const loading = document.querySelector(':contains("Loading events...")');
              if (!loading) {
                resolve(true);
                return;
              }
              setTimeout(checkEvents, 100);
            };
            
            checkEvents();
            setTimeout(() => reject(new Error('Events failed to load')), timeout);
          });
        }
      };
      
      console.log('🛠️  Dev helpers loaded! Try window.devHelpers.admin()');
    });

    // Setup console monitoring
    this.page.on('console', msg => {
      const type = msg.type();
      if (type === 'error') {
        console.log(`🔴 [BROWSER ERROR] ${msg.text()}`);
      } else if (type === 'warning') {
        console.log(`🟡 [BROWSER WARN] ${msg.text()}`);
      }
    });

    // Setup error monitoring
    this.page.on('pageerror', error => {
      console.log(`💥 [PAGE ERROR] ${error.message}`);
    });
  }

  async quickTest() {
    if (!this.page) return;

    console.log('🧪 Running quick development test...');

    try {
      // Test homepage loads
      await this.page.waitForSelector('h1', { timeout: 10000 });
      console.log('✅ Homepage loaded');

      // Test navigation
      await this.page.click('a[href="/events"]');
      await this.page.waitForURL('**/events');
      console.log('✅ Events page navigation works');

      // Go back to homepage
      await this.page.click('a[href="/"]');
      await this.page.waitForURL('**/', { timeout: 5000 });
      console.log('✅ Homepage navigation works');

      console.log('🎉 Quick test completed successfully');

    } catch (error) {
      console.log(`❌ Quick test failed: ${error.message}`);
    }
  }
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Playwright Development Helper

Usage: node scripts/playwright-dev.js [options]

Options:
  --quick-test       Run quick navigation test after startup
  -h, --help        Show this help message

This script will:
1. Clean up existing development processes
2. Start the Next.js development server
3. Check Archon MCP server status
4. Launch Playwright browser with development helpers
5. Optionally run quick tests

Development helpers will be available in the browser console as window.devHelpers
`);
    process.exit(0);
  }

  const playwrightDev = new PlaywrightDev();
  
  playwrightDev.start().then(async () => {
    if (args.includes('--quick-test')) {
      // Wait a moment for everything to settle
      setTimeout(async () => {
        await playwrightDev.quickTest();
      }, 3000);
    }
  });
}

module.exports = PlaywrightDev;