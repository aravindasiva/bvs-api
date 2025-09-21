import type { PrismaClient } from "@prisma/client";
import type { CreateUserInput, ListUsersQuery, UpdateUserInput } from "./userSchemas";
import { hashPassword } from "../../shared/crypto";
import type { ClientType } from "../../access/accessControl";

const publicUserSelect = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  avatarUrl: true,
  createdAt: true,
  updatedAt: true,
  memberships: {
    select: {
      clientId: true,
      client: {
        select: { type: true }, // We'll alias it in your logic below
      },
    },
  },
} as const;

export async function listUsers(
  prisma: PrismaClient,
  { limit, offset }: ListUsersQuery,
  clientType?: ClientType,
) {
  const where = clientType ? { memberships: { some: { client: { type: clientType } } } } : {};

  const [data, total] = await Promise.all([
    prisma.user.findMany({
      skip: offset,
      take: limit,
      orderBy: { createdAt: "desc" },
      where,
      select: publicUserSelect,
    }),
    prisma.user.count({ where }),
  ]);

  return {
    data,
    meta: { limit, offset, total },
  };
}

export async function getUserById(prisma: PrismaClient, id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: publicUserSelect,
  });
}

export async function createUser(prisma: PrismaClient, input: CreateUserInput) {
  const passwordHash = await hashPassword(input.password);
  return prisma.user.create({
    data: {
      email: input.email,
      firstName: input.firstName,
      lastName: input.lastName,
      avatarUrl: input.avatarUrl,
      passwordHash,
    },
    select: publicUserSelect,
  });
}

export async function updateUser(prisma: PrismaClient, id: string, input: UpdateUserInput) {
  const data: Record<string, unknown> = {};

  if (typeof input.email !== "undefined") {
    data.email = input.email;
  }
  if ("firstName" in input) {
    data.firstName = input.firstName ?? null;
  }
  if ("lastName" in input) {
    data.lastName = input.lastName ?? null;
  }
  if ("avatarUrl" in input) {
    data.avatarUrl = input.avatarUrl ?? null;
  }
  if (typeof input.password !== "undefined") {
    data.passwordHash = await hashPassword(input.password);
  }

  return prisma.user.update({
    where: { id },
    data,
    select: publicUserSelect,
  });
}

export async function deleteUser(prisma: PrismaClient, id: string) {
  await prisma.user.delete({ where: { id } });
}
