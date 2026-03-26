/**
 * This module directly executes the setup logic by loading setup.js
 * Using Node.js require() to load and execute directly in the current context
 */

// Clear the cache to ensure fresh execution
const setupPath = require.resolve('./setup.js');
delete require.cache[setupPath];

// Load and execute setup.js
console.log('Loading and executing setup.js...\n');
require('./setup.js');

// Verify the results
const fs = require('fs');
const path = require('path');

setTimeout(() => {
  const libDir = path.join(__dirname, 'src', 'lib');
  const githubFile = path.join(libDir, 'github.ts');
  const endpointFile = path.join(__dirname, 'src', 'pages', 'api', 'contributions', '[username].ts');
  
  console.log('\n' + '='.repeat(60));
  console.log('FINAL VERIFICATION');
  console.log('='.repeat(60));
  
  const results = {
    'src/lib directory': fs.existsSync(libDir),
    'src/lib/github.ts': fs.existsSync(githubFile),
    'src/pages/api/contributions/[username].ts': fs.existsSync(endpointFile)
  };
  
  console.log('');
  let allSuccess = true;
  for (const [name, exists] of Object.entries(results)) {
    console.log(`${exists ? '✓' : '✗'} ${name}`);
    if (!exists) allSuccess = false;
  }
  
  console.log('');
  if (allSuccess) {
    console.log('✓ ALL SETUP STEPS COMPLETED SUCCESSFULLY!');
  }
  console.log('='.repeat(60));
}, 100);
