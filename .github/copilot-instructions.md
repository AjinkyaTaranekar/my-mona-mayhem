# Copilot Instructions for Mona Mayhem

## Project Overview

**Mona Mayhem** is an Astro-based workshop template for building a retro arcade-themed GitHub contribution comparison app. This repository is designed to teach GitHub Copilot workflows and should remain educational in nature — prioritize clarity and learning outcomes over production polish.

## Build, Test & Dev Commands

```bash
npm run dev       # Start dev server (http://localhost:3000)
npm run build     # Production build (outputs to dist/)
npm run preview   # Preview production build locally
npm run astro     # Direct Astro CLI access
```

**Note:** This project does not have automated tests or linting configured — focus on manual verification via the dev server.

## Architecture

### Technology Stack
- **Framework**: Astro v5 (full-stack, server-side rendering)
- **Runtime**: Node.js with @astrojs/node adapter (standalone mode)
- **Language**: TypeScript with strict mode
- **Font**: Press Start 2P (retro gaming aesthetic)
- **Data Source**: GitHub's contribution graph (via `.contribs` URLs)

### Directory Structure
```
src/
  pages/
    index.astro              # Main page (landing, UI shell)
    api/
      contributions/
        [username].ts        # Dynamic API endpoint for GitHub contribution data
```

### Key Architectural Decisions
- **Server-side rendering**: Output mode is set to `server` — all pages render server-side
- **Dynamic API routes**: Use Astro's file-based routing with `[username].ts` for dynamic segments
- **No pre-rendering for API**: Set `export const prerender = false;` on API routes to prevent static generation
- **Single-page structure**: The workshop starts with minimal scaffolding — students build incrementally

### Data Flow
1. User visits the main page and enters two GitHub usernames
2. Frontend submits requests to `/api/contributions/[username]`
3. API endpoint fetches contribution data (students implement this)
4. Frontend renders a comparison visualization

## Key Conventions

### Naming & Structure
- **Pages**: Astro components in `src/pages/` map directly to routes (e.g., `index.astro` → `/`)
- **API routes**: Use bracket syntax for dynamic segments: `[username].ts` becomes `/api/contributions/[username]`
- **Parameter access**: Use `params` from the APIRoute context (e.g., `params.username`)

### TypeScript
- Uses `astro/tsconfigs/strict` — enforce strict type checking
- API routes use `APIRoute` type from `astro` for handler definitions
- Response format: Use `new Response(JSON.stringify(...), { status, headers })`

### JSON Responses
- Always set `Content-Type: application/json` header explicitly
- Use consistent error format: `{ error: "message" }`
- HTTP status codes: `200` for success, `404` for not found, `500` for errors, `501` for not implemented

### Astro File Format
- **Frontmatter** (top, between `---` markers): TypeScript/imports
- **Template** (bottom): HTML markup
- Keep frontmatter minimal when possible

## Common Tasks

### Adding a New Page
```astro
---
// src/pages/new-page.astro
---

<html>
  <body>
    <h1>New Page</h1>
  </body>
</html>
```

### Implementing an API Endpoint
```typescript
// src/pages/api/route-name.ts
import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  // Implementation here
  return new Response(JSON.stringify({ data: 'value' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
```

### Dynamic API Routes
- File: `[paramName].ts` where `paramName` becomes `params.paramName` in the handler

## Development Tips

- **Local testing**: Use the dev server to test changes immediately
- **Styling**: Add `<style>` tags in Astro components or create global styles in a `src/styles/` directory (optional)
- **Browser compatibility**: The retro Press Start 2P font may not render on all systems — test in actual browsers
- **GitHub API**: Be aware of rate limits when fetching real contribution data

## Helpful Resources

- [Astro Documentation](https://docs.astro.build/)
- [Astro API Routes Guide](https://docs.astro.build/en/guides/endpoints/)
- Workshop guides in `./workshop/` directory (00-overview.md through 06-bonus.md)
