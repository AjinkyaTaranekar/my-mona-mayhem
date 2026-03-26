/**
 * Direct Node.js Execution Wrapper
 * Executes the setup by loading and running execute-setup.js using require()
 */

console.log('\n╔════════════════════════════════════════════════════════╗');
console.log('║      DIRECT NODE.JS SETUP EXECUTION                    ║');
console.log('╚════════════════════════════════════════════════════════╝\n');

// Path to the setup file
const setupModule = require.resolve('./execute-setup.js');

// Remove from require cache to ensure fresh execution
delete require.cache[setupModule];

// Execute the setup by requiring it
try {
  require(setupModule);
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║     ✓ SETUP EXECUTED SUCCESSFULLY                      ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');
} catch (error) {
  console.error('\n✗ SETUP EXECUTION FAILED');
  console.error('Error:', error.message);
  if (error.stack) {
    console.error('Stack:', error.stack);
  }
  process.exit(1);
}
