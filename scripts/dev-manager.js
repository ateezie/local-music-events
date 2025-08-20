#!/usr/bin/env node

/**
 * Development Environment Manager
 * 
 * Provides streamlined management for the Local Music Events development environment:
 * - Cleans up existing processes
 * - Starts Next.js dev server
 * - Optionally launches Playwright browser
 * - Integrates with Archon MCP server
 */

const { spawn, exec } = require('child_process');
const path = require('path');
const fs = require('fs');

class DevManager {
  constructor() {
    this.processes = [];
    this.devServerPort = 3000;
    this.devServerUrl = `http://localhost:${this.devServerPort}`;
    this.maxRetries = 10;
    this.retryDelay = 1000;
  }

  async cleanup() {
    console.log('🧹 Cleaning up existing processes...');
    
    // Kill existing npm dev processes
    await this.killProcesses('npm run dev');
    await this.killProcesses('next-server');
    await this.killProcesses('node.*next');
    
    // Wait for cleanup to complete
    await this.sleep(2000);
    console.log('✅ Cleanup complete');
  }

  killProcesses(pattern) {
    return new Promise((resolve) => {
      exec(`pkill -f "${pattern}"`, (error) => {
        // Don't log errors - it's normal if no processes are found
        resolve();
      });
    });
  }

  async startDevServer() {
    console.log('🚀 Starting Next.js development server...');
    
    const devProcess = spawn('npm', ['run', 'dev'], {
      cwd: process.cwd(),
      stdio: ['pipe', 'pipe', 'pipe'],
      detached: false
    });

    this.processes.push(devProcess);

    // Handle process output
    devProcess.stdout.on('data', (data) => {
      const output = data.toString();
      console.log(`[DEV] ${output.trim()}`);
      
      // Check for ready signal
      if (output.includes('Ready in') || output.includes('Local:')) {
        this.devServerReady = true;
      }
    });

    devProcess.stderr.on('data', (data) => {
      console.error(`[DEV ERROR] ${data.toString().trim()}`);
    });

    devProcess.on('close', (code) => {
      console.log(`Dev server exited with code ${code}`);
    });

    // Wait for server to be ready
    await this.waitForServer();
    console.log('✅ Development server is ready');
    
    return devProcess;
  }

  async waitForServer() {
    console.log('⏳ Waiting for development server to be ready...');
    
    for (let i = 0; i < this.maxRetries; i++) {
      try {
        const response = await this.checkServer();
        if (response) {
          return true;
        }
      } catch (error) {
        // Server not ready yet
      }
      
      await this.sleep(this.retryDelay);
      console.log(`   Attempt ${i + 1}/${this.maxRetries}...`);
    }
    
    throw new Error('Development server failed to start within timeout');
  }

  checkServer() {
    return new Promise((resolve, reject) => {
      const http = require('http');
      
      const req = http.get(this.devServerUrl, (res) => {
        resolve(res.statusCode === 200);
      });
      
      req.on('error', reject);
      req.setTimeout(2000, () => {
        req.destroy();
        reject(new Error('Timeout'));
      });
    });
  }

  async launchPlaywright() {
    console.log('🎭 Launching Playwright browser...');
    
    try {
      // Import Playwright dynamically if available
      const { chromium } = require('playwright');
      
      const browser = await chromium.launch({
        headless: false,
        args: ['--start-maximized']
      });
      
      const context = await browser.newContext({
        viewport: null
      });
      
      const page = await context.newPage();
      await page.goto(this.devServerUrl);
      
      console.log('✅ Playwright browser launched');
      return { browser, context, page };
    } catch (error) {
      console.warn('⚠️  Playwright not available or failed to launch:', error.message);
      console.log('💡 You can manually open:', this.devServerUrl);
      return null;
    }
  }

  async checkArchonMCP() {
    console.log('🔍 Checking Archon MCP server status...');
    
    try {
      // Check if Archon MCP tools are available through Claude Code
      const archonCheck = spawn('claude', ['mcp', 'tools', 'list'], {
        stdio: ['pipe', 'pipe', 'pipe']
      });
      
      let output = '';
      archonCheck.stdout.on('data', (data) => {
        output += data.toString();
      });
      
      return new Promise((resolve) => {
        archonCheck.on('close', (code) => {
          if (code === 0 && output.includes('mcp__archon__')) {
            console.log('✅ Archon MCP server is accessible');
            resolve(true);
          } else {
            console.log('⚠️  Archon MCP server not accessible through Claude Code');
            console.log('💡 Make sure Archon MCP server is running and configured');
            resolve(false);
          }
        });
      });
    } catch (error) {
      console.warn('⚠️  Could not check Archon MCP status:', error.message);
      return false;
    }
  }

  async gracefulShutdown() {
    console.log('🛑 Shutting down development environment...');
    
    // Kill all spawned processes
    this.processes.forEach(proc => {
      if (!proc.killed) {
        proc.kill('SIGTERM');
      }
    });
    
    // Wait for processes to terminate
    await this.sleep(2000);
    
    console.log('✅ Development environment shutdown complete');
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async start(options = {}) {
    const {
      playwright = false,
      skipCleanup = false,
      checkArchon = true
    } = options;

    try {
      // Cleanup existing processes unless skipped
      if (!skipCleanup) {
        await this.cleanup();
      }

      // Start development server
      await this.startDevServer();

      // Check Archon MCP if requested
      if (checkArchon) {
        await this.checkArchonMCP();
      }

      // Launch Playwright if requested
      let playwrightResult = null;
      if (playwright) {
        playwrightResult = await this.launchPlaywright();
      }

      console.log('\n🎉 Development environment is ready!');
      console.log(`🌐 Local Music Events: ${this.devServerUrl}`);
      console.log('💻 Press Ctrl+C to stop all processes\n');

      // Setup graceful shutdown
      process.on('SIGINT', async () => {
        await this.gracefulShutdown();
        process.exit(0);
      });

      return {
        devServerUrl: this.devServerUrl,
        playwright: playwrightResult
      };

    } catch (error) {
      console.error('❌ Failed to start development environment:', error.message);
      await this.gracefulShutdown();
      process.exit(1);
    }
  }
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const options = {
    playwright: args.includes('--playwright') || args.includes('-p'),
    skipCleanup: args.includes('--no-cleanup'),
    checkArchon: !args.includes('--no-archon')
  };

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Development Environment Manager

Usage: node scripts/dev-manager.js [options]

Options:
  -p, --playwright    Launch Playwright browser automatically
  --no-cleanup       Skip cleanup of existing processes
  --no-archon        Skip Archon MCP server check
  -h, --help         Show this help message

Examples:
  node scripts/dev-manager.js                    # Start dev server only
  node scripts/dev-manager.js --playwright       # Start dev server + Playwright
  node scripts/dev-manager.js --no-cleanup       # Start without cleanup
`);
    process.exit(0);
  }

  const manager = new DevManager();
  manager.start(options);
}

module.exports = DevManager;