import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";

const addSpaceSchema = z.object({
  spaceNumber: z.string().min(1),
  spaceType: z.enum(["REGULAR", "VIP", "DISABLED"]).optional(),
});

const updateSpaceSchema = z.object({
  spaceNumber: z.string().min(1).optional(),
  spaceType: z.enum(["REGULAR", "VIP", "DISABLED"]).optional(),
});

async function getOwnedLot(lotId: number, userId: number) {
  const lot = await prisma.parkingLot.findUnique({
    where: { id: lotId },
    include: { owner: true },
  });
  if (!lot || lot.owner.userId !== userId) {
    return null;
  }
  return lot;
}

export async function addSpace(req: Request, res: Response) {
  const lotId = Number(req.params.lotId);
  const parsed = addSpaceSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid input" });
    return;
  }

  const lot = await getOwnedLot(lotId, req.user!.userId);
  if (!lot) {
    res.status(403).json({ error: "You do not own this parking lot" });
    return;
  }

  const space = await prisma.$transaction(async (tx) => {
    const created = await tx.parkingSpace.create({
      data: { lotId, ...parsed.data },
    });
    await tx.parkingLot.update({
      where: { id: lotId },
      data: { totalSpaces: { increment: 1 } },
    });
    return created;
  });

  res.status(201).json(space);
}

export async function updateSpace(req: Request, res: Response) {
  const id = Number(req.params.id);
  const parsed = updateSpaceSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid input" });
    return;
  }

  const space = await prisma.parkingSpace.findUnique({
    where: { id },
    include: { lot: { include: { owner: true } } },
  });
  if (!space) {
    res.status(404).json({ error: "Parking space not found" });
    return;
  }
  if (space.lot.owner.userId !== req.user!.userId) {
    res.status(403).json({ error: "You do not own this parking lot" });
    return;
  }

  const updated = await prisma.parkingSpace.update({
    where: { id },
    data: parsed.data,
  });
  res.json(updated);
}

export async function deleteSpace(req: Request, res: Response) {
  const id = Number(req.params.id);

  const space = await prisma.parkingSpace.findUnique({
    where: { id },
    include: { lot: { include: { owner: true } } },
  });
  if (!space) {
    res.status(404).json({ error: "Parking space not found" });
    return;
  }
  if (space.lot.owner.userId !== req.user!.userId) {
    res.status(403).json({ error: "You do not own this parking lot" });
    return;
  }

  await prisma.$transaction(async (tx) => {
    await tx.parkingSpace.delete({ where: { id } });
    await tx.parkingLot.update({
      where: { id: space.lotId },
      data: { totalSpaces: { decrement: 1 } },
    });
  });

  res.status(204).send();
}
