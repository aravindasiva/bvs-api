import jwt from "jsonwebtoken";
import { authConfig } from "../config/auth";

type JwtAccessPayload = { sub: string };

export function signAccessToken(userId: string): string 
{
  return jwt.sign({ sub: userId } as JwtAccessPayload, authConfig.jwtAccessSecret, {
    expiresIn: authConfig.accessTokenTtl,
    algorithm: "HS256",
  });
}

export function verifyAccessToken(token: string): JwtAccessPayload 
{
  return jwt.verify(token, authConfig.jwtAccessSecret, {
    algorithms: ["HS256"],
  }) as JwtAccessPayload;
}
