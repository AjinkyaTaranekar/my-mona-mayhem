const fs = require('fs');
const path = require('path');

// Immediately execute setup logic without any external processes
(function() {
  const projectRoot = path.resolve(__dirname);
  
  // Create src/lib directory
  const libDir = path.join(projectRoot, 'src', 'lib');
  if (!fs.existsSync(libDir)) {
    fs.mkdirSync(libDir, { recursive: true });
  }
  
  // Create github.ts
  const githubPath = path.join(libDir, 'github.ts');
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

  fs.writeFileSync(githubPath, githubCode, 'utf8');
  
  console.log('✓ Created directory: ' + libDir);
  console.log('✓ Created file: ' + githubPath);
  console.log('');
  
  // Verify
  if (fs.existsSync(libDir) && fs.existsSync(githubPath)) {
    console.log('✓ Setup completed successfully!');
    console.log('  - F:\\\\my-mona-mayhem\\\\src\\\\lib');
    console.log('  - F:\\\\my-mona-mayhem\\\\src\\\\lib\\\\github.ts');
  }
})();
