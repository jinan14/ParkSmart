# Day 5 — Prediction Heuristic, Seed Data, Polish, Ship

## Goal

Ship a demoable build: a simple "busiest hours" estimate per lot, enough historical seed data to make that estimate meaningful, a full pass on loading/empty/error states, and a README that lets anyone clone and run the project.

## Prerequisites

Days 1–4 complete and their acceptance criteria all still pass — re-check before starting, Day 5 is a bad day to discover a Day 2 regression.

## Tasks

- [ ] Extend `server/prisma/seed.ts` to backfill historical reservations: for each seeded lot, generate ~100–200 `Reservation` rows (status `COMPLETED`) spread over the past 30 days, biased toward realistic peak hours (e.g. weight 8–10am and 5–7pm higher) so the heuristic below has a genuine pattern to find, not noise. Re-run `npx prisma migrate reset` + seed.
- [ ] Implement `server/src/services/prediction.ts`: given a `lotId`, group that lot's past `Reservation`s by `startTime` hour-of-day, compute `avgOccupancyPct` per hour as (reservations overlapping that hour) / (total spaces) as a rough proxy, return the 24-hour array plus the single busiest hour. Expose via `GET /api/parking-lots/:id/prediction` per `docs/03-api-spec.md`.
- [ ] On `LotDetail.tsx`, add a "Typical busy hours" section — a simple bar list or lightweight chart (plain CSS bars are fine, no charting library needed) plus a one-line callout like "Busiest around 5–7 PM."
- [ ] Polish pass across all pages: loading spinners/skeletons, empty states ("No lots yet", "No reservations yet"), consistent error messages for failed requests. Check narrow-width layout doesn't break (map and tables in particular).
- [ ] Full manual QA: run through the entire flow from `docs/00-overview.md`'s "Success criteria" section start to finish with two fresh accounts (one Driver, one Owner) and confirm every step works.
- [ ] Write the root `README.md`: what the project is (2–3 sentences), stack, setup instructions (`server`: `npm install`, set `.env`, `npx prisma migrate dev`, seed command, `npm run dev`; `client`: `npm install`, `npm run dev`), demo login credentials from the seed data, and a short "known limitations" section (mock payments, heuristic not ML, no websockets — matches `docs/00-overview.md`'s out-of-scope list).

## Out of scope today

Any new features not already specified in Days 1–4 — Day 5 is finishing and hardening, not adding scope.

## Acceptance criteria

- `GET /api/parking-lots/:id/prediction` returns a non-flat 24-hour array with a sensible busiest hour for at least one seeded lot.
- The full success-criteria flow from `docs/00-overview.md` works without errors end to end.
- A clean clone of the repo, following only the README, gets both `client` and `server` running.
- No console errors on any page during the full walkthrough.