import type { APIRoute } from 'astro';
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
};
