import "fastify";
import type { UUID } from "./uuid";

declare module "fastify" {
  interface FastifyRequest {
    // Set by requireAuth preHandler
    user?: { id: UUID };
  }
}
