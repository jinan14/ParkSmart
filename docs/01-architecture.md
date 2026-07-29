# Architecture

## Stack decision

- **Frontend:** React + Vite + TypeScript
- **Backend:** Node.js + Express + TypeScript
- **Database:** SQLite via Prisma ORM — file-based, zero setup. The Prisma schema is the definitive source of truth for the DB, kept in sync with `docs/02-database-schema.md`.
- **Auth:** JWT, signed with a server-side secret, returned in the login/register response body, stored in `localStorage` on the client, sent as `Authorization: Bearer <token>`. Simpler than httpOnly cookies for a local dev/demo build — not a production-grade choice, and that's fine here.
- **Maps:** Leaflet + OpenStreetMap tiles — no API key or billing account required.
- **Validation:** zod on the server for request body validation.
- **Password hashing:** bcrypt.

This is a deliberate deviation from an earlier PHP/MySQL/Python proposal, chosen so a single AI coding agent can implement the whole stack in one consistent language across a 5-day sprint without cross-language integration risk.

## Repo layout

```
parksmart/
  docs/                  specs + day plan (this folder)
  client/                React app (created Day 1 via `npm create vite@latest`)
    src/
      pages/
      components/
      api/               fetch wrapper functions, one file per resource
      context/           AuthContext (current user + token)
      types/             shared TS types mirroring the API spec
  server/                Express API (created Day 1)
    prisma/
      schema.prisma
      seed.ts
    src/
      routes/            one file per resource
      controllers/
      middleware/        auth.ts (JWT verify), error handler
      services/          business logic (e.g. reservation overlap check, prediction heuristic)
      lib/               prisma.ts (single PrismaClient instance)
      index.ts
    .env                 DATABASE_URL, JWT_SECRET (gitignored)
  CLAUDE.md
  README.md
```

## How the pieces talk

Client (port 5173) calls server (port 4000) over REST/JSON under `/api/*`. The Vite dev server proxies `/api` to `http://localhost:4000` to avoid CORS friction — configure this in `client/vite.config.ts`. All endpoints are documented in `docs/03-api-spec.md`.

## Environment

- `server/.env`: `DATABASE_URL="file:./dev.db"`, `JWT_SECRET="<any random string>"`
- No external API keys required anywhere in this build.

## Design notes / conventions

- Space availability is **not** a stored flag that can go stale. The original ERD's `PARKING_SPACE.availability_status` and `PARKING_LOT.available_spaces` are replaced at read time: a space is "available" for a given window if it has no overlapping `CONFIRMED` reservation. This avoids a whole class of state-sync bugs and background-job complexity.
- Endpoints that matter for the map/dashboard (lots, spaces) accept an optional time-window query so "available now" can be computed live.
- Every day's work should end in a runnable state: `npm run dev` in both `client/` and `server/` should start cleanly with no errors, even if a feature is partial.