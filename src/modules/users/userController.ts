import type { FastifyReply, FastifyRequest } from "fastify";
import type { IdParam, CreateUserInput, UpdateUserInput, ListUsersQuery } from "./userSchemas";
import * as service from "./userService";
import {
  isPrismaKnownError,
  isRecordNotFoundError,
  isUniqueConstraintError,
} from "../../shared/errors/prisma";

export async function listUsers(req: FastifyRequest, reply: FastifyReply): Promise<void> {
  const { limit, offset } = req.query as ListUsersQuery;
  const result = await service.listUsers(req.server.prisma, { limit, offset });
  reply.send(result);
}

export async function getUser(req: FastifyRequest, reply: FastifyReply): Promise<void> {
  const { id } = req.params as IdParam;
  const user = await service.getUserById(req.server.prisma, id);
  if (!user) {
    reply.code(404).send({ message: "User not found" });
    return;
  }
  reply.send(user);
}

export async function createUser(req: FastifyRequest, reply: FastifyReply): Promise<void> {
  try {
    const input = req.body as CreateUserInput;
    const user = await service.createUser(req.server.prisma, input);
    reply.code(201).send(user);
  } catch (e: unknown) {
    if (isUniqueConstraintError(e)) {
      reply.code(409).send({ message: "Email already exists" });
      return;
    }
    if (isPrismaKnownError(e)) {
      req.log.error({ code: e.code, message: e.message }, "Prisma known error on createUser");
    }
    throw e;
  }
}

export async function updateUser(req: FastifyRequest, reply: FastifyReply): Promise<void> {
  const { id } = req.params as IdParam;
  try {
    const input = req.body as UpdateUserInput;
    const user = await service.updateUser(req.server.prisma, id, input);
    if (!user) {
      reply.code(404).send({ message: "User not found" });
      return;
    }
    reply.send(user);
  } catch (e: unknown) {
    if (isRecordNotFoundError(e)) {
      reply.code(404).send({ message: "User not found" });
      return;
    }
    if (isUniqueConstraintError(e)) {
      reply.code(409).send({ message: "Email already exists" });
      return;
    }
    if (isPrismaKnownError(e)) {
      req.log.error({ code: e.code, message: e.message }, "Prisma known error on updateUser");
    }
    throw e;
  }
}

export async function deleteUser(req: FastifyRequest, reply: FastifyReply): Promise<void> {
  const { id } = req.params as IdParam;
  try {
    await service.deleteUser(req.server.prisma, id);
    reply.code(204).send();
  } catch (e: unknown) {
    if (isRecordNotFoundError(e)) {
      reply.code(404).send({ message: "User not found" });
      return;
    }
    if (isPrismaKnownError(e)) {
      req.log.error({ code: e.code, message: e.message }, "Prisma known error on deleteUser");
    }
    throw e;
  }
}
