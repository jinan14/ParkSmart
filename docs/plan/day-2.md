# Day 2 — Parking Lots, Spaces, and the Map

## Goal

Owners can create lots with spaces through the UI; drivers can browse all lots on a live map and open a lot detail page showing its spaces.

## Prerequisites

Day 1 complete: auth works end to end, DB is migrated. Re-check Day 1's acceptance criteria before starting.

## Tasks

Server:
- [x] `server/src/services/availability.ts` — a function `getAvailableSpaceCount(lotId, from?, to?)` and `isSpaceAvailable(spaceId, from, to)` that check for overlapping `CONFIRMED` reservations (default window: "now" if not provided). Build once, reuse everywhere availability needs computing.
- [x] Implement lot routes per `docs/03-api-spec.md`: `GET /api/parking-lots`, `GET /api/parking-lots/:id`, `POST /api/parking-lots` (owner only, creates lot + spaces in one transaction), `GET /api/parking-lots/owned/mine`.
- [x] Implement space routes: `POST /api/parking-lots/:lotId/spaces`, `PUT /api/parking-spaces/:id`, `DELETE /api/parking-spaces/:id`, all owner-only and ownership-checked (403 if the lot isn't theirs).

Client:
- [x] Install `leaflet react-leaflet`. Build `MapView.tsx` on `/map`: fetch `GET /api/parking-lots`, render a marker per lot (lat/long from the lot), popup shows lot name + live available count.
- [x] Build `LotDetail.tsx` on `/lots/:id`: lot info header, list of spaces with an available/unavailable badge (from the space-level data returned by `GET /api/parking-lots/:id`).
- [x] Build `OwnerLots.tsx` on `/owner/lots`: list owned lots (`GET /api/parking-lots/owned/mine`), a form to add a new lot including a small list-builder for initial spaces (space number + type), submits to `POST /api/parking-lots`.
- [x] Build `OwnerLotSpaces.tsx` on `/owner/lots/:id/spaces`: add/edit/delete spaces for one lot.
- [x] Wire new routes into `App.tsx`, add nav links per role.

## Out of scope today

Booking flow, payments, notifications, reports, prediction.

## Acceptance criteria

- An Owner account can create a lot with at least 3 spaces via the UI and see it appear in `/owner/lots`.
- `/map` shows a marker for every lot in the DB with the correct available-space count.
- Clicking a marker/lot navigates to `/lots/:id` and lists its spaces correctly.
- An Owner can add/remove a space from `/owner/lots/:id/spaces` and the count on `/map` reflects it after refresh.