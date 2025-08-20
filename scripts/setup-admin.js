#!/usr/bin/env node

/**
 * Setup Admin User Script
 * 
 * This script helps set up admin credentials securely for new deployments.
 * It generates secure random passwords and provides guidance for setting environment variables.
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

function generateSecurePassword(length = 16) {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(charset.length);
    password += charset[randomIndex];
  }
  
  return password;
}

function generateJWTSecret() {
  return crypto.randomBytes(32).toString('base64');
}

function main() {
  console.log('🔐 Local Music Events - Admin Setup\n');
  
  const email = process.argv[2];
  
  if (!email) {
    console.log('Usage: node scripts/setup-admin.js <admin-email>');
    console.log('Example: node scripts/setup-admin.js admin@yourdomain.com\n');
    return;
  }
  
  const password = generateSecurePassword(16);
  const jwtSecret = generateJWTSecret();
  
  console.log('✅ Generated secure credentials:');
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}`);
  console.log(`JWT Secret: ${jwtSecret}\n`);
  
  console.log('📝 Add these to your .env.local file:');
  console.log(`ADMIN_EMAIL="${email}"`);
  console.log(`ADMIN_PASSWORD="${password}"`);
  console.log(`JWT_SECRET="${jwtSecret}"`);
  console.log('');
  
  // Check if .env.local exists and offer to update it
  const envPath = path.join(__dirname, '..', '.env.local');
  
  if (fs.existsSync(envPath)) {
    console.log('⚠️  .env.local already exists. Please manually update the credentials.');
  } else {
    console.log('💡 No .env.local found. Create one with the above credentials.');
  }
  
  console.log('\n🚀 After updating .env.local:');
  console.log('1. Restart your development server');
  console.log('2. Visit http://localhost:3000/admin');
  console.log('3. Sign in with the generated credentials');
  console.log('\n⚠️  IMPORTANT: Store these credentials securely and do not commit them to version control!');
}

if (require.main === module) {
  main();
}