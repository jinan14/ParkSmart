# UI Specification

## Global

- Navbar: logo/name, links change based on auth state and role. Logged out: Login, Register. Driver: Browse Map, My Reservations, My Vehicles, Notifications (bell icon with unread count). Owner: My Lots, Reservations, Reports, Notifications.
- `AuthContext` holds `{ user, token }`, persists the token to `localStorage`, provides `login()`, `register()`, `logout()`.
- `ProtectedRoute` component wraps pages that require auth, optionally a specific role; redirects to `/login` if unauthenticated.
- Keep styling simple and consistent — plain CSS with a small shared theme (colors, spacing) is enough. No need for a heavy component library.

## Pages

### Public
- `/` — Landing: short pitch, links to login/register.
- `/login`, `/register` — register includes a role toggle (Driver/Owner); Owner registration additionally asks for `businessName`.

### Driver
- `/map` — Leaflet map centered on the seeded city, one marker per parking lot showing live available-space count in a popup; lots are also listed alongside the map, clicking either navigates to lot detail.
- `/lots/:id` — lot info (address, hourly rate), list of spaces with availability, a "Book" action per available space opening a small form (vehicle select or add-new, start/end time). Shows the "busiest hours" prediction (from Day 5) once built.
- `/reservations` — table of the driver's reservations (lot, space, time window, status, amount), cancel action on upcoming ones.
- `/vehicles` — list + add/remove vehicles.
- `/notifications` — list, click to mark read.

### Owner
- `/owner/lots` — list of owned lots, "Add Lot" form (name, address, city, rate, lat/long, initial spaces), edit existing.
- `/owner/lots/:id/spaces` — manage spaces for a lot (add/remove/edit type).
- `/owner/reservations` — reservations across the owner's lots, filterable by lot.
- `/owner/reports` — date range picker, shows totals (bookings, revenue) from `GET /api/reports/owner-summary`.

### Admin (stretch)
- `/admin` — read-only tables: all users, all lots.

## Notes for the implementing agent

- Don't aim for pixel-perfect design — functional, clean, consistent spacing is enough for a course demo.
- Every page that lists data should have a loading state and an empty state ("No reservations yet", etc.) — cheap to add, avoids a broken-looking demo.
- Keep API call logic out of components: one function per endpoint in `client/src/api/`, components just call them.

## Deltas from this spec

- Added a temporary `/profile` page (Day 1) — a minimal `ProtectedRoute`-wrapped page showing the logged-in user's name/email/role. Needed to exercise/verify the protected-route redirect since Day 1 has no other authenticated page yet (`/map`, `/reservations`, etc. are out of scope until later days). Not listed in the "Pages" section above by design — safe to keep, replace, or fold into a real Driver/Owner page once one exists.