# API Specification

All endpoints are under `/api`. Authenticated endpoints require `Authorization: Bearer <token>`. Errors return `{ "error": "message" }` with an appropriate HTTP status code.

## Auth

- `POST /api/auth/register` — body: `{ fullName, email, password, phone?, role: "DRIVER"|"OWNER", businessName? }`. If `role` is `OWNER`, also creates a `ParkingOwner` record (`businessName` required in that case). Returns `{ token, user }`.
- `POST /api/auth/login` — body: `{ email, password }`. Returns `{ token, user }`.
- `GET /api/auth/me` — returns the current user from the token.

## Vehicles

- `GET /api/vehicles` — current user's vehicles.
- `POST /api/vehicles` — body: `{ plateNumber, vehicleType?, color? }`.
- `DELETE /api/vehicles/:id`

## Parking Lots

- `GET /api/parking-lots` — query: `?city=&from=&to=`. Returns lots with `availableSpaces` computed for the given window (defaults to "now").
- `GET /api/parking-lots/:id` — lot detail including its spaces, each with computed availability for an optional `?from=&to=` window.
- `POST /api/parking-lots` — owner only. body: `{ lotName, address, city, hourlyRate, description?, latitude, longitude, spaces: [{ spaceNumber, spaceType }] }` — creates the lot and its spaces in one call.
- `PUT /api/parking-lots/:id` — owner only, must own the lot.
- `GET /api/parking-lots/owned/mine` — owner only, lots belonging to the current owner.

## Parking Spaces

- `POST /api/parking-lots/:lotId/spaces` — owner only, add a space to an existing lot.
- `PUT /api/parking-spaces/:id` — owner only.
- `DELETE /api/parking-spaces/:id` — owner only.

## Reservations

- `POST /api/reservations` — driver only. body: `{ spaceId, vehicleId, startTime, endTime }`. Server must reject with 409 if the space has any `CONFIRMED` reservation overlapping the requested window. On success: creates the reservation, a `Payment` row (marked `PAID` immediately for the mock flow), and a `Notification` for the driver.
- `GET /api/reservations/mine` — driver's own reservations.
- `GET /api/reservations/lot/:lotId` — owner only, all reservations for a lot they own.
- `PATCH /api/reservations/:id/cancel` — driver (own reservation) or owner (lots they own). Sets status `CANCELLED`, creates a cancellation `Notification`.

## Notifications

- `GET /api/notifications` — current user's notifications, newest first.
- `PATCH /api/notifications/:id/read`

## Reports

- `GET /api/reports/owner-summary` — owner only. Query: `?from=&to=`. Returns computed totals (bookings count, revenue) across the owner's lots for the range — `{ bookingsCount, revenue, byLot: [{ lotId, lotName, bookingsCount, revenue }] }`. Computed on demand, no need to pre-store.

## Prediction

- `GET /api/parking-lots/:id/prediction` — returns a simple heuristic, e.g. `{ hourly: [{ hour: 0, avgOccupancyPct: 12 }, ... 23 entries], busiestHour: 17 }`, computed from that lot's historical reservations. See `docs/plan/day-5.md` for the exact calculation.

## Admin (stretch — Day 4/5 if time allows)

- `GET /api/admin/users`
- `GET /api/admin/parking-lots`