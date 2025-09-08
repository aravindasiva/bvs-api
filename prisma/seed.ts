import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/shared/crypto";

const prisma = new PrismaClient();

async function main() 
{
  const DEFAULT_PASSWORD = "ChangeMe123!";

  const users = [
    {
      email: "test@example.com",
      firstName: "Test",
      lastName: "User",
      avatarUrl: "https://i.pravatar.cc/150?img=12",
    },
    {
      email: "alice@example.com",
      firstName: "Alice",
      lastName: "Anderson",
      avatarUrl: "https://i.pravatar.cc/150?img=1",
    },
    {
      email: "bob@example.com",
      firstName: "Bob",
      lastName: "Baker",
      avatarUrl: "https://i.pravatar.cc/150?img=2",
    },
    { email: "carol@example.com", firstName: "Carol", lastName: "Clark", avatarUrl: null },
  ];

  for (const u of users) 
{
    const passwordHash = await hashPassword(DEFAULT_PASSWORD);

    await prisma.user.upsert({
      where: { email: u.email },
      update: {
        firstName: u.firstName,
        lastName: u.lastName,
        avatarUrl: u.avatarUrl,
        passwordHash,
      },
      create: {
        ...u,
        passwordHash,
      },
    });
  }

  console.log("Seed complete. Default password for all users:", DEFAULT_PASSWORD);
}

main()
  .catch((e) => 
{
    console.error(e);
    process.exit(1);
  })
  .finally(async () => prisma.$disconnect());
