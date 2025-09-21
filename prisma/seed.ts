import { PrismaClient, ClientType, GlobalRole } from "@prisma/client";
import { hashPassword } from "../src/shared/crypto";

const prisma = new PrismaClient();

async function main() {
  const DEFAULT_PASSWORD = "test12345";

  // 1) Ensure base users
  const usersToSeed = [
    {
      key: "admin",
      email: "admin@bvs.com",
      firstName: "BVS",
      lastName: "Admin",
      avatarUrl: "https://i.pravatar.cc/150?img=10",
    },
    {
      key: "owner",
      email: "owen.owner@example.com",
      firstName: "Owen",
      lastName: "Owner",
      avatarUrl: "https://i.pravatar.cc/150?img=11",
    },
    {
      key: "charterer",
      email: "charlie.charterer@example.com",
      firstName: "Charlie",
      lastName: "Charterer",
      avatarUrl: "https://i.pravatar.cc/150?img=12",
    },
  ] as const;

  const seededUsers: Record<string, { id: string; email: string }> = {};

  for (const u of usersToSeed) {
    const passwordHash = await hashPassword(DEFAULT_PASSWORD);

    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {
        firstName: u.firstName,
        lastName: u.lastName,
        avatarUrl: u.avatarUrl,
        passwordHash,
      },
      create: {
        email: u.email,
        firstName: u.firstName,
        lastName: u.lastName,
        avatarUrl: u.avatarUrl,
        passwordHash,
      },
      select: { id: true, email: true },
    });

    seededUsers[u.key] = user;
  }

  // 2) Ensure Clients
  const ownerClient = await prisma.client.upsert({
    where: { name: "OwnerCo" },
    update: { type: ClientType.VESSEL_OWNER },
    create: {
      name: "OwnerCo",
      type: ClientType.VESSEL_OWNER,
      logoUrl: null,
    },
  });

  const chartererClient = await prisma.client.upsert({
    where: { name: "ChartererCo" },
    update: { type: ClientType.VESSEL_CHARTERER },
    create: {
      name: "ChartererCo",
      type: ClientType.VESSEL_CHARTERER,
      logoUrl: null,
    },
  });

  // 3) Ensure Memberships (composite unique [userId, clientId])
  await prisma.membership.upsert({
    where: {
      userId_clientId: { userId: seededUsers["owner"].id, clientId: ownerClient.id },
    },
    update: {},
    create: {
      userId: seededUsers["owner"].id,
      clientId: ownerClient.id,
    },
  });

  await prisma.membership.upsert({
    where: {
      userId_clientId: { userId: seededUsers["charterer"].id, clientId: chartererClient.id },
    },
    update: {},
    create: {
      userId: seededUsers["charterer"].id,
      clientId: chartererClient.id,
    },
  });

  // 4) Ensure Global Role for admin (BVS_ADMIN)
  await prisma.userGlobalRole.upsert({
    where: {
      userId_role: { userId: seededUsers["admin"].id, role: GlobalRole.BVS_ADMIN },
    },
    update: {},
    create: {
      userId: seededUsers["admin"].id,
      role: GlobalRole.BVS_ADMIN,
    },
  });

  console.log("Seed complete.");
  console.log("- Default password for all seeded users:", DEFAULT_PASSWORD);
  console.log("- Admin:", usersToSeed.find((u) => u.key === "admin")?.email);
  console.log("- Owner:", usersToSeed.find((u) => u.key === "owner")?.email);
  console.log("- Charterer:", usersToSeed.find((u) => u.key === "charterer")?.email);
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => prisma.$disconnect());
