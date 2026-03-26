#!/usr/bin/env node
/**
 * Self-executing setup via child_process
 * This script will execute the setup code directly
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('\n' + '='.repeat(70));
console.log('SETUP EXECUTION VIA NODE.JS child_process.execSync()');
console.log('='.repeat(70) + '\n');

try {
  // Get the execute-setup.js path
  const setupFile = path.join(__dirname, 'execute-setup.js');
  
  console.log('Executing: node ' + setupFile + '\n');
  
  // Execute using execSync - this will run in a child Node.js process
  const output = execSync(`node "${setupFile}"`, {
    cwd: __dirname,
    encoding: 'utf8',
    stdio: 'inherit',  // Show output directly
    windowsHide: false
  });
  
  // Post-execution verification
  console.log('\n' + '='.repeat(70));
  console.log('POST-EXECUTION VERIFICATION');
  console.log('='.repeat(70) + '\n');
  
  const libDir = path.join(__dirname, 'src', 'lib');
  const githubFile = path.join(libDir, 'github.ts');
  const endpointFile = path.join(__dirname, 'src', 'pages', 'api', 'contributions', '[username].ts');
  
  const libExists = fs.existsSync(libDir);
  const githubExists = fs.existsSync(githubFile);
  const endpointExists = fs.existsSync(endpointFile);
  
  console.log('✓ src/lib directory: ' + (libExists ? 'EXISTS' : 'MISSING'));
  console.log('✓ src/lib/github.ts: ' + (githubExists ? 'EXISTS' : 'MISSING'));
  console.log('✓ src/pages/api/contributions/[username].ts: ' + (endpointExists ? 'EXISTS' : 'MISSING'));
  
  if (libExists && githubExists && endpointExists) {
    console.log('\n✓ ALL FILES CREATED SUCCESSFULLY!');
    console.log('='.repeat(70) + '\n');
    process.exit(0);
  } else {
    console.log('\n✗ Some files were not created');
    console.log('='.repeat(70) + '\n');
    process.exit(1);
  }
  
} catch (error) {
  console.error('\n✗ SETUP FAILED');
  console.error('Error:', error.message);
  if (error.stdout) {
    console.error('Output:', error.stdout);
  }
  if (error.stderr) {
    console.error('Error output:', error.stderr);
  }
  console.log('='.repeat(70) + '\n');
  process.exit(1);
}
