import { prisma } from "../lib/prisma";

function resolveWindow(from?: Date, to?: Date): { from: Date; to: Date } {
  if (from && to) {
    return { from, to };
  }
  const now = new Date();
  return { from: now, to: now };
}

export async function getAvailableSpaceCount(
  lotId: number,
  from?: Date,
  to?: Date,
): Promise<number> {
  const spaces = await prisma.parkingSpace.findMany({
    where: { lotId },
    select: { id: true },
  });
  if (spaces.length === 0) {
    return 0;
  }

  const window = resolveWindow(from, to);
  const overlapping = await prisma.reservation.findMany({
    where: {
      spaceId: { in: spaces.map((s) => s.id) },
      status: "CONFIRMED",
      startTime: { lt: window.to },
      endTime: { gt: window.from },
    },
    select: { spaceId: true },
  });

  const reservedSpaceIds = new Set(overlapping.map((r) => r.spaceId));
  return spaces.length - reservedSpaceIds.size;
}

export async function isSpaceAvailable(
  spaceId: number,
  from?: Date,
  to?: Date,
): Promise<boolean> {
  const window = resolveWindow(from, to);
  const conflict = await prisma.reservation.findFirst({
    where: {
      spaceId,
      status: "CONFIRMED",
      startTime: { lt: window.to },
      endTime: { gt: window.from },
    },
  });
  return !conflict;
}
