#!/usr/bin/env node

/**
 * Archon Development Integration
 * 
 * Provides streamlined integration between Local Music Events and Archon MCP server:
 * - Checks Archon MCP server connectivity
 * - Manages project tasks through Archon
 * - Provides development workflow helpers
 */

const { spawn, exec } = require('child_process');
const path = require('path');

class ArchonDev {
  constructor() {
    this.projectId = null;
    this.mcpTools = [
      'mcp__archon__health_check',
      'mcp__archon__manage_project', 
      'mcp__archon__manage_task',
      'mcp__archon__manage_document'
    ];
  }

  async checkMCPConnectivity() {
    console.log('🔍 Checking Archon MCP connectivity...');

    try {
      // Check if Claude Code MCP tools are available
      const result = await this.runClaudeCommand(['mcp', 'tools', 'list']);
      
      const hasArchonTools = this.mcpTools.some(tool => 
        result.includes(tool)
      );

      if (hasArchonTools) {
        console.log('✅ Archon MCP server is connected and accessible');
        return true;
      } else {
        console.log('⚠️  Archon MCP tools not found in Claude Code');
        console.log('💡 Make sure Archon MCP server is running and configured in Claude Code');
        return false;
      }

    } catch (error) {
      console.log('❌ Failed to check MCP connectivity:', error.message);
      console.log('💡 Make sure Claude Code is available and MCP servers are configured');
      return false;
    }
  }

