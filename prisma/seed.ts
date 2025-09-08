import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
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

  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: { firstName: u.firstName, lastName: u.lastName, avatarUrl: u.avatarUrl },
      create: u,
    });
  }
}

main()
  .then(() => console.log("Seed complete"))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => prisma.$disconnect());
