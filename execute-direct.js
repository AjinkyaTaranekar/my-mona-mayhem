#!/usr/bin/env node

/**
 * Direct Node.js execution of setup
 * Uses child_process.execFile to run Node directly
 */

const { execFileSync } = require('child_process');
const path = require('path');
const fs = require('fs');

try {
  console.log('Starting setup execution...\n');
  
  const setupPath = path.join(__dirname, 'setup.js');
  
  // Execute setup.js directly with Node.js
  const output = execFileSync('node', [setupPath], {
    cwd: __dirname,
    encoding: 'utf8',
    stdio: 'inherit'
  });
  
  console.log('\n✓ Setup completed successfully!');
  
  // Verify the files were created
  const libDir = path.join(__dirname, 'src', 'lib');
  const githubFile = path.join(libDir, 'github.ts');
  const endpointFile = path.join(__dirname, 'src', 'pages', 'api', 'contributions', '[username].ts');
  
  console.log('\nVerifying created files:');
  console.log('  Library directory:', fs.existsSync(libDir) ? '✓ exists' : '✗ missing');
  console.log('  github.ts file:', fs.existsSync(githubFile) ? '✓ exists' : '✗ missing');
  console.log('  [username].ts file:', fs.existsSync(endpointFile) ? '✓ exists' : '✗ missing');
  
  process.exit(0);
} catch (error) {
  console.error('\n✗ Setup failed:', error.message);
  if (error.stdout) console.error('STDOUT:', error.stdout);
  if (error.stderr) console.error('STDERR:', error.stderr);
  process.exit(1);
}
