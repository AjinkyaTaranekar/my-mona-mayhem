const fs = require('fs');
const path = require('path');

// Create the lib directory
const libDir = path.join(__dirname, 'src', 'lib');
fs.mkdirSync(libDir, { recursive: true });

// Create github.ts file
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
	const url = \\\`https://github.com/\\\${username}.contribs\\\`;
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
			message: response.status === 404 ? 'User not found' : \\\`GitHub returned \\\${response.status}\\\`,
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

fs.writeFileSync(path.join(libDir, 'github.ts'), githubContent, 'utf8');

// Verify files were created
const libPath = path.join(libDir, 'github.ts');
if (fs.existsSync(libPath)) {
  console.log('✓ github.ts created successfully at ' + libPath);
  console.log('✓ File size: ' + fs.statSync(libPath).size + ' bytes');
  console.log('✓ Files created in: ' + libDir);
} else {
  console.log('✗ Failed to create github.ts');
  process.exit(1);
}
