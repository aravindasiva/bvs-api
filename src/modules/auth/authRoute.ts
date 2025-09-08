import type { FastifyPluginAsync } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import {
  RegisterBodySchema,
  LoginBodySchema,
  RegisterResponseSchema,
  LoginResponseSchema,
  UnauthorizedSchema,
  BadRequestSchema,
  ConflictSchema,
} from "./authSchemas";
import { UserSchema } from "../users/userSchemas";
import * as controller from "./authController";
import { requireAuth } from "./requireAuth";

const authRoute: FastifyPluginAsync = async (app) => 
{
  const api = app.withTypeProvider<ZodTypeProvider>();

  api.post(
    "/auth/register",
    {
      schema: {
        tags: ["auth"],
        summary: "Register a new user",
        body: RegisterBodySchema,
        response: { 201: RegisterResponseSchema, 400: BadRequestSchema, 409: ConflictSchema },
      },
    },
    controller.register,
  );

  api.post(
    "/auth/login",
    {
      schema: {
        tags: ["auth"],
        summary: "Login with email and password",
        body: LoginBodySchema,
        response: { 200: LoginResponseSchema, 400: BadRequestSchema, 401: UnauthorizedSchema },
      },
    },
    controller.login,
  );

  api.get(
    "/auth/me",
    {
      schema: {
        tags: ["auth"],
        summary: "Get current user using Bearer token",
        response: { 200: z.object({ user: UserSchema }), 401: UnauthorizedSchema },
        security: [{ bearerAuth: [] }], // <-- tells Swagger this route needs Bearer token
      },
      preHandler: [requireAuth],
    },
    controller.me,
  );
};

export default authRoute;
