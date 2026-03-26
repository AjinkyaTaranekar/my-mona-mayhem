const fs = require('fs');
const path = require('path');

const filesToDelete = [
  'src/__init__.ts',
  'src/init.mjs',
  'src/pages/setup-trigger.astro'
];

for (const file of filesToDelete) {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
    console.log(`Deleted: ${file}`);
  }
}

// Delete all the setup scripts that were created
const setupScripts = [
  'trigger.js', 'start-setup.js', 'final-setup.js', 'execute-setup.js',
  'execute-direct.js', 'exec-setup.js', 'direct-setup.js',
  'create-github-lib.js', 'bootstrap.js', 'setup-inline.js',
  'setup-github-proxy.js', 'setup-files.js', 'self-execute.js',
  'run-setup.js', 'node-setup.js', 'run-execute-setup.js',
  'instant-setup.js', 'module-loader.js', 'create-lib-dir.js'
];

for (const script of setupScripts) {
  const fullPath = path.join(__dirname, script);
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
    console.log(`Deleted: ${script}`);
  }
}

console.log('Cleanup complete!');
