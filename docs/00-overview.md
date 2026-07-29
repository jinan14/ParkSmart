# ParkSmart — Project Overview

## What this is

ParkSmart is a web platform that lets drivers find and reserve parking spaces in real time, and lets parking lot owners manage their lots, spaces, reservations, and earnings. This `docs/` folder is the single source of truth for scope, architecture, and the day-by-day build plan. Read this file plus 01–04 before starting any implementation day.

## Problem

- Drivers waste time and fuel circling for open spots because there's no live visibility into space availability.
- Parking lot owners have no easy way to manage their spaces, see who's booked what, or track earnings.
- There is no historical data used to help drivers anticipate busy times.

## Users / roles

- **Driver** — browses lots on a map, books a space for a vehicle, pays, gets notifications, views reservation history.
- **Owner** — creates and manages their parking lot(s) and spaces, sees incoming reservations, views earnings/reports.
- **Admin** — light, stretch scope only — can view all users and all lots system-wide, read-only.

A user account holds a single role (Driver, Owner, or Admin). An Owner account additionally has a linked `ParkingOwner` profile (business name, contact info), matching the original ERD's 1:1 relationship between `Users` and `Parking_Owners`.

## Core features (in scope for the 5-day build)

1. Auth: register/login as Driver or Owner, JWT-based sessions.
2. Owner: create parking lots, add/edit parking spaces per lot.
3. Driver: browse lots on an interactive map, see live available-space counts, view a lot's spaces.
4. Reservation: book a space for a time window with a vehicle; server rejects overlapping bookings for the same space.
5. Mock payment: a reservation triggers a simple payment record — no real payment gateway.
6. Notifications: created on booking/cancellation events, listed per user, markable as read.
7. Owner reports: totals for bookings/earnings on their lots, computed on demand.
8. Prediction (simplified): a heuristic "typical busy hours" estimate per lot, derived from historical reservation data — not a trained ML model.

## Explicitly out of scope for the 5-day build

- Real payment gateway integration (Stripe, etc.) — mocked only.
- True real-time push (WebSockets) — client polls/refetches instead.
- A trained machine learning model or separate Python service — replaced with a statistical heuristic computed in the same backend.
- Full admin analytics suite — admin view is read-only and minimal, built last if time allows.
- Mobile app — web only, responsive layout.

If your course requirements strictly need a real ML model or the original PHP/MySQL stack, that's a scope decision to make before Day 1 — see `docs/01-architecture.md` for the stack tradeoff.

## Success criteria for the demo

A user can: register as a Driver → browse the map → open a lot → book an available space with a vehicle → see the reservation and a mock payment recorded → get a notification → a second account (the lot's Owner) sees the new reservation in their dashboard and it's reflected in their report totals. A lot detail page shows a plausible "busiest hours" estimate.