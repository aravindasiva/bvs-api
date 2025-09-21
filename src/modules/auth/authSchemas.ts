import { z } from "zod";
import { UserSchema } from "../users/userSchemas";

export const RegisterBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  avatarUrl: z.string().url().optional(),
});

export const LoginBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const RegisterResponseSchema = z.object({
  accessToken: z.string(),
  user: UserSchema,
});

export const LoginResponseSchema = z.object({
  accessToken: z.string(),
  user: UserSchema,
});

export const MembershipSummarySchema = z.object({
  clientId: z.string().uuid(),
  clientType: z.enum(["VESSEL_OWNER", "VESSEL_CHARTERER"]),
});

export const AuthMeResponseSchema = z.object({
  user: UserSchema,
  access: z.object({
    isBvsAdmin: z.boolean(),
    memberships: z.array(MembershipSummarySchema),
  }),
});

export const UnauthorizedSchema = z.object({ message: z.string() });
export const BadRequestSchema = z.object({ message: z.string() });
export const ConflictSchema = z.object({ message: z.string() });

export type RegisterBody = z.infer<typeof RegisterBodySchema>;
export type LoginBody = z.infer<typeof LoginBodySchema>;
