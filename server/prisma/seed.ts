import { PrismaClient, SpaceType } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("password123", 10);

  const owner1User = await prisma.user.create({
    data: {
      fullName: "Nadine Karam",
      email: "owner1@parksmart.dev",
      passwordHash: password,
      phone: "+961 70 111 111",
      role: "OWNER",
      ownerProfile: {
        create: {
          businessName: "Karam Parking Group",
          contactInfo: "owner1@parksmart.dev",
        },
      },
    },
    include: { ownerProfile: true },
  });

  const owner2User = await prisma.user.create({
    data: {
      fullName: "Elie Sfeir",
      email: "owner2@parksmart.dev",
      passwordHash: password,
      phone: "+961 70 222 222",
      role: "OWNER",
      ownerProfile: {
        create: {
          businessName: "Sfeir Lots & Valets",
          contactInfo: "owner2@parksmart.dev",
        },
      },
    },
    include: { ownerProfile: true },
  });

  const driver1 = await prisma.user.create({
    data: {
      fullName: "Rami Haddad",
      email: "driver1@parksmart.dev",
      passwordHash: password,
      phone: "+961 71 333 333",
      role: "DRIVER",
    },
  });

  const driver2 = await prisma.user.create({
    data: {
      fullName: "Layal Fares",
      email: "driver2@parksmart.dev",
      passwordHash: password,
      phone: "+961 71 444 444",
      role: "DRIVER",
    },
  });

  const spaceTypeCycle: SpaceType[] = ["REGULAR", "REGULAR", "REGULAR", "VIP", "DISABLED"];
  const makeSpaces = (count: number) =>
    Array.from({ length: count }, (_, i) => ({
      spaceNumber: `S${i + 1}`,
      spaceType: spaceTypeCycle[i % spaceTypeCycle.length],
    }));

  const lot1Spaces = makeSpaces(8);
  const lot1 = await prisma.parkingLot.create({
    data: {
      ownerId: owner1User.ownerProfile!.id,
      lotName: "Hamra Central Garage",
      address: "Hamra Street",
      city: "Beirut",
      hourlyRate: 3.5,
      totalSpaces: lot1Spaces.length,
      description: "Covered garage near AUB, easy access to Hamra shops.",
      latitude: 33.8959,
      longitude: 35.4796,
      spaces: { create: lot1Spaces },
    },
  });

  const lot2Spaces = makeSpaces(6);
  const lot2 = await prisma.parkingLot.create({
    data: {
      ownerId: owner1User.ownerProfile!.id,
      lotName: "Downtown Beirut Lot",
      address: "Foch Street",
      city: "Beirut",
      hourlyRate: 5,
      totalSpaces: lot2Spaces.length,
      description: "Open-air lot near Beirut Souks.",
      latitude: 33.8967,
      longitude: 35.5044,
      spaces: { create: lot2Spaces },
    },
  });

  const lot3Spaces = makeSpaces(10);
  const lot3 = await prisma.parkingLot.create({
    data: {
      ownerId: owner2User.ownerProfile!.id,
      lotName: "Achrafieh Plaza Parking",
      address: "Sassine Square",
      city: "Beirut",
      hourlyRate: 4,
      totalSpaces: lot3Spaces.length,
      description: "Multi-level parking near Sassine Square.",
      latitude: 33.8886,
      longitude: 35.5197,
      spaces: { create: lot3Spaces },
    },
  });

  await prisma.vehicle.createMany({
    data: [
      { userId: driver1.id, plateNumber: "123456", vehicleType: "Sedan", color: "White" },
      { userId: driver1.id, plateNumber: "654321", vehicleType: "SUV", color: "Black" },
      { userId: driver2.id, plateNumber: "789012", vehicleType: "Hatchback", color: "Blue" },
    ],
  });

  console.log("Seed complete:");
  console.log(`  Owners: ${owner1User.email}, ${owner2User.email}`);
  console.log(`  Drivers: ${driver1.email}, ${driver2.email}`);
  console.log(`  Lots: ${lot1.lotName}, ${lot2.lotName}, ${lot3.lotName}`);
  console.log(`  Shared password for all seeded accounts: password123`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
