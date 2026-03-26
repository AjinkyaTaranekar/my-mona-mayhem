const { execSync } = require('child_process');
const path = require('path');

try {
  const setupFile = path.join(__dirname, 'setup-inline.js');
  const result = execSync(`node "${setupFile}"`, {
    cwd: __dirname,
    encoding: 'utf8',
    stdio: 'inherit'
  });
  
  process.exit(0);
} catch (error) {
  console.error('Setup failed:', error);
  process.exit(1);
}
