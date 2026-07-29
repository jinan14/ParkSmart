# Database Schema

Source of truth: the Prisma schema below, adapted from the original ERD (Users, Parking_Owners, Parking_Lots, Parking_Spaces, Vehicles, Reservations, Payments, Notifications, Reports). Copy this verbatim into `server/prisma/schema.prisma` on Day 1, then run `npx prisma migrate dev --name init`.

```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  DRIVER
  ADMIN
  OWNER
}

enum AccountStatus {
  ACTIVE
  INACTIVE
}

enum LotStatus {
  ACTIVE
  INACTIVE
}

enum SpaceType {
  REGULAR
  VIP
  DISABLED
}

enum ReservationStatus {
  CONFIRMED
  CANCELLED
  COMPLETED
}

enum PaymentMethod {
  CARD
  CASH
  WALLET
  ONLINE
}

enum PaymentStatus {
  PENDING
  PAID
  FAILED
  REFUNDED
}

enum NotificationType {
  INFO
  BOOKING
  PAYMENT
  ALERT
}

enum ReportType {
  EARNINGS
  BOOKINGS
  AVAILABILITY
  USERS
}

model User {
  id            Int             @id @default(autoincrement())
  fullName      String
  email         String          @unique
  passwordHash  String
  phone         String?
  role          Role
  status        AccountStatus   @default(ACTIVE)
  createdAt     DateTime        @default(now())

  ownerProfile  ParkingOwner?
  vehicles      Vehicle[]
  reservations  Reservation[]
  notifications Notification[]
  reports       Report[]
}

model ParkingOwner {
  id           Int          @id @default(autoincrement())
  userId       Int          @unique
  user         User         @relation(fields: [userId], references: [id])
  businessName String
  contactInfo  String?

  lots         ParkingLot[]
}

model ParkingLot {
  id          Int            @id @default(autoincrement())
  ownerId     Int
  owner       ParkingOwner   @relation(fields: [ownerId], references: [id])
  lotName     String
  address     String
  city        String
  hourlyRate  Float
  totalSpaces Int
  description String?
  status      LotStatus      @default(ACTIVE)
  latitude    Float
  longitude   Float

  spaces      ParkingSpace[]
}

model ParkingSpace {
  id           Int           @id @default(autoincrement())
  lotId        Int
  lot          ParkingLot    @relation(fields: [lotId], references: [id])
  spaceNumber  String
  spaceType    SpaceType     @default(REGULAR)

  reservations Reservation[]
}

model Vehicle {
  id           Int           @id @default(autoincrement())
  userId       Int
  user         User          @relation(fields: [userId], references: [id])
  plateNumber  String
  vehicleType  String?
  color        String?

  reservations Reservation[]
}

model Reservation {
  id              Int               @id @default(autoincrement())
  userId          Int
  user            User              @relation(fields: [userId], references: [id])
  spaceId         Int
  space           ParkingSpace      @relation(fields: [spaceId], references: [id])
  vehicleId       Int
  vehicle         Vehicle           @relation(fields: [vehicleId], references: [id])
  startTime       DateTime
  endTime         DateTime
  reservationDate DateTime          @default(now())
  status          ReservationStatus @default(CONFIRMED)
  totalAmount     Float

  payment         Payment?
}

model Payment {
  id            Int           @id @default(autoincrement())
  reservationId Int           @unique
  reservation   Reservation   @relation(fields: [reservationId], references: [id])
  amount        Float
  paymentMethod PaymentMethod
  paymentStatus PaymentStatus @default(PENDING)
  transactionId String        @unique
  paymentDate   DateTime      @default(now())
}

model Notification {
  id        Int              @id @default(autoincrement())
  userId    Int
  user      User             @relation(fields: [userId], references: [id])
  title     String
  message   String
  type      NotificationType
  isRead    Boolean          @default(false)
  createdAt DateTime         @default(now())
}

model Report {
  id            Int        @id @default(autoincrement())
  generatedBy   Int
  user          User       @relation(fields: [generatedBy], references: [id])
  reportType    ReportType
  generatedDate DateTime   @default(now())
  parameters    String?
}
```

## Deltas from the original ERD (and why)

- `ParkingSpace.availabilityStatus` and `ParkingLot.availableSpaces` were dropped as stored fields — computed at query time from active reservations instead (see `docs/01-architecture.md` design notes). Prevents stale-state bugs that would otherwise need a background job to fix.
- Added `ParkingLot.latitude` / `longitude` — required for the map view; implied by the "real-time mapping" feature but not spelled out in the original text schema.
- Enum values are upper-cased to match Prisma/JS convention; otherwise identical to the original ERD.

## Seeding

`server/prisma/seed.ts` should create: 2 owner accounts, 2 driver accounts, 2–3 parking lots with 5–10 spaces each spread across a city, a few vehicles. Historical `Reservation` rows for the prediction feature are added on Day 5 specifically — see `docs/plan/day-5.md`.