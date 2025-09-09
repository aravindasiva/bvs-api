import { z } from "zod";

export const IdParamSchema = z.object({
  id: z.string().uuid("Invalid UUID"),
});

export const ListUsersQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});

export const CreateUserBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(8), // REQUIRED now that passwordHash is NOT NULL
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  avatarUrl: z.string().url().optional(),
});

export const UpdateUserBodySchema = z
  .object({
    email: z.string().email().optional(),
    password: z.string().min(8).optional(),
    firstName: z.string().min(1).nullable().optional(),
    lastName: z.string().min(1).nullable().optional(),
    avatarUrl: z.string().url().nullable().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, { message: "No fields to update" });

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  avatarUrl: z.string().url().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const UsersListResponseSchema = z.object({
  data: z.array(UserSchema),
  meta: z.object({
    limit: z.number().int(),
    offset: z.number().int(),
    total: z.number().int(),
  }),
});

export const NotFoundSchema = z.object({ message: z.string() });
export const ConflictSchema = z.object({ message: z.string() });

export type IdParam = z.infer<typeof IdParamSchema>;
export type ListUsersQuery = z.infer<typeof ListUsersQuerySchema>;
export type CreateUserInput = z.infer<typeof CreateUserBodySchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserBodySchema>;
export type User = z.infer<typeof UserSchema>;
