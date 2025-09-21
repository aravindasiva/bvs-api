import type { PrismaClient } from "@prisma/client";
import { hashPassword, verifyPassword } from "../../shared/crypto";
import { signAccessToken } from "../../shared/jwt";
import type { RegisterBody, LoginBody } from "./authSchemas";

const publicUserSelect = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  avatarUrl: true,
  createdAt: true,
  updatedAt: true,
} as const;

// Helper to fetch global roles
async function getUserGlobalRoles(prisma: PrismaClient, userId: string): Promise<string[]> {
  const roles = await prisma.userGlobalRole.findMany({
    where: { userId },
    select: { role: true },
  });
  return roles.map((r) => r.role);
}

export async function register(prisma: PrismaClient, input: RegisterBody) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) {
    return { type: "conflict" as const, message: "Email already exists" };
  }

  const passwordHash = await hashPassword(input.password);
  const user = await prisma.user.create({
    data: {
      email: input.email,
      firstName: input.firstName,
      lastName: input.lastName,
      avatarUrl: input.avatarUrl,
      passwordHash,
    },
    select: publicUserSelect,
  });

  const roles = await getUserGlobalRoles(prisma, user.id);
  const accessToken = signAccessToken(user.id, roles);
  return { type: "ok" as const, user, accessToken };
}

export async function login(prisma: PrismaClient, input: LoginBody) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user) {
    return { type: "unauthorized" as const, message: "Invalid credentials" };
  }

  const ok = await verifyPassword(input.password, user.passwordHash);
  if (!ok) {
    return { type: "unauthorized" as const, message: "Invalid credentials" };
  }

  const publicUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: publicUserSelect,
  });

  const roles = await getUserGlobalRoles(prisma, user.id);
  const accessToken = signAccessToken(user.id, roles);
  return { type: "ok" as const, user: publicUser!, accessToken };
}

// Expand getCurrentUser for /auth/me
export async function getCurrentUser(prisma: PrismaClient, userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: publicUserSelect,
  });
  if (!user) return null;

  // Fetch roles and memberships
  const roles = await getUserGlobalRoles(prisma, userId);

  // isBvsAdmin if any role is BVS_ADMIN
  const isBvsAdmin = roles.includes("BVS_ADMIN");

  // Fetch memberships and client types
  const memberships = await prisma.membership.findMany({
    where: { userId },
    include: { client: { select: { id: true, type: true } } },
  });

  const accessMemberships = memberships.map((m) => ({
    clientId: m.client.id,
    clientType: m.client.type,
  }));

  return {
    user,
    access: {
      isBvsAdmin,
      memberships: accessMemberships,
    },
  };
}
