import "fastify";
import { AppUser } from "#app/access/accessControl.js";

declare module "fastify" {
  interface FastifyRequest {
    user: AppUser;
  }
}
