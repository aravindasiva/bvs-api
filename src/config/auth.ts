function required(name: string): string {
  const v = process.env[name];
  if (!v) {
    throw new Error(
      `Missing required env var: ${name}. Set it in .env. See .env.example for instructions.`,
    );
  }
  return v;
}

export const authConfig = {
  jwtAccessSecret: required("JWT_ACCESS_SECRET"),
  accessTokenTtl: process.env.ACCESS_TOKEN_TTL ?? "1d",
};
