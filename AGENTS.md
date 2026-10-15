# Base44 Development Environment

## Overview

This is a full-stack Next.js application template (App Router) with a custom Express server (`server.js`). The app runs via `npm run dev` which starts the custom server in development mode.

## Running the App

```sh
docker compose -f docker-compose.base44.yml up -d --build
```

The app is served on port 3000. No external credentials or database are required — demo data is fetched from public GitHub raw URLs.

## Key Details

- **Custom server**: `server.js` wraps Next.js with Express. The dev command is `npm run dev` (`EXPORT_ENABLED=false NODE_ENV=development node server.js`).
- **Binding**: `server.js` binds to `0.0.0.0` (configurable via `PORT` env var, defaults to 3000) so it works inside Docker.
- **Preview origins**: `next.config.js` conditionally adds the Base44 preview origin to `allowedDevOrigins` when `BASE44_PREVIEW_MODE === '1'`.
- **File watching**: `CHOKIDAR_USEPOLLING=true` and `WATCHPACK_POLLING=true` are set for reliable hot reload under Docker bind mounts.
- **No database**: All demo API routes return static JSON or fetch from public GitHub URLs. No migrations or seeds needed.
- **Optional backend services**: The `backend/` directory contains optional Express microservices (PHP server, auth, upload, socket, etc.) that run on separate ports. These are NOT started by the Base44 compose and are not needed for the preview.
- **Backend dependencies**: `backend/` has its own `package.json` with separate dependencies (better-sqlite3, php-express, etc.). These are not installed in the preview — only the root `package.json` dependencies are.

## Verification

After starting, curl `http://localhost:3000/` — it should return the homepage HTML. Check `docker compose -f docker-compose.base44.yml logs web` for the `> Ready on http://0.0.0.0:3000` message and Next.js dev compilation output.
