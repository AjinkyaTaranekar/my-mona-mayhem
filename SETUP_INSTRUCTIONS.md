# Setup Instructions for GitHub Library

Due to environment limitations, you need to manually execute the following steps:

## Step 1: Create the lib directory
Run this command:
```bash
node F:\my-mona-mayhem\create-lib-dir.js
```

Or manually create the directory:
```bash
mkdir F:\my-mona-mayhem\src\lib
```

## Step 2: Create the github.ts file
Once the `src\lib` directory exists, copy the following content to `F:\my-mona-mayhem\src\lib\github.ts`:

```typescript
interface CacheEntry {
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
	const url = `https://github.com/${username}.contribs`;
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
			message: response.status === 404 ? 'User not found' : `GitHub returned ${response.status}`,
		};
	}

	const data = await response.json();

	// Cache the result
	cache.set(username, {
		data,
		expiresAt: now + CACHE_TTL,
	});

	return data;
}
```

## Status
✅ **[username].ts** - COMPLETED
⏳ **src\lib\github.ts** - WAITING for directory creation
