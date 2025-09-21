import type { FastifyReply, FastifyRequest } from "fastify";
import { verifyAccessToken } from "../../shared/jwt";
import { parseUUID } from "../../types/uuid";
import type { AppUser } from "../../access/accessControl";

export async function requireAuth(req: FastifyRequest, reply: FastifyReply) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) return reply.code(401).send({ message: "Unauthorized" });

  try {
    const payload = verifyAccessToken(token); // should include sub, roles, memberships
    const userId = parseUUID(payload.sub);
    req.user = {
      id: userId,
      roles: payload.roles,
      memberships: payload.memberships,
    } as AppUser;
  } catch {
    return reply.code(401).send({ message: "Unauthorized" });
  }
}
