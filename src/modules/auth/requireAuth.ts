import type { FastifyReply, FastifyRequest } from "fastify";
import { verifyAccessToken } from "../../shared/jwt";
import { parseUUID } from "../../types/uuid";

export async function requireAuth(req: FastifyRequest, reply: FastifyReply) 
{
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) 
{
return reply.code(401).send({ message: "Unauthorized" });
}

  try 
{
    const payload = verifyAccessToken(token); // { sub: string }
    const userId = parseUUID(payload.sub); // validate and brand as UUID
    req.user = { id: userId };
  }
 catch 
{
    return reply.code(401).send({ message: "Unauthorized" });
  }
}
