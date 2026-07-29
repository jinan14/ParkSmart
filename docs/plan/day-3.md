# Day 3 — Reservations, Conflict Checking, Mock Payments

## Goal

A Driver can book an available space for a chosen vehicle and time window; the server enforces no double-booking; a mock payment is recorded; the driver can view and cancel their reservations.

## Prerequisites

Day 2 complete: lots/spaces exist and availability is computed correctly. Re-check Day 2's acceptance criteria before starting.

## Tasks

Server:
- [ ] Implement `POST /api/reservations` per `docs/03-api-spec.md`. Use `services/availability.ts`'s overlap check — if any `CONFIRMED` reservation on that `spaceId` overlaps `[startTime, endTime)`, return 409 with a clear error message. On success: create the `Reservation` (status `CONFIRMED`, `totalAmount` = lot's `hourlyRate` × duration in hours), create a `Payment` row (`paymentMethod: "ONLINE"`, immediately set `paymentStatus: "PAID"`, generate a fake `transactionId`, e.g. a uuid), create a `Notification` for the driver (`type: "BOOKING"`). Wrap creation in a Prisma transaction.
- [ ] Implement `GET /api/reservations/mine`, `GET /api/reservations/lot/:lotId` (owner-only, ownership-checked), `PATCH /api/reservations/:id/cancel` (sets status `CANCELLED`, creates a cancellation `Notification`; only the owning driver or the lot's owner may cancel).
- [ ] Vehicle routes: `GET/POST/DELETE /api/vehicles` per spec — needed so a driver can pick or add a vehicle at booking time.

Client:
- [ ] Add a "Book" action on each available space in `LotDetail.tsx` opening a small modal/form: vehicle dropdown (with an "add new vehicle" inline option), start time, end time, shows computed price live (rate × duration), submits to `POST /api/reservations`; show the 409 conflict message clearly if it happens.
- [ ] Build `MyReservations.tsx` on `/reservations`: table of the driver's bookings (lot name, space, window, status, amount), a Cancel button on upcoming `CONFIRMED` ones.
- [ ] Build `MyVehicles.tsx` on `/vehicles`: list + add/remove.

## Out of scope today

Notifications inbox UI (data is being created, but the inbox page is Day 4), owner reservation dashboard UI (Day 4), reports, prediction.

## Acceptance criteria

- Booking an available space succeeds, creates a `Reservation` + a `PAID` `Payment`, and shows up in `/reservations`.
- Attempting to book the same space for an overlapping time window returns a 409 and the UI shows a clear error; no duplicate reservation is created.
- Cancelling a reservation sets its status to `CANCELLED` and the space becomes available again for that window (verify via `/lots/:id`).
- A `Notification` row is created on booking (check via Prisma Studio even though the inbox UI isn't built yet).