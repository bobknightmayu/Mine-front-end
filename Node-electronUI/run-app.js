#!/usr/bin/env node
/**
 * Application Entry Point
 * Routes to Electron (desktop) or CLI mode based on environment
 */

const path = require('path');
const { spawn } = require('child_process');

// Detect headless environment
const isHeadless = !process.env.DISPLAY || process.env.DISPLAY === '';

if (isHeadless) {
  console.log('\n🖥️  Headless environment detected - Electron GUI not available\n');
  console.log('📝 Available CLI tools:');
  console.log('   npm run cli:challenge -- --community "example"');
  console.log('   npm run cli:verify -- --pubkey xxx --message yyy --signature zzz');
  console.log('   npm run cli:batch -- --file batch.json --action verify');
  console.log('   npm run cli:report -- --type user_registry --format json');
  console.log('\n✨ For GUI mode, run this on a machine with a display:');
  console.log('   npm run dev\n');
  
  // Exit gracefully - user should use CLI tools instead
  process.exit(0);
} else {
  // Desktop environment - launch Electron
  console.log('🚀 Desktop environment detected - launching Electron...\n');
  const electronPath = require.resolve('electron/dist/electron');
  spawn(electronPath, [__dirname], { stdio: 'inherit' });
}
