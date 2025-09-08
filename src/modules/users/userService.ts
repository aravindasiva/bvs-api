import type { PrismaClient } from "@prisma/client";
import type { CreateUserInput, UpdateUserInput, ListUsersQuery } from "./userSchemas";

export async function listUsers(prisma: PrismaClient, { limit, offset }: ListUsersQuery) {
  const [data, total] = await Promise.all([
    prisma.user.findMany({ take: limit, skip: offset, orderBy: { createdAt: "desc" } }),
    prisma.user.count(),
  ]);
  return { data, meta: { limit, offset, total } };
}

export async function getUserById(prisma: PrismaClient, id: string) {
  return prisma.user.findUnique({ where: { id } });
}

export async function createUser(prisma: PrismaClient, input: CreateUserInput) {
  return prisma.user.create({ data: input });
}

export async function updateUser(prisma: PrismaClient, id: string, input: UpdateUserInput) {
  return prisma.user.update({ where: { id }, data: input });
}

export async function deleteUser(prisma: PrismaClient, id: string) {
  await prisma.user.delete({ where: { id } });
}
