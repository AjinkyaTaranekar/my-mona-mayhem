// Direct inline execution of setup logic
const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname);

console.log('\n' + '='.repeat(60));
console.log('DIRECT NODE.JS SETUP EXECUTION');
console.log('='.repeat(60));
console.log('');

// Step 1: Create src/lib directory
const libDir = path.join(projectRoot, 'src', 'lib');
console.log('1️⃣  Creating src/lib directory...');

try {
  if (!fs.existsSync(libDir)) {
    fs.mkdirSync(libDir, { recursive: true });
    console.log('   ✓ Created: ' + libDir);
  } else {
    console.log('   ✓ Already exists: ' + libDir);
  }
} catch (error) {
  console.error('   ✗ Error:', error.message);
  process.exit(1);
}

// Step 2: Create github.ts
const githubPath = path.join(libDir, 'github.ts');
console.log('\n2️⃣  Creating src/lib/github.ts...');

const githubCode = `interface CacheEntry {
\tdata: unknown;
\texpiresAt: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour in milliseconds

/**
 * Fetches GitHub contribution data for a username from the GitHub API.
 * Results are cached in-memory for 1 hour.
 */
export async function fetchContributions(username: string): Promise<unknown> {
\tconst now = Date.now();

\t// Check if we have a valid cached entry
\tif (cache.has(username)) {
\t\tconst entry = cache.get(username)!;
\t\tif (entry.expiresAt > now) {
\t\t\treturn entry.data;
\t\t}
\t\t// Cache expired, remove it
\t\tcache.delete(username);
\t}

\t// Fetch from GitHub
\tconst url = \`https://github.com/\${username}.contribs\`;
\tconst controller = new AbortController();
\tconst timeoutId = setTimeout(() => controller.abort(), 5000); // 5-second timeout

\tlet response;
\ttry {
\t\tresponse = await fetch(url, {
\t\t\tsignal: controller.signal,
\t\t\theaders: {
\t\t\t\t'User-Agent': 'Mona-Mayhem-App',
\t\t\t},
\t\t});
\t} finally {
\t\tclearTimeout(timeoutId);
\t}

\tif (!response.ok) {
\t\t// GitHub returns appropriate status codes
\t\tthrow {
\t\t\tstatus: response.status,
\t\t\tmessage: response.status === 404 ? 'User not found' : \`GitHub returned \${response.status}\`,
\t\t};
\t}

\tconst data = await response.json();

\t// Cache the result
\tcache.set(username, {
\t\tdata,
\t\texpiresAt: now + CACHE_TTL,
\t});

\treturn data;
}`;

try {
  fs.writeFileSync(githubPath, githubCode, 'utf8');
  console.log('   ✓ Created: ' + githubPath);
  console.log('   ✓ File size: ' + githubCode.length + ' bytes');
} catch (error) {
  console.error('   ✗ Error:', error.message);
  process.exit(1);
}

// Step 3: Verify endpoint file
const endpointPath = path.join(projectRoot, 'src', 'pages', 'api', 'contributions', '[username].ts');
console.log('\n3️⃣  Verifying src/pages/api/contributions/[username].ts...');

try {
  if (fs.existsSync(endpointPath)) {
    const stats = fs.statSync(endpointPath);
    console.log('   ✓ File exists: ' + endpointPath);
    console.log('   ✓ File size: ' + stats.size + ' bytes');
  } else {
    console.log('   ⚠️  File not found - may need creation');
  }
} catch (error) {
  console.error('   ✗ Error:', error.message);
}

// Final summary
console.log('\n' + '='.repeat(60));
console.log('VERIFICATION SUMMARY');
console.log('='.repeat(60));

const results = {
  'src/lib directory': fs.existsSync(libDir),
  'src/lib/github.ts': fs.existsSync(githubPath),
  'src/pages/api/contributions/[username].ts': fs.existsSync(endpointPath)
};

let allSuccess = true;
for (const [name, exists] of Object.entries(results)) {
  console.log((exists ? '✓' : '✗') + ' ' + name);
  if (!exists) allSuccess = false;
}

console.log('');
if (allSuccess) {
  console.log('✓ SETUP COMPLETED SUCCESSFULLY!');
  console.log('');
  console.log('All required files have been created:');
  console.log('  • F:\\my-mona-mayhem\\src\\lib (directory)');
  console.log('  • F:\\my-mona-mayhem\\src\\lib\\github.ts');
  console.log('  • F:\\my-mona-mayhem\\src\\pages\\api\\contributions\\[username].ts');
  console.log('');
  console.log('='.repeat(60));
  process.exit(0);
} else {
  console.log('✗ SETUP FAILED - Some files are missing');
  console.log('='.repeat(60));
  process.exit(1);
}
