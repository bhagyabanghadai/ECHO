#!/usr/bin/env node

/**
 * ECHO Project Setup Script
 * 
 * This script helps you set up the ECHO project with all required dependencies,
 * environment variables, and database schema.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const crypto = require('crypto');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function generateSessionSecret() {
  return crypto.randomBytes(32).toString('hex');
}

function checkEnvFile() {
  const envPath = path.join(__dirname, '.env');
  const envExamplePath = path.join(__dirname, '.env.example');
  
  if (!fs.existsSync(envPath)) {
    log('\n📝 Creating .env file from template...', 'yellow');
    
    if (fs.existsSync(envExamplePath)) {
      let envContent = fs.readFileSync(envExamplePath, 'utf8');
      
      // Generate a secure session secret
      const sessionSecret = generateSessionSecret();
      envContent = envContent.replace('your_session_secret_key_here', sessionSecret);
      
      fs.writeFileSync(envPath, envContent);
      log('✅ .env file created successfully!', 'green');
      log('🔑 Generated secure SESSION_SECRET automatically', 'green');
      
      return false; // Needs manual configuration
    } else {
      log('❌ .env.example file not found!', 'red');
      return false;
    }
  }
  
  return true; // .env exists
}

function checkRequiredEnvVars() {
  require('dotenv').config();
  
  const requiredVars = [
    'DATABASE_URL',
    'GLM_API_KEY',
    'VITE_GOOGLE_MAPS_API_KEY',
    'SESSION_SECRET'
  ];
  
  const missingVars = [];
  const placeholderVars = [];
  
  for (const varName of requiredVars) {
    const value = process.env[varName];
    if (!value) {
      missingVars.push(varName);
    } else if (value.includes('your_') || value.includes('_here') || value.includes('username:password')) {
      placeholderVars.push(varName);
    }
  }
  
  if (missingVars.length > 0) {
    log(`\n❌ Missing environment variables: ${missingVars.join(', ')}`, 'red');
    return false;
  }
  
  if (placeholderVars.length > 0) {
    log(`\n⚠️  Please update these environment variables with real values:`, 'yellow');
    placeholderVars.forEach(varName => {
      log(`   - ${varName}`, 'yellow');
    });
    return false;
  }
  
  return true;
}

function runCommand(command, description) {
  try {
    log(`\n🔄 ${description}...`, 'blue');
    execSync(command, { stdio: 'inherit' });
    log(`✅ ${description} completed!`, 'green');
    return true;
  } catch (error) {
    log(`❌ ${description} failed!`, 'red');
    log(`Error: ${error.message}`, 'red');
    return false;
  }
}

function checkDatabaseConnection() {
  try {
    log('\n🔄 Testing database connection...', 'blue');
    
    // Try to connect to the database
    const { Pool } = require('@neondatabase/serverless');
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    
    // This will throw if connection fails
    pool.query('SELECT 1').then(() => {
      log('✅ Database connection successful!', 'green');
      pool.end();
    }).catch((error) => {
      log('❌ Database connection failed!', 'red');
      log(`Error: ${error.message}`, 'red');
      log('\n💡 Please check your DATABASE_URL in .env file', 'yellow');
    });
    
    return true;
  } catch (error) {
    log('❌ Database connection test failed!', 'red');
    log(`Error: ${error.message}`, 'red');
    return false;
  }
}

function main() {
  log('\n🚀 ECHO Project Setup', 'bright');
  log('='.repeat(50), 'cyan');
  
  // Step 1: Check if .env file exists
  const envExists = checkEnvFile();
  
  if (!envExists) {
    log('\n📋 Next Steps:', 'bright');
    log('1. Edit the .env file with your actual API keys and database URL', 'yellow');
    log('2. Get your API keys from:', 'yellow');
    log('   - DATABASE_URL: https://neon.tech/', 'yellow');
    log('   - GLM_API_KEY: https://open.bigmodel.cn/', 'yellow');
    log('   - VITE_GOOGLE_MAPS_API_KEY: https://console.cloud.google.com/', 'yellow');
    log('3. Run this setup script again: node setup.js', 'yellow');
    log('\n📖 See ENV_SETUP.md for detailed instructions', 'cyan');
    return;
  }
  
  // Step 2: Check environment variables
  log('\n🔍 Checking environment variables...', 'blue');
  const envVarsValid = checkRequiredEnvVars();
  
  if (!envVarsValid) {
    log('\n📋 Please update your .env file with valid values and run setup again.', 'yellow');
    log('📖 See ENV_SETUP.md for detailed instructions', 'cyan');
    return;
  }
  
  log('✅ All environment variables are configured!', 'green');
  
  // Step 3: Install dependencies (if needed)
  if (!fs.existsSync(path.join(__dirname, 'node_modules'))) {
    if (!runCommand('npm install', 'Installing dependencies')) {
      return;
    }
  } else {
    log('✅ Dependencies already installed', 'green');
  }
  
  // Step 4: Set up database schema
  log('\n🗄️  Setting up database schema...', 'blue');
  if (!runCommand('npm run db:push', 'Pushing database schema')) {
    log('\n💡 If this fails, make sure your DATABASE_URL is correct', 'yellow');
    return;
  }
  
  // Step 5: Test database connection
  checkDatabaseConnection();
  
  // Success!
  log('\n🎉 Setup completed successfully!', 'bright');
  log('='.repeat(50), 'cyan');
  log('\n📋 You can now run the project:', 'bright');
  log('   npm run dev     # Start development server', 'green');
  log('   npm run build   # Build for production', 'green');
  log('   npm run start   # Start production server', 'green');
  log('\n🌐 The app will be available at: http://localhost:5000', 'cyan');
  log('\n📖 For more information, see:', 'bright');
  log('   - ENV_SETUP.md for environment configuration', 'yellow');
  log('   - README.md for project documentation', 'yellow');
}

if (require.main === module) {
  main();
}

module.exports = { checkEnvFile, checkRequiredEnvVars, generateSessionSecret };