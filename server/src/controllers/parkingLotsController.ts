import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { getAvailableSpaceCount, isSpaceAvailable } from "../services/availability";

function parseDateParam(value: unknown): Date | undefined {
  if (typeof value !== "string" || value.length === 0) {
    return undefined;
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

const spaceInputSchema = z.object({
  spaceNumber: z.string().min(1),
  spaceType: z.enum(["REGULAR", "VIP", "DISABLED"]).optional(),
});

const createLotSchema = z.object({
  lotName: z.string().min(1),
  address: z.string().min(1),
  city: z.string().min(1),
  hourlyRate: z.number().positive(),
  description: z.string().optional(),
  latitude: z.number(),
  longitude: z.number(),
  spaces: z.array(spaceInputSchema).min(1),
});

async function getOwnerProfileOrFail(userId: number) {
  return prisma.parkingOwner.findUnique({ where: { userId } });
}

export async function listLots(req: Request, res: Response) {
  const city = typeof req.query.city === "string" ? req.query.city : undefined;
  const from = parseDateParam(req.query.from);
  const to = parseDateParam(req.query.to);

  const lots = await prisma.parkingLot.findMany({
    where: city ? { city } : undefined,
    orderBy: { id: "asc" },
  });

  const withAvailability = await Promise.all(
    lots.map(async (lot) => ({
      ...lot,
      availableSpaces: await getAvailableSpaceCount(lot.id, from, to),
    })),
  );

  res.json(withAvailability);
}

export async function getLot(req: Request, res: Response) {
  const id = Number(req.params.id);
  const from = parseDateParam(req.query.from);
  const to = parseDateParam(req.query.to);

  const lot = await prisma.parkingLot.findUnique({
    where: { id },
    include: { spaces: true },
  });
  if (!lot) {
    res.status(404).json({ error: "Parking lot not found" });
    return;
  }

  const spacesWithAvailability = await Promise.all(
    lot.spaces.map(async (space) => ({
      ...space,
      available: await isSpaceAvailable(space.id, from, to),
    })),
  );

  res.json({ ...lot, spaces: spacesWithAvailability });
}

export async function createLot(req: Request, res: Response) {
  const parsed = createLotSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid input" });
    return;
  }

  const ownerProfile = await getOwnerProfileOrFail(req.user!.userId);
  if (!ownerProfile) {
    res.status(403).json({ error: "No owner profile for this account" });
    return;
  }

  const { spaces, ...lotFields } = parsed.data;
  const lot = await prisma.parkingLot.create({
    data: {
      ...lotFields,
      ownerId: ownerProfile.id,
      totalSpaces: spaces.length,
      spaces: { create: spaces },
    },
    include: { spaces: true },
  });

  res.status(201).json(lot);
}

export async function listMyLots(req: Request, res: Response) {
  const ownerProfile = await getOwnerProfileOrFail(req.user!.userId);
  if (!ownerProfile) {
    res.status(403).json({ error: "No owner profile for this account" });
    return;
  }

  const lots = await prisma.parkingLot.findMany({
    where: { ownerId: ownerProfile.id },
    include: { spaces: true },
    orderBy: { id: "asc" },
  });

  res.json(lots);
}
