import jwt, { SignOptions } from "jsonwebtoken";
import { authConfig } from "../config/auth";

type JwtAccessPayload = {
  sub: string;
  roles: string[];
  memberships: { clientId: string; clientType: "VESSEL_OWNER" | "VESSEL_CHARTERER" }[];
};

export function signAccessToken(
  userId: string,
  roles: string[],
  memberships: { clientId: string; clientType: "VESSEL_OWNER" | "VESSEL_CHARTERER" }[],
): string {
  return jwt.sign(
    { sub: userId, roles, memberships } as JwtAccessPayload,
    authConfig.jwtAccessSecret,
    {
      expiresIn: authConfig.accessTokenTtl,
      algorithm: "HS256",
    } as SignOptions,
  );
}

export function verifyAccessToken(token: string): JwtAccessPayload {
  return jwt.verify(token, authConfig.jwtAccessSecret, {
    algorithms: ["HS256"],
  }) as JwtAccessPayload;
}
