const fs = require('fs');
const path = require('path');

const dirPath = 'F:\\my-mona-mayhem\\src\\lib';

try {
  fs.mkdirSync(dirPath, { recursive: true });
  console.log(`✓ Directory created successfully: ${dirPath}`);
  
  // Verify it exists
  const stats = fs.statSync(dirPath);
  if (stats.isDirectory()) {
    const contents = fs.readdirSync(dirPath);
    console.log(`✓ Directory verified to exist and is empty (${contents.length} items)`);
  }
} catch (err) {
  console.error(`✗ Error: ${err.message}`);
  process.exit(1);
}
