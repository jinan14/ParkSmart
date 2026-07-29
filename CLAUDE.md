# ParkSmart — Agent Instructions

This repo is built incrementally by an AI coding agent following a fixed 5-day plan. Read this file first in every session.

## Before doing anything

Read, in order: `docs/00-overview.md`, `docs/01-architecture.md`, `docs/02-database-schema.md`, `docs/03-api-spec.md`, `docs/04-ui-spec.md`. These are the specification — don't deviate from them without a good reason, and if you do deviate, update the relevant doc so it stays accurate for later days.

## When told "implement day N"

1. Open `docs/plan/day-N.md`.
2. Confirm the prerequisites section is actually satisfied — spot check it, don't just assume. If a prior day's acceptance criteria don't hold anymore, fix that first.
3. Work through the task checklist in order.
4. Do not build anything listed under that day's "Out of scope" section, even if it seems like a natural next step — it's scoped to a later day on purpose.
5. Before declaring the day done, verify every item in that day's "Acceptance criteria" section yourself (run the app, hit the endpoints, click through the UI). Report which ones pass and which don't.
6. Edit `docs/plan/day-N.md` to check off completed tasks (`- [ ]` → `- [x]`) so progress is visible in git history.

## Conventions

- TypeScript everywhere, avoid `any`.
- One Prisma client instance, imported from a single `server/src/lib/prisma.ts` — don't instantiate `PrismaClient` in multiple files.
- API errors always return `{ "error": "message" }` with a correct HTTP status code.
- Keep React components free of direct `fetch` calls — always go through `client/src/api/*.ts` wrapper functions.
- Commit at natural checkpoints within a day (e.g. after auth works, after the DB migrates) rather than one giant commit per day.
- Don't add new npm dependencies beyond what's listed in `docs/01-architecture.md` unless a day's plan explicitly calls for it (e.g. `leaflet` on Day 2).

## Running things

- Server: `cd server && npm run dev` (port 4000)
- Client: `cd client && npm run dev` (port 5173)
- DB reset + reseed: `cd server && npx prisma migrate reset`
- Inspect DB: `cd server && npx prisma studio`

## If something in a day's plan is ambiguous

Prefer the simplest thing that satisfies the acceptance criteria. This project intentionally trades some correctness/production-readiness for buildability in 5 days (see `docs/00-overview.md` → "Explicitly out of scope"). Don't gold-plate.