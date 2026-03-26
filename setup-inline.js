const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '');

// Create the lib directory
const libDir = path.join(baseDir, 'src', 'lib');
if (!fs.existsSync(libDir)) {
  fs.mkdirSync(libDir, { recursive: true });
  console.log('✓ Created directory:', libDir);
} else {
  console.log('  Directory already exists:', libDir);
}

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

const githubPath = path.join(libDir, 'github.ts');
fs.writeFileSync(githubPath, githubContent, 'utf8');
console.log('✓ Created file:', githubPath);

// Ensure the contributions API directory exists
const contributionsDir = path.join(baseDir, 'src', 'pages', 'api', 'contributions');
if (!fs.existsSync(contributionsDir)) {
  fs.mkdirSync(contributionsDir, { recursive: true });
  console.log('✓ Created directory:', contributionsDir);
}

// Modify the contributions endpoint file
const endpointPath = path.join(contributionsDir, '[username].ts');
const endpointContent = `import type { APIRoute } from 'astro';
import { fetchContributions } from '../../../lib/github';

export const prerender = false;

// Validate username format: 1-39 characters, alphanumeric and hyphens only
function isValidUsername(username: string): boolean {
\tif (!username || username.length < 1 || username.length > 39) return false;
\t// GitHub usernames: letters, numbers, and single hyphens (no leading/trailing hyphens)
\treturn /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?$/.test(username);
}

export const GET: APIRoute = async ({ params }) => {
\tconst { username } = params;

\t// Validate username format
\tif (!isValidUsername(username)) {
\t\treturn new Response(
\t\t\tJSON.stringify({
\t\t\t\terror: 'Invalid username format. Usernames must be 1-39 characters, alphanumeric and hyphens only.',
\t\t\t}),
\t\t\t{
\t\t\t\tstatus: 400,
\t\t\t\theaders: { 'Content-Type': 'application/json' },
\t\t\t}
\t\t);
\t}

\ttry {
\t\tconst data = await fetchContributions(username);
\t\treturn new Response(JSON.stringify(data), {
\t\t\tstatus: 200,
\t\t\theaders: { 'Content-Type': 'application/json' },
\t\t});
\t} catch (error) {
\t\tconst err = error as any;
\t\t// Handle GitHub API errors
\t\tif (err.status === 404) {
\t\t\treturn new Response(JSON.stringify({ error: 'User not found' }), {
\t\t\t\tstatus: 404,
\t\t\t\theaders: { 'Content-Type': 'application/json' },
\t\t\t});
\t\t}
\t\tif (err.status >= 500) {
\t\t\treturn new Response(JSON.stringify({ error: 'GitHub service unavailable' }), {
\t\t\t\tstatus: 503,
\t\t\t\theaders: { 'Content-Type': 'application/json' },
\t\t\t});
\t\t}
\t\t// Network or timeout errors
\t\treturn new Response(
\t\t\tJSON.stringify({ error: 'Failed to fetch contribution data' }),
\t\t\t{
\t\t\t\tstatus: 500,
\t\t\t\theaders: { 'Content-Type': 'application/json' },
\t\t\t}
\t\t);
\t}
};`;

fs.writeFileSync(endpointPath, endpointContent, 'utf8');
console.log('✓ Updated file:', endpointPath);

console.log('\n✓ All files created/updated successfully!');
