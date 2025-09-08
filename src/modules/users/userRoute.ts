import type { FastifyPluginAsync } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import {
  CreateUserBodySchema,
  UpdateUserBodySchema,
  IdParamSchema,
  ListUsersQuerySchema,
  UserSchema,
  UsersListResponseSchema,
  NotFoundSchema,
  ConflictSchema,
} from "./userSchemas";
import { listUsers, getUser, createUser, updateUser, deleteUser } from "./userController";

const userRoute: FastifyPluginAsync = async (app) => {
  const api = app.withTypeProvider<ZodTypeProvider>();

  api.get(
    "/users",
    {
      schema: {
        tags: ["users"],
        summary: "List users",
        querystring: ListUsersQuerySchema,
        response: { 200: UsersListResponseSchema },
      },
    },
    listUsers,
  );

  api.get(
    "/users/:id",
    {
      schema: {
        tags: ["users"],
        summary: "Get user by id",
        params: IdParamSchema,
        response: { 200: UserSchema, 404: NotFoundSchema },
      },
    },
    getUser,
  );

  api.post(
    "/users",
    {
      schema: {
        tags: ["users"],
        summary: "Create user",
        body: CreateUserBodySchema,
        response: { 201: UserSchema, 409: ConflictSchema },
      },
    },
    createUser,
  );

  api.patch(
    "/users/:id",
    {
      schema: {
        tags: ["users"],
        summary: "Update user",
        params: IdParamSchema,
        body: UpdateUserBodySchema,
        response: { 200: UserSchema, 404: NotFoundSchema, 409: ConflictSchema },
      },
    },
    updateUser,
  );

  api.delete(
    "/users/:id",
    {
      schema: {
        tags: ["users"],
        summary: "Delete user",
        params: IdParamSchema,
        // Use a Zod schema for 204 or omit it entirely. z.void() also works fine here.
        response: { 204: z.null(), 404: NotFoundSchema },
      },
    },
    deleteUser,
  );
};

export default userRoute;
