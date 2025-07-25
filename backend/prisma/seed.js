const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

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

  const config = await prisma.configuration.upsert({
    where: { userId: 1 },
    update: {},
    create: {
      userId: 1,
      confidenceLevel: 0.9,
      forecastHorizon: 4,
      alertThresholds: {
        max: 10000,
        min: 100,
      },
      notificationSettings: {
        email: false,
      },
    },
  });
  console.log("✅ Congiguration created:", config);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
