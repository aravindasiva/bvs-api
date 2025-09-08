import type { FastifyReply, FastifyRequest } from "fastify";
import type { IdParam, CreateUserInput, UpdateUserInput, ListUsersQuery } from "./userSchemas";
import * as service from "./userService";
import {
  isPrismaKnownError,
  isRecordNotFoundError,
  isUniqueConstraintError,
} from "../../shared/errors/prisma";

export async function listUsers(req: FastifyRequest<{ Querystring: ListUsersQuery }>) {
  const { limit, offset } = req.query;
  return service.listUsers(req.server.prisma, { limit, offset });
}

export async function getUser(req: FastifyRequest<{ Params: IdParam }>, reply: FastifyReply) {
  const { id } = req.params;
  const user = await service.getUserById(req.server.prisma, id);
  if (!user) return reply.code(404).send({ message: "User not found" });
  return user;
}

export async function createUser(
  req: FastifyRequest<{ Body: CreateUserInput }>,
  reply: FastifyReply,
) {
  try {
    const user = await service.createUser(req.server.prisma, req.body);
    return reply.code(201).send(user);
  } catch (e: unknown) {
    if (isUniqueConstraintError(e)) {
      return reply.code(409).send({ message: "Email already exists" });
    }
    if (isPrismaKnownError(e)) {
      req.log.error({ code: e.code, message: e.message }, "Prisma known error on createUser");
    }
    throw e;
  }
}

export async function updateUser(
  req: FastifyRequest<{ Params: IdParam; Body: UpdateUserInput }>,
  reply: FastifyReply,
) {
  const { id } = req.params;
  try {
    const user = await service.updateUser(req.server.prisma, id, req.body);
    return user;
  } catch (e: unknown) {
    if (isRecordNotFoundError(e)) {
      return reply.code(404).send({ message: "User not found" });
    }
    if (isUniqueConstraintError(e)) {
      return reply.code(409).send({ message: "Email already exists" });
    }
    if (isPrismaKnownError(e)) {
      req.log.error({ code: e.code, message: e.message }, "Prisma known error on updateUser");
    }
    throw e;
  }
}

export async function deleteUser(req: FastifyRequest<{ Params: IdParam }>, reply: FastifyReply) {
  const { id } = req.params;
  try {
    await service.deleteUser(req.server.prisma, id);
    return reply.code(204).send();
  } catch (e: unknown) {
    if (isRecordNotFoundError(e)) {
      return reply.code(404).send({ message: "User not found" });
    }
    if (isPrismaKnownError(e)) {
      req.log.error({ code: e.code, message: e.message }, "Prisma known error on deleteUser");
    }
    throw e;
  }
}
