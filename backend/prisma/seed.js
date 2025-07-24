import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("password123", 10);

  const user = await prisma.user.upsert({
    where: { email: "admin@test.com" },
    update: {},
    create: {
      email: "admin@test.com",
      password: password,
      role: "ADMIN",
    },
  });

  console.log("✅ Usuario creado:", user);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
