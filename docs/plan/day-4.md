# Day 4 — Owner Dashboard, Notifications UI, Reports, Admin (stretch)

## Goal

Owners can see and manage reservations on their lots; both roles have a working notifications inbox; owners can pull a basic earnings/bookings report; a minimal read-only admin view exists if time allows.

## Prerequisites

Day 3 complete: reservations, payments, and notification rows are being created correctly. Re-check Day 3's acceptance criteria before starting.

## Tasks

Server:
- [ ] Implement `GET /api/notifications` and `PATCH /api/notifications/:id/read`.
- [ ] Implement `GET /api/reports/owner-summary?from=&to=`: query the owner's lots' reservations in range, return `{ bookingsCount, revenue, byLot: [{ lotId, lotName, bookingsCount, revenue }] }`. Compute on demand — don't worry about persisting a `Report` row unless there's time; if you do, write one row per generated report (`reportType: "EARNINGS"`).
- [ ] Stretch, only if the above is done early: `GET /api/admin/users`, `GET /api/admin/parking-lots`. Gate behind `role === "ADMIN"` if an admin seed account exists; otherwise skip and note it as not implemented in the README.

Client:
- [ ] Build `Notifications.tsx` on `/notifications`: list newest-first, unread visually distinct, click marks as read (`PATCH`). Navbar bell icon shows unread count — poll `GET /api/notifications` every ~30s or on route change, no websockets needed.
- [ ] Build `OwnerReservations.tsx` on `/owner/reservations`: table of reservations across the owner's lots (call `GET /api/reservations/lot/:lotId` per lot, or extend the endpoint to accept "all my lots" if simpler — your call, but update `docs/03-api-spec.md` if you change the contract), filter by lot, cancel action.
- [ ] Build `OwnerReports.tsx` on `/owner/reports`: date range inputs, calls `owner-summary`, renders totals + a simple per-lot breakdown table.
- [ ] If time allows: `AdminDashboard.tsx` on `/admin`, two read-only tables (users, lots).

## Out of scope today

Prediction/heuristic (Day 5), visual polish pass (Day 5).

## Acceptance criteria

- Booking a space as a Driver produces a notification visible in the Owner's `/notifications`, and vice versa for cancellations.
- Marking a notification read persists (survives refresh) and the unread badge count updates.
- `/owner/reservations` shows correct data only for lots that owner actually owns (verify with two different owner accounts).
- `/owner/reports` returns numbers that match what's actually in the DB for that date range (spot check one lot manually).