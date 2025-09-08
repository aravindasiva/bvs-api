import type { FastifyPluginAsync } from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";

const securityPlugin: FastifyPluginAsync = async (app) => 
{
  await app.register(cors, { origin: process.env.CORS_ORIGIN ?? "*" });
  await app.register(helmet);
};

export default securityPlugin;
