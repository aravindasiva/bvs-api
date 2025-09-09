import bcrypt from "bcryptjs";

export async function hashPassword(password: string): Promise<string> 
{
  // Use a stronger cost than 10 by default
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, passwordHash: string): Promise<boolean> 
{
  return bcrypt.compare(password, passwordHash);
}
