// Execute setup using Node.js child_process
const { execFileSync } = require('child_process');
const path = require('path');

const setupScript = path.join(__dirname, 'node-setup.js');

try {
  console.log('Executing Node.js setup script...\n');
  
  // Use execFileSync to run node directly
  execFileSync('node', [setupScript], {
    cwd: __dirname,
    stdio: 'inherit'  // Show all output directly
  });
  
  process.exit(0);
} catch (error) {
  console.error('\nSetup execution failed:', error.message);
  process.exit(1);
}
