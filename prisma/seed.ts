import { PrismaClient, ClientType, GlobalRole } from "@prisma/client";
import { hashPassword } from "../src/shared/crypto";

const prisma = new PrismaClient();

async function main() {
  const DEFAULT_PASSWORD = "test12345";

  // 1) Ensure base users (add extra admins, owners, charterers for testing)
  const usersToSeed = [
    {
      key: "admin",
      email: "admin@bvs.com",
      firstName: "BVS",
      lastName: "Admin",
      avatarUrl: "https://i.pravatar.cc/150?img=10",
    },
    {
      key: "admin2",
      email: "admin2@test.com",
      firstName: "Admin2",
      lastName: "Test",
      avatarUrl: "https://i.pravatar.cc/150?img=13",
    },
    {
      key: "owner1",
      email: "owner1@test.com",
      firstName: "Owen",
      lastName: "Owner1",
      avatarUrl: "https://i.pravatar.cc/150?img=11",
    },
    {
      key: "owner2",
      email: "owner2@test.com",
      firstName: "Oscar",
      lastName: "Owner2",
      avatarUrl: "https://i.pravatar.cc/150?img=14",
    },
    {
      key: "charterer1",
      email: "charterer1@test.com",
      firstName: "Charlie",
      lastName: "Charterer1",
      avatarUrl: "https://i.pravatar.cc/150?img=12",
    },
    {
      key: "charterer2",
      email: "charterer2@test.com",
      firstName: "Chloe",
      lastName: "Charterer2",
      avatarUrl: "https://i.pravatar.cc/150?img=15",
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

  const ownerClient2 = await prisma.client.upsert({
    where: { name: "OwnerCo2" },
    update: { type: ClientType.VESSEL_OWNER },
    create: {
      name: "OwnerCo2",
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

  const chartererClient2 = await prisma.client.upsert({
    where: { name: "ChartererCo2" },
    update: { type: ClientType.VESSEL_CHARTERER },
    create: {
      name: "ChartererCo2",
      type: ClientType.VESSEL_CHARTERER,
      logoUrl: null,
    },
  });

  // 3) Ensure Memberships (composite unique [userId, clientId])
  await prisma.membership.upsert({
    where: {
      userId_clientId: { userId: seededUsers["owner1"].id, clientId: ownerClient.id },
    },
    update: {},
    create: {
      userId: seededUsers["owner1"].id,
      clientId: ownerClient.id,
    },
  });

  await prisma.membership.upsert({
    where: {
      userId_clientId: { userId: seededUsers["owner2"].id, clientId: ownerClient2.id },
    },
    update: {},
    create: {
      userId: seededUsers["owner2"].id,
      clientId: ownerClient2.id,
    },
  });

  await prisma.membership.upsert({
    where: {
      userId_clientId: { userId: seededUsers["charterer1"].id, clientId: chartererClient.id },
    },
    update: {},
    create: {
      userId: seededUsers["charterer1"].id,
      clientId: chartererClient.id,
    },
  });

  await prisma.membership.upsert({
    where: {
      userId_clientId: { userId: seededUsers["charterer2"].id, clientId: chartererClient2.id },
    },
    update: {},
    create: {
      userId: seededUsers["charterer2"].id,
      clientId: chartererClient2.id,
    },
  });

  // 4) Ensure Global Role for admins (BVS_ADMIN)
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

  await prisma.userGlobalRole.upsert({
    where: {
      userId_role: { userId: seededUsers["admin2"].id, role: GlobalRole.BVS_ADMIN },
    },
    update: {},
    create: {
      userId: seededUsers["admin2"].id,
      role: GlobalRole.BVS_ADMIN,
    },
  });

  console.log("Seed complete.");
  console.log("- Default password for all seeded users:", DEFAULT_PASSWORD);
  usersToSeed.forEach((u) => {
    console.log(`- ${u.key}: ${u.email}`);
  });
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => prisma.$disconnect());
