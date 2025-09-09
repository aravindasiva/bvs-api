import fp from "fastify-plugin";
import { PrismaClient } from "@prisma/client";

declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

const prismaPlugin = fp(async (app) => 
{
  const prisma = new PrismaClient();

  app.decorate("prisma", prisma);

  app.addHook("onClose", async (app) => 
{
    await app.prisma.$disconnect();
  });
});

export default prismaPlugin;
