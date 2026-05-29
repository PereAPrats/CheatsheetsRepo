# Dev Cheatsheets PWA

A mobile-first progressive web app for managing personal developer cheatsheets. Organize code snippets, commands, and reference notes in collections — all stored in PostgreSQL and accessible offline.

## Features

- **Collections** — Group snippets by topic (Git, Docker, SQL, etc.)
- **Entries & Snippets** — Each collection contains entries with labeled code snippets
- **Search** — Full-text search across collections, entries, and snippet content
- **PWA** — Installable on desktop and mobile; works offline via service worker
- **Dark mode** — System-aware theme toggle
- **Docker Compose** — One-command setup with PostgreSQL + API + Nginx

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Vite + Svelte 4 + TypeScript + Tailwind CSS 3 |
| Backend | Express.js (ESM) |
| Database | PostgreSQL 16 (via `pg`) |
| PWA | vite-plugin-pwa (auto-update) |
| Infra | Docker Compose (3 containers) |

## Quick Start

### With Docker (recommended)

```bash
docker compose up --build
```

The app will be available at `http://localhost:8080`.

### Without Docker

1. Start a PostgreSQL instance and create a database:

```bash
createdb cheatsheets
```

2. Create the `cheatsheet_data` table manually or run the init script:

```bash
docker/init-db.sh  # requires psql with appropriate credentials
```

3. Install dependencies and start the dev servers:

```bash
npm install
npm run dev        # frontend on :8080
node server.js     # backend on :3001
```

Set these environment variables (or create a `.env` file):

```
DATABASE_URL=postgresql://user:password@localhost:5432/cheatsheets
PORT=3001
```

## API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/data` | Get cheatsheet data (JSON) |
| PUT | `/api/data` | Save cheatsheet data (JSON body) |

## Project Structure

```
├── docker/
│   ├── init-db.sh          # PostgreSQL schema init
│   └── nginx.conf          # Nginx reverse proxy config
├── public/
│   ├── content/index.json  # Seed data
│   └── favicon.svg         # App icon
├── src/
│   ├── lib/
│   │   ├── components/     # Svelte components
│   │   ├── stores/         # Svelte stores (data, navigation, theme, ui)
│   │   ├── types/          # TypeScript interfaces
│   │   └── utils/          # API client utilities
│   ├── App.svelte          # Root component
│   └── main.ts             # Entry point
├── server.js               # Express API server
├── docker-compose.yml      # Docker orchestration
├── Dockerfile              # Multi-stage build
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
