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

export async function register(prisma: PrismaClient, input: RegisterBody) 
{
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) 
{
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

  const accessToken = signAccessToken(user.id);
  return { type: "ok" as const, user, accessToken };
}

export async function login(prisma: PrismaClient, input: LoginBody) 
{
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user) 
{
return { type: "unauthorized" as const, message: "Invalid credentials" };
}

  const ok = await verifyPassword(input.password, user.passwordHash);
  if (!ok) 
{
return { type: "unauthorized" as const, message: "Invalid credentials" };
}

  const publicUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: publicUserSelect,
  });
  const accessToken = signAccessToken(user.id);
  return { type: "ok" as const, user: publicUser!, accessToken };
}

export async function getCurrentUser(prisma: PrismaClient, userId: string) 
{
  return prisma.user.findUnique({
    where: { id: userId },
    select: publicUserSelect,
  });
}
