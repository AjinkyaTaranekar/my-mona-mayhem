#!/usr/bin/env node

/**
 * Direct Node.js execution of setup.js
 * Loads and executes the setup.js file directly without shell commands
 */

const fs = require('fs');
const path = require('path');
const Module = require('module');

// Get the absolute path to setup.js
const setupPath = path.join(__dirname, 'setup.js');

// Execute the setup.js file directly
try {
  console.log('Executing setup.js directly...');
  require(setupPath);
  console.log('\n✓ Setup completed successfully!');
  process.exit(0);
} catch (error) {
  console.error('\n✗ Setup failed:', error);
  process.exit(1);
}
