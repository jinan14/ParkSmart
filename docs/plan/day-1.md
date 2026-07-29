# Day 1 — Project Scaffold, Database, Auth

## Goal

End of day: both `client/` and `server/` run locally, the database schema is migrated and seeded, and a user can register and log in through the actual UI, with protected routing working.

## Prerequisites

None — this is the first day. Read `docs/00-overview.md`, `docs/01-architecture.md`, and `docs/02-database-schema.md` fully before starting.

## Tasks

- [x] Scaffold `server/`: `npm init -y`, install `express cors dotenv bcrypt jsonwebtoken zod @prisma/client` and dev deps `typescript ts-node-dev prisma @types/express @types/node @types/bcrypt @types/jsonwebtoken @types/cors`. Add a `tsconfig.json` and npm scripts `dev` (ts-node-dev), `build`, `start`.
- [x] Run `npx prisma init --datasource-provider sqlite`, then replace the generated `schema.prisma` with the schema from `docs/02-database-schema.md` exactly. Create `server/.env` with `DATABASE_URL="file:./dev.db"` and a `JWT_SECRET`. Run `npx prisma migrate dev --name init`.
- [x] Write `server/prisma/seed.ts` per the seeding notes in `docs/02-database-schema.md` (2 owners, 2 drivers, 2–3 lots with spaces, a few vehicles — historical reservations can wait until Day 5). Wire it up as the `prisma.seed` script and run it.
- [x] Build `server/src/lib/prisma.ts` (single `PrismaClient` instance, imported everywhere else).
- [x] Build `server/src/index.ts`: Express app, `cors()`, `express.json()`, mount a `/api/health` route returning `{ ok: true }`, mount `authRoutes` at `/api/auth`.
- [x] Build auth: `server/src/routes/auth.ts` + controller implementing `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me` exactly per `docs/03-api-spec.md`. Hash passwords with bcrypt, sign JWTs with `JWT_SECRET`, 7-day expiry. Write `server/src/middleware/auth.ts` (verifies bearer token, attaches `req.user`).
- [x] Scaffold `client/` with `npm create vite@latest client -- --template react-ts`, install `react-router-dom`. Set up `client/vite.config.ts` to proxy `/api` to `http://localhost:4000`.
- [x] Build `AuthContext` (`client/src/context/AuthContext.tsx`) storing `{ user, token }` in state + `localStorage`, exposing `login`, `register`, `logout`.
- [x] Build `client/src/api/auth.ts` with fetch wrappers for register/login/me.
- [x] Build pages: `Login.tsx`, `Register.tsx` (with role toggle Driver/Owner, business name field shown only for Owner), a placeholder `Home.tsx`.
- [x] Set up `react-router-dom` routes in `App.tsx` including a `ProtectedRoute` component; unauthenticated users hitting a protected route redirect to `/login`.

## Out of scope today

Parking lots, spaces, reservations, map, anything beyond auth plumbing and a bare-bones home page.

## Acceptance criteria

- `cd server && npm run dev` starts with no errors; `GET http://localhost:4000/api/health` returns `{ "ok": true }`.
- `cd client && npm run dev` starts with no errors.
- Registering a new Driver via the UI creates a row in `User` (verify with `npx prisma studio`), logs the user in, and redirects to the home page.
- Registering a new Owner also creates a `ParkingOwner` row linked to that user.
- Refreshing the page keeps the user logged in (token persisted).
- Visiting a protected route while logged out redirects to `/login`.