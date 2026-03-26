/**
 * Direct execution of setup.js using Node.js require()
 * This script loads the setup.js file directly without shell commands
 */

const Module = require('module');
const path = require('path');
const originalRequire = Module.prototype.require;

// Override console to add status indicators
const originalLog = console.log;
console.log = function(...args) {
  originalLog.apply(console, args);
};

// Get absolute path
const setupPath = path.resolve(__dirname, 'setup.js');

console.log('='.repeat(60));
console.log('SETUP EXECUTION - Node.js Direct Loader');
console.log('='.repeat(60));
console.log('Setup file:', setupPath);
console.log('Working directory:', __dirname);
console.log('');

// Load and execute setup.js
try {
  delete require.cache[setupPath];
  require(setupPath);
  
  // Verify the results
  const fs = require('fs');
  console.log('');
  console.log('='.repeat(60));
  console.log('VERIFICATION');
  console.log('='.repeat(60));
  
  const libDir = path.join(__dirname, 'src', 'lib');
  const githubFile = path.join(libDir, 'github.ts');
  const endpointFile = path.join(__dirname, 'src', 'pages', 'api', 'contributions', '[username].ts');
  
  console.log(`✓ Library directory exists: ${fs.existsSync(libDir)}`);
  console.log(`✓ github.ts exists: ${fs.existsSync(githubFile)}`);
  console.log(`✓ [username].ts exists: ${fs.existsSync(endpointFile)}`);
  
  if (fs.existsSync(githubFile)) {
    const githubStats = fs.statSync(githubFile);
    console.log(`  - Size: ${githubStats.size} bytes`);
  }
  
  if (fs.existsSync(endpointFile)) {
    const endpointStats = fs.statSync(endpointFile);
    console.log(`  - Size: ${endpointStats.size} bytes`);
  }
  
  console.log('');
  console.log('='.repeat(60));
  console.log('SUCCESS!');
  console.log('='.repeat(60));
  
  process.exit(0);
} catch (error) {
  console.error('');
  console.error('='.repeat(60));
  console.error('ERROR DURING SETUP');
  console.error('='.repeat(60));
  console.error('Message:', error.message);
  console.error('Stack:', error.stack);
  console.error('='.repeat(60));
  process.exit(1);
}
