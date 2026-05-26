# agents.md

## Project Overview
Build a modern, mobile-first PWA for personal developer cheatsheets (Linux, Git, languages). The app is offline-capable, installable, and optimized for low resource usage. UI must be modern with heavy rounded corners (`rounded-2xl`+), smooth transitions, and a Dark/Light mode toggle.

## Tech Stack
- Frontend: Vite + Svelte + Tailwind CSS
- PWA: vite-plugin-pwa
- Data: File-based Markdown/JSON (default). SQLite optional later.
- Infra: Dockerized, served by Nginx.

## Port Policy (Mandatory)
- UI must run on port 8080.
- Never use port 3000.
- Docker and dev server configs must bind to 8080.

## Architecture Notes
- UI-first, static content driven.
- Content files in `content/` with categories and tags.
- Use minimal runtime dependencies.
- No backend required for initial MVP unless SQLite is enabled.

## Project Structure (Target)
- `src/`
  - `lib/`
    - `components/`
    - `stores/`
    - `utils/`
  - `routes/` (if using SvelteKit) OR `pages/` for SPA
  - `assets/`
- `content/`
  - `linux/`
  - `git/`
  - `languages/`
- `public/`
- `docker/`
  - `nginx.conf`
- `Dockerfile`
- `docker-compose.yml`

## Coding Standards
- Use TypeScript where supported.
- Keep components small and focused.
- Tailwind only; no custom CSS unless necessary.
- Use `rounded-2xl` or higher on cards and inputs.
- Use CSS variables for theme colors.
- Prefer semantic HTML and a11y attributes.
- Avoid heavy libraries; keep bundle small.

## UI Requirements
- Mobile-first layout
- Cards with rounded corners, soft shadows
- Smooth transitions for hover/tap/route changes
- Dark/Light toggle with persistent preference
- Search/filter UI for cheatsheets
- Offline and installable (PWA)

## Data Format (Default)
Use Markdown files with frontmatter or JSON:
- title
- category
- tags
- description
- commands/snippets list

## Implementation Tasks (Follow Order)
1. Scaffold Vite + Svelte + Tailwind (bind dev server to 8080)
2. Configure PWA plugin + manifest/icons
3. Build layout: header, navigation, main content grid
4. Implement Dark/Light mode toggle and persistence
5. Implement content loader for Markdown/JSON
6. Build pages: Home, Category, Detail, Settings
7. Add search and tag filters
8. Dockerize with Nginx (serve on 8080)
9. Validate PWA: offline, install flow, caching

## Docker Requirements
- Multi-stage build
- Nginx serves `/dist`
- Cache static assets
- `docker-compose.yml` maps host 8080 to container 8080

## Commands (Expected)
- `npm install`
- `npm run dev -- --host --port 8080`
- `npm run build`
- `docker compose up --build`

## Output Expectations
- Clean, minimal UI
- Fast performance, small bundle
- Fully installable PWA
- Works offline after first load
