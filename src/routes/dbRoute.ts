import type { FastifyPluginAsync } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

const OkSchema = z.object({ ok: z.boolean() });

const dbRoutes: FastifyPluginAsync = async (app) => {
  const api = app.withTypeProvider<ZodTypeProvider>();

  api.get(
    "/db/ping",
    {
      schema: {
        tags: ["db"],
        summary: "DB connectivity check",
        response: {
          200: OkSchema,
        },
      },
    },
    async (req) => {
      // If you have prisma on req.server.prisma, optionally do a lightweight query
      try {
        await req.server.prisma.$queryRawUnsafe("SELECT 1");
        return { ok: true };
      } catch {
        return { ok: false };
      }
    },
  );
};

export default dbRoutes;
