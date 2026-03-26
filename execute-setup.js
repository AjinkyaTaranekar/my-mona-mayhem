#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const baseDir = 'F:\\my-mona-mayhem';
process.chdir(baseDir);

console.log('=== GitHub Proxy Setup ===\n');

// Step 1: Create lib directory
console.log('Step 1: Creating src/lib directory...');
const libDir = path.join(baseDir, 'src', 'lib');
try {
  fs.mkdirSync(libDir, { recursive: true });
  console.log(`✓ Directory created: ${libDir}\n`);
} catch (err) {
  console.error(`✗ Failed to create directory: ${err.message}`);
  process.exit(1);
}

// Step 2: Create github.ts file
console.log('Step 2: Creating src/lib/github.ts...');
const githubContent = `interface CacheEntry {
	data: unknown;
	expiresAt: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour in milliseconds

/**
 * Fetches GitHub contribution data for a username from the GitHub API.
 * Results are cached in-memory for 1 hour.
 */
export async function fetchContributions(username: string): Promise<unknown> {
	const now = Date.now();

	// Check if we have a valid cached entry
	if (cache.has(username)) {
		const entry = cache.get(username)!;
		if (entry.expiresAt > now) {
			return entry.data;
		}
		// Cache expired, remove it
		cache.delete(username);
	}

	// Fetch from GitHub
	const url = \`https://github.com/\${username}.contribs\`;
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), 5000); // 5-second timeout

	let response;
	try {
		response = await fetch(url, {
			signal: controller.signal,
			headers: {
				'User-Agent': 'Mona-Mayhem-App',
			},
		});
	} finally {
		clearTimeout(timeoutId);
	}

	if (!response.ok) {
		// GitHub returns appropriate status codes
		throw {
			status: response.status,
			message: response.status === 404 ? 'User not found' : \`GitHub returned \${response.status}\`,
		};
	}

	const data = await response.json();

	// Cache the result
	cache.set(username, {
		data,
		expiresAt: now + CACHE_TTL,
	});

	return data;
}`;

const githubPath = path.join(libDir, 'github.ts');
try {
  fs.writeFileSync(githubPath, githubContent, 'utf8');
  console.log(`✓ Created: ${githubPath}\n`);
} catch (err) {
  console.error(`✗ Failed to create github.ts: ${err.message}`);
  process.exit(1);
}

// Step 3: Update contributions endpoint
console.log('Step 3: Updating src/pages/api/contributions/[username].ts...');
const endpointContent = `import type { APIRoute } from 'astro';
import { fetchContributions } from '../../../lib/github';

export const prerender = false;

// Validate username format: 1-39 characters, alphanumeric and hyphens only
function isValidUsername(username: string): boolean {
	if (!username || username.length < 1 || username.length > 39) return false;
	// GitHub usernames: letters, numbers, and single hyphens (no leading/trailing hyphens)
	return /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?$/.test(username);
}

export const GET: APIRoute = async ({ params }) => {
	const { username } = params;

	// Validate username format
	if (!isValidUsername(username)) {
		return new Response(
			JSON.stringify({
				error: 'Invalid username format. Usernames must be 1-39 characters, alphanumeric and hyphens only.',
			}),
			{
				status: 400,
				headers: { 'Content-Type': 'application/json' },
			}
		);
	}

	try {
		const data = await fetchContributions(username);
		return new Response(JSON.stringify(data), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (error) {
		const err = error as any;
		// Handle GitHub API errors
		if (err.status === 404) {
			return new Response(JSON.stringify({ error: 'User not found' }), {
				status: 404,
				headers: { 'Content-Type': 'application/json' },
			});
		}
		if (err.status >= 500) {
			return new Response(JSON.stringify({ error: 'GitHub service unavailable' }), {
				status: 503,
				headers: { 'Content-Type': 'application/json' },
			});
		}
		// Network or timeout errors
		return new Response(
			JSON.stringify({ error: 'Failed to fetch contribution data' }),
			{
				status: 500,
				headers: { 'Content-Type': 'application/json' },
			}
		);
	}
};`;

const endpointPath = path.join(baseDir, 'src', 'pages', 'api', 'contributions', '[username].ts');
try {
  fs.writeFileSync(endpointPath, endpointContent, 'utf8');
  console.log(`✓ Updated: ${endpointPath}\n`);
} catch (err) {
  console.error(`✗ Failed to update endpoint: ${err.message}`);
  process.exit(1);
}

console.log('=== Setup Complete ===');
console.log('✓ All files created/updated successfully!');
console.log('\nFiles created:');
console.log(`  - ${githubPath}`);
console.log(`  - ${endpointPath}`);