  async findProject() {
    console.log('🔍 Looking for Local Music Events project in Archon...');

    try {
      const result = await this.runClaudeCommand([
        'mcp', 'call', 'mcp__archon__manage_project',
        '--', 'action=list'
      ]);

      // Parse the result to find project
      if (result.includes('Local Music Events') || result.includes("What's The Move")) {
        console.log('✅ Found Local Music Events project in Archon');
        // Extract project ID if possible
        const projectMatch = result.match(/'id':\s*'([^']+)'/);
        if (projectMatch) {
          this.projectId = projectMatch[1];
          console.log(`📝 Project ID: ${this.projectId}`);
        }
        return true;
      } else {
        console.log('⚠️  Local Music Events project not found in Archon');
        console.log('💡 You may need to create a project in Archon first');
        return false;
      }

    } catch (error) {
      console.log('❌ Failed to find project:', error.message);
      return false;
    }
  }

  async getProjectTasks() {
    if (!this.projectId) {
      console.log('⚠️  No project ID available');
      return null;
    }

    console.log('📋 Retrieving project tasks...');

    try {
      const result = await this.runClaudeCommand([
        'mcp', 'call', 'mcp__archon__manage_task',
        '--', `action=list`, `project_id=${this.projectId}`
      ]);

      console.log('✅ Tasks retrieved successfully');
      return result;

    } catch (error) {
      console.log('❌ Failed to get tasks:', error.message);
      return null;
    }
  }

  async createDevelopmentTask(title, description) {
    if (!this.projectId) {
      console.log('⚠️  No project ID available');
      return false;
    }

    console.log(`📝 Creating development task: ${title}`);

    try {
      const result = await this.runClaudeCommand([
        'mcp', 'call', 'mcp__archon__manage_task',
        '--', 
        'action=create',
        `project_id=${this.projectId}`,
        `title=${title}`,
        `description=${description}`,
        'assignee=AI IDE Agent'
      ]);

      console.log('✅ Task created successfully');
      return true;

    } catch (error) {
      console.log('❌ Failed to create task:', error.message);
      return false;
    }
  }

  async runHealthCheck() {
    console.log('🏥 Running Archon health check...');

    try {
      const result = await this.runClaudeCommand([
        'mcp', 'call', 'mcp__archon__health_check'
      ]);

      console.log('✅ Health check completed');
      return result;

    } catch (error) {
      console.log('❌ Health check failed:', error.message);
      return null;
    }
  }

  runClaudeCommand(args) {
    return new Promise((resolve, reject) => {
      const claude = spawn('claude', args, {
        stdio: ['pipe', 'pipe', 'pipe']
      });

      let stdout = '';
      let stderr = '';

      claude.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      claude.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      claude.on('close', (code) => {
        if (code === 0) {
          resolve(stdout);
        } else {
          reject(new Error(`Claude command failed: ${stderr || stdout}`));
        }
      });

      claude.on('error', (error) => {
        reject(error);
      });
    });
  }

  async showStatus() {
    console.log('\n📊 Archon Development Status:');
    console.log('=' .repeat(50));

    // Check connectivity
    const connected = await this.checkMCPConnectivity();
    console.log(`🔗 MCP Connectivity: ${connected ? '✅ Connected' : '❌ Disconnected'}`);

    if (!connected) {
      console.log('\n💡 To fix connectivity issues:');
      console.log('   1. Ensure Archon MCP server is running');
      console.log('   2. Check Claude Code MCP configuration');
      console.log('   3. Verify environment variables');
      return;
    }

    // Check project
    const projectFound = await this.findProject();
    console.log(`📁 Project Status: ${projectFound ? '✅ Found' : '⚠️  Not Found'}`);

    if (projectFound && this.projectId) {
      // Get tasks
      const tasks = await this.getProjectTasks();
      if (tasks) {
        const taskCount = (tasks.match(/"id":/g) || []).length;
        console.log(`📋 Tasks: ${taskCount} found`);
      }
    }

    // Health check
    await this.runHealthCheck();

    console.log('\n🚀 Ready for development with Archon integration!');
  }

  async setupDevelopmentWorkflow() {
    console.log('⚙️  Setting up development workflow...');

    const connected = await this.checkMCPConnectivity();
    if (!connected) {
      console.log('❌ Cannot setup workflow without MCP connectivity');
      return false;
    }

    const projectFound = await this.findProject();
    if (!projectFound) {
      console.log('❌ Cannot setup workflow without project');
      return false;
    }

    console.log('✅ Development workflow ready');
    console.log('\n🛠️  Available commands:');
    console.log('   node scripts/archon-dev.js --status        - Show Archon status');
    console.log('   node scripts/archon-dev.js --tasks         - List project tasks');
    console.log('   node scripts/archon-dev.js --health        - Run health check');
    console.log('   node scripts/archon-dev.js --create-task   - Create development task');

    return true;
  }
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const archonDev = new ArchonDev();

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Archon Development Integration

Usage: node scripts/archon-dev.js [options]

Options:
  --status          Show comprehensive Archon status
  --tasks           List project tasks
  --health          Run health check
  --create-task     Create a development task (interactive)
  --setup           Setup development workflow
  -h, --help        Show this help message

This script provides integration between Local Music Events and Archon MCP server
for streamlined project management and task tracking.
`);
    process.exit(0);
  }

  if (args.includes('--status')) {
    archonDev.showStatus();
  } else if (args.includes('--tasks')) {
    archonDev.findProject().then(() => {
      if (archonDev.projectId) {
        archonDev.getProjectTasks().then(tasks => {
          if (tasks) {
            console.log('\n📋 Project Tasks:');
            console.log(tasks);
          }
        });
      }
    });
  } else if (args.includes('--health')) {
    archonDev.runHealthCheck().then(result => {
      if (result) {
        console.log('\n🏥 Health Check Results:');
        console.log(result);
      }
    });
  } else if (args.includes('--create-task')) {
    // Interactive task creation would go here
    console.log('📝 Interactive task creation not yet implemented');
    console.log('💡 Use Claude Code directly with Archon MCP tools for now');
  } else if (args.includes('--setup')) {
    archonDev.setupDevelopmentWorkflow();
  } else {
    // Default: show status
    archonDev.showStatus();
  }
}

module.exports = ArchonDev;