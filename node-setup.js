/**
 * Direct Node.js setup execution using fs module
 * No shell, bash, npm, or PowerShell involved
 */

const fs = require('fs');
const path = require('path');

// Setup function
function setup() {
  const projectRoot = path.resolve(__dirname);
  
  console.log('Node.js Direct Setup Execution');
  console.log('==============================\n');
  console.log('Project root:', projectRoot);
  console.log('');
  
  // Step 1: Create src/lib directory
  const libDir = path.join(projectRoot, 'src', 'lib');
  console.log('Step 1: Creating directory structure');
  console.log('Target:', libDir);
  
  try {
    if (!fs.existsSync(libDir)) {
      fs.mkdirSync(libDir, { recursive: true });
      console.log('✓ Directory created successfully\n');
    } else {
      console.log('✓ Directory already exists\n');
    }
  } catch (error) {
    console.error('✗ Failed to create directory:', error.message);
    process.exit(1);
  }
  
  // Step 2: Create github.ts file
  const githubPath = path.join(libDir, 'github.ts');
  console.log('Step 2: Creating github.ts file');
  console.log('Target:', githubPath);
  
  const githubContent = `interface CacheEntry {
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
    fs.writeFileSync(githubPath, githubContent, 'utf8');
    console.log('✓ File created successfully');
    console.log('  Size:', githubContent.length, 'bytes\n');
  } catch (error) {
    console.error('✗ Failed to create file:', error.message);
    process.exit(1);
  }
  
  // Step 3: Verify the endpoint file
  const endpointPath = path.join(projectRoot, 'src', 'pages', 'api', 'contributions', '[username].ts');
  console.log('Step 3: Verifying endpoint file');
  console.log('Target:', endpointPath);
  
  try {
    if (fs.existsSync(endpointPath)) {
      const stats = fs.statSync(endpointPath);
      console.log('✓ Endpoint file exists');
      console.log('  Size:', stats.size, 'bytes\n');
    } else {
      console.error('✗ Endpoint file not found - this may need to be created\n');
    }
  } catch (error) {
    console.error('✗ Error checking endpoint file:', error.message);
  }
  
  // Final verification
  console.log('Final Verification');
  console.log('==================');
  const libDirExists = fs.existsSync(libDir);
  const githubFileExists = fs.existsSync(githubPath);
  const endpointExists = fs.existsSync(endpointPath);
  
  console.log('✓ src/lib directory:', libDirExists ? 'EXISTS' : 'MISSING');
  console.log('✓ src/lib/github.ts:', githubFileExists ? 'EXISTS' : 'MISSING');
  console.log('✓ src/pages/api/contributions/[username].ts:', endpointExists ? 'EXISTS' : 'MISSING');
  console.log('');
  
  if (libDirExists && githubFileExists && endpointExists) {
    console.log('✓ Setup completed successfully!');
    console.log('');
    console.log('All required files have been created:');
    console.log('  1. Directory: F:\\my-mona-mayhem\\src\\lib');
    console.log('  2. File: F:\\my-mona-mayhem\\src\\lib\\github.ts');
    console.log('  3. File: F:\\my-mona-mayhem\\src\\pages\\api\\contributions\\[username].ts');
    return 0;
  } else {
    console.error('✗ Setup incomplete - some files are missing');
    return 1;
  }
}

// Execute
const exitCode = setup();
process.exit(exitCode);
