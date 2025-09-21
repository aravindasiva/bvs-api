import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

// Re-export if you ever want to use it directly elsewhere
export { PrismaClientKnownRequestError };

/**
 * Type guard for Prisma known request errors
 */
export function isPrismaKnownError(e: unknown): e is PrismaClientKnownRequestError {
  return e instanceof PrismaClientKnownRequestError;
}

/**
 * P2002 — Unique constraint failed
 * Optionally check the constraint target if you want to be specific.
 */
export function isUniqueConstraintError(e: unknown, target?: string): boolean {
  if (!isPrismaKnownError(e)) {
    return false;
  }
  if (e.code !== "P2002") {
    return false;
  }

  if (target) {
    const metaTarget = (e.meta as { target?: string | string[] } | undefined)?.target;
    if (Array.isArray(metaTarget)) {
      return metaTarget.includes(target);
    }
    if (typeof metaTarget === "string") {
      return metaTarget === target;
    }
  }

  return true;
}

/**
 * P2025 — Record not found (for update/delete)
 */
export function isRecordNotFoundError(e: unknown): boolean {
  return isPrismaKnownError(e) && e.code === "P2025";
}
