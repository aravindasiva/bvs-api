import "dotenv/config";
import Fastify from "fastify";
import { createLogger, genReqId } from "./config/logger";
import securityPlugin from "./plugins/security";
import systemRoutes from "./routes/systemRoute";
import dbRoutes from "./routes/dbRoute";
import prismaPlugin from "./plugins/prisma";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import {
  ZodTypeProvider,
  validatorCompiler,
  serializerCompiler,
  jsonSchemaTransform,
} from "fastify-type-provider-zod";
import userRoute from "./modules/users/userRoute";
import authRoute from "./modules/auth/authRoute";

const isProd = process.env.NODE_ENV === "production";

const app = Fastify({
  logger: createLogger(isProd),
  genReqId,
}).withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

await app.register(securityPlugin);

// Swagger with Bearer scheme
await app.register(swagger, {
  mode: "dynamic",
  openapi: {
    info: { title: "bvs-api", description: "API for bvs", version: "0.1.0" },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  transform: jsonSchemaTransform,
});

await app.register(swaggerUi, {
  routePrefix: "/docs",
  uiConfig: { docExpansion: "list", deepLinking: true },
});

await app.register(prismaPlugin);

// Infra routes (ops)
await app.register(systemRoutes);
await app.register(dbRoutes);

// Feature routes (domain)
await app.register(userRoute);
await app.register(authRoute);

await app.ready();

const port = Number(process.env.PORT ?? 3000);
const address = await app.listen({ port, host: "0.0.0.0" });
app.log.info(`bvs-api listening at ${address}`);
