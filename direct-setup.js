// This is a self-executing Node.js module that sets up the project files
const fs = require('fs');
const path = require('path');

function runSetup() {
  const baseDir = path.dirname(__filename);
  
  console.log('Starting setup...\n');
  
  // Create the lib directory
  const libDir = path.join(baseDir, 'src', 'lib');
  try {
    if (!fs.existsSync(libDir)) {
      fs.mkdirSync(libDir, { recursive: true });
      console.log('✓ Created directory: ' + libDir);
    } else {
      console.log('✓ Directory already exists: ' + libDir);
    }
  } catch (err) {
    console.error('✗ Failed to create lib directory:', err.message);
    return false;
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
  try {
    fs.writeFileSync(githubPath, githubContent, 'utf8');
    console.log('✓ Created file: ' + githubPath);
    console.log('  Size: ' + githubContent.length + ' bytes');
  } catch (err) {
    console.error('✗ Failed to create github.ts:', err.message);
    return false;
  }

  // Ensure contributions API directory exists
  const contributionsDir = path.join(baseDir, 'src', 'pages', 'api', 'contributions');
  try {
    if (!fs.existsSync(contributionsDir)) {
      fs.mkdirSync(contributionsDir, { recursive: true });
      console.log('✓ Created directory: ' + contributionsDir);
    }
  } catch (err) {
    console.error('✗ Failed to create contributions directory:', err.message);
    return false;
  }

  // Create the contributions endpoint file
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

  const endpointPath = path.join(contributionsDir, '[username].ts');
  try {
    fs.writeFileSync(endpointPath, endpointContent, 'utf8');
    console.log('✓ Created file: ' + endpointPath);
    console.log('  Size: ' + endpointContent.length + ' bytes');
  } catch (err) {
    console.error('✗ Failed to create endpoint file:', err.message);
    return false;
  }

  console.log('\n✓ All files created successfully!\n');
  
  // Verification
  console.log('Verification:');
  console.log('  src/lib directory exists:', fs.existsSync(libDir));
  console.log('  src/lib/github.ts exists:', fs.existsSync(githubPath));
  console.log('  src/pages/api/contributions/[username].ts exists:', fs.existsSync(endpointPath));
  
  return true;
}

// Execute setup
const success = runSetup();
process.exit(success ? 0 : 1);
