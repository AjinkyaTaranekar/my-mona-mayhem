const fs = require('fs');
const path = require('path');

// Create the lib directory
const libDir = path.join(__dirname, 'src', 'lib');
fs.mkdirSync(libDir, { recursive: true });

// Create github.ts file
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
\tconst url = \\\`https://github.com/\\\${username}.contribs\\\`;
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
\t\t\tmessage: response.status === 404 ? 'User not found' : \\\`GitHub returned \\\${response.status}\\\`,
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

fs.writeFileSync(path.join(libDir, 'github.ts'), githubContent, 'utf8');

// Verify files were created
const libPath = path.join(libDir, 'github.ts');
if (fs.existsSync(libPath)) {
  console.log('✓ github.ts created successfully at ' + libPath);
  console.log('✓ File size: ' + fs.statSync(libPath).size + ' bytes');
} else {
  console.log('✗ Failed to create github.ts');
  process.exit(1);
}
`;
fs.writeFileSync(path.join(__dirname, 'create-github-lib.js'), githubContent, 'utf8');
