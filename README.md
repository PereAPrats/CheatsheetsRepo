# Dev Cheatsheets PWA

A mobile-first progressive web app for managing personal developer cheatsheets. Multi-user with JWT authentication — each user has their own isolated cheatsheet collections stored in PostgreSQL.

## Features

- **Auth** — Register and log in with username + email + password
- **Collections** — Group snippets by topic (Git, Docker, SQL, etc.)
- **Entries & Snippets** — Each collection contains entries with labeled code snippets
- **Search** — Full-text search across collections, entries, and snippet content
- **Profile settings** — Change name, email, and password
- **PWA** — Installable on desktop and mobile; works offline via service worker
- **Dark mode** — System-aware theme toggle
- **Docker Compose** — One-command setup with PostgreSQL + API + Nginx

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Vite + Svelte 4 + TypeScript + Tailwind CSS 3 |
| Backend | Express.js (ESM) |
| Database | PostgreSQL 16 (via `pg`) |
| Auth | bcryptjs + jsonwebtoken (JWT, 30-day expiry) |
| PWA | vite-plugin-pwa (auto-update) |
| Infra | Docker Compose (3 containers) |

## Quick Start

### With Docker (recommended)

```bash
docker compose up --build
```

The app will be available at `http://localhost:8080`. Create an account to get started.

### Without Docker

1. Start a PostgreSQL instance and create a database:

```bash
createdb cheatsheets
```

2. Create the app user and table:

```bash
docker/init-db.sh  # requires psql with appropriate credentials
```

3. Install dependencies and start the dev servers:

```bash
npm install
npm run dev        # frontend on :8080
node server.js     # backend on :3001
```

Copy `.env.example` to `.env` and configure the variables:

```bash
cp .env.example .env
```

## API Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Register (name, username, email, password) |
| POST | `/api/auth/login` | No | Login (username, password) → JWT |
| GET | `/api/auth/me` | Yes | Get current user profile |
| PUT | `/api/auth/profile` | Yes | Update name and/or email |
| PUT | `/api/auth/password` | Yes | Change password |
| GET | `/api/data` | Yes | Get user's cheatsheet data (seeded on first access) |
| PUT | `/api/data` | Yes | Save user's cheatsheet data |

## Project Structure

```
├── docker/
│   ├── init-db.sh          # PostgreSQL schema init (users table)
│   └── nginx.conf          # Nginx reverse proxy config
├── public/
│   ├── content/index.json  # Seed data
│   └── favicon.svg         # App icon
├── src/
│   ├── lib/
│   │   ├── components/     # Svelte components (auth forms, settings, cards, etc.)
│   │   ├── stores/         # Svelte stores (auth, data, navigation, theme, ui)
│   │   ├── types/          # TypeScript interfaces
│   │   └── utils/          # API client utilities
│   ├── App.svelte          # Root component (auth gate)
│   └── main.ts             # Entry point
├── server.js               # Express API server (auth + data routes)
├── docker-compose.yml      # Docker orchestration
├── Dockerfile              # Multi-stage build (frontend + api)
├── .env.example            # Environment variable template
├── vite.config.js          # Vite + PWA configuration
└── package.json
```

## Development

### Commands

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server (port 8080) |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build |

### Ports

| Service | Port |
|---|---|
| Frontend (dev) | 8080 |
| Frontend (docker) | 8080 (Nginx) |
| API | 3001 (internal) |
| PostgreSQL | 5432 |

### Data Reset

```bash
docker compose down -v && docker compose up --build
```

## License

MIT
