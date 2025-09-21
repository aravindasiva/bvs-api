import { z } from "zod";

export type UUID = string & { readonly __brand: "uuid" };

const uuidSchema = z.string().uuid();

export function parseUUID(value: string): UUID {
  // Validates at runtime and narrows to UUID at compile-time
  return uuidSchema.parse(value) as UUID;
}
