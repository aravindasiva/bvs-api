import type { FastifyPluginAsync } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

const OkSchema = z.object({ ok: z.boolean() });

const systemRoutes: FastifyPluginAsync = async (app) => 
{
  const api = app.withTypeProvider<ZodTypeProvider>();

  api.get(
    "/health",
    {
      schema: {
        tags: ["system"],
        summary: "Health check",
        response: {
          200: OkSchema,
        },
      },
    },
    async () => ({ ok: true }),
  );

  api.get(
    "/ready",
    {
      schema: {
        tags: ["system"],
        summary: "Readiness check",
        response: {
          200: OkSchema,
        },
      },
    },
    async () => ({ ok: true }),
  );
};

export default systemRoutes;
