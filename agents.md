# agents.md

## Project Overview
A mobile-first PWA for personal developer cheatsheets. Multi-user app with PostgreSQL, Express API, Nginx reverse proxy, and JWT authentication.

## Tech Stack
- Frontend: Vite + Svelte 4 + Tailwind CSS 3 + TypeScript
- Backend: Express.js (ESM)
- Database: PostgreSQL 16 (via `pg` module)
- Auth: bcryptjs + jsonwebtoken
- Reverse proxy: Nginx (SSL termination + static files + API proxy)
- PWA: vite-plugin-pwa
- Infra: Docker Compose with 3 containers

## Port Policy (Mandatory)
- UI must run on port 8080 (Nginx).
- Never use port 3000.

## Containers
| Name | Function | Image |
|---|---|---|
| `web-cheatsheets` | Nginx: serves SPA, proxies `/api/*` to API | nginx:alpine |
| `api-cheatsheets` | Express: auth (JWT) + data CRUD per user | node:20-alpine |
| `db-cheatsheets` | PostgreSQL: users table with JSONB data | postgres:16-alpine |

## Architecture
- All traffic is HTTPS (self-signed cert in dev).
- Nginx terminates SSL on port 8080.
- Nginx proxies `/api/*` to `api-cheatsheets:3001` (internal HTTP).
- Express runs on port 3001, no static file serving.
- PostgreSQL stores users + their cheatsheet data in JSONB column.
- JWT stored in localStorage; sent as `Authorization: Bearer` header.

## API Endpoints
| Method | Path | Auth | Purpose |
|---|---|---|---|
| POST | /api/auth/register | No | Register new user |
| POST | /api/auth/login | No | Login, get JWT |
| GET | /api/auth/me | Yes | Get current user profile |
| PUT | /api/auth/profile | Yes | Update email |
| PUT | /api/auth/password | Yes | Change password |
| GET | /api/data | Yes | Get user's cheatsheet data |
| PUT | /api/data | Yes | Save user's cheatsheet data |

## Database Schema
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  data JSONB DEFAULT '{"categories":[]}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Project Structure
- `src/lib/stores/auth.ts` - Auth store (login, register, logout, profile management)
- `src/lib/stores/data.ts` - Data store (CRUD for categories/entries/snippets)
- `src/lib/components/LoginForm.svelte` - Login form
- `src/lib/components/RegisterForm.svelte` - Registration form
- `src/lib/components/SettingsPanel.svelte` - Change email/password, sign out
- `src/lib/components/UserButton.svelte` - User icon button in Header
- `src/lib/utils/data.ts` - API data load/save with auth headers
- `server.js` - Express API (ESM)
- `docker/init-db.sh` - PostgreSQL init script (creates app user, table)
- `docker/nginx.conf` - Nginx config with SSL + API proxy
- `.env` - Environment variables (not committed)

## Testing
- All testing via Docker: `docker compose up --build`
- App runs on `https://localhost:8080`
- Accept self-signed cert warning in browser
- Reset all data: `docker compose down -v && docker compose up --build`
- View logs: `docker compose logs -f`

## Key Rules
- Mobile styles never changed; desktop uses `lg:`/`xl:` prefixes only.
- Tailwind only, `rounded-2xl`+ on cards/inputs.
- Username cannot be changed by user.
- Username and email are unique in database.
- Password encrypted with bcrypt; traffic encrypted with HTTPS.
