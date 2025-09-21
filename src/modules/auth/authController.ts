import type { FastifyReply, FastifyRequest } from "fastify";
import type { RegisterBody, LoginBody } from "./authSchemas";
import * as service from "./authService";
import { isPrismaKnownError } from "../../shared/errors/prisma";

export async function register(req: FastifyRequest<{ Body: RegisterBody }>, reply: FastifyReply) {
  try {
    const result = await service.register(req.server.prisma, req.body);
    if (result.type === "conflict") {
      return reply.code(409).send({ message: result.message });
    }
    return reply.code(201).send({ accessToken: result.accessToken, user: result.user });
  } catch (e: unknown) {
    if (isPrismaKnownError(e)) {
      req.log.error({ code: e.code, message: e.message }, "Prisma error on register");
    }
    throw e;
  }
}

export async function login(req: FastifyRequest<{ Body: LoginBody }>, reply: FastifyReply) {
  try {
    const result = await service.login(req.server.prisma, req.body);
    if (result.type === "unauthorized") {
      return reply.code(401).send({ message: result.message });
    }
    return reply.send({ accessToken: result.accessToken, user: result.user });
  } catch (e: unknown) {
    if (isPrismaKnownError(e)) {
      req.log.error({ code: e.code, message: e.message }, "Prisma error on login");
    }
    throw e;
  }
}

export async function me(req: FastifyRequest, reply: FastifyReply) {
  const userId = req.user?.id; // UUID (brand of string)
  if (!userId) {
    return reply.code(401).send({ message: "Unauthorized" });
  }
  const result = await service.getCurrentUser(req.server.prisma, userId);
  return reply.send(result);
}
