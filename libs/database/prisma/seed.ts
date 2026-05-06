import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding minimal test data...");

  const adminRole = await prisma.role.upsert({
    where: { name: "Admin" },
    update: {},
    create: { name: "Admin", description: "Admin role" },
  });

  const candidateRole = await prisma.role.upsert({
    where: { name: "Candidate" },
    update: {},
    create: { name: "Candidate", description: "Candidate role" },
  });

  const adminPassword = await bcrypt.hash("Admin@123", 12);
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@recruitment.com" },
    update: {},
    create: {
      email: "admin@recruitment.com",
      password: adminPassword,
      roleId: adminRole.id,
      provider: "local",
    },
  });

  await prisma.profile.upsert({
    where: { userId: adminUser.id },
    update: {},
    create: {
      userId: adminUser.id,
      fullName: "System Admin",
    },
  });

  const candidatePassword = await bcrypt.hash("Candidate@123", 12);
  const candidateUser = await prisma.user.upsert({
    where: { email: "candidate@recruitment.com" },
    update: {},
    create: {
      email: "candidate@recruitment.com",
      password: candidatePassword,
      roleId: candidateRole.id,
      provider: "local",
    },
  });

  await prisma.candidateProfile.upsert({
    where: { userId: candidateUser.id },
    update: {},
    create: {
      userId: candidateUser.id,
      fullName: "Test Candidate",
    },
  });

  await prisma.pipelineStage.upsert({
    where: { name: "Submitted" },
    update: { order: 1, color: "#3B82F6" },
    create: { name: "Submitted", order: 1, color: "#3B82F6" },
  });

  console.log("Seed done.");
  console.log("Admin: admin@recruitment.com / Admin@123");
  console.log("Candidate: candidate@recruitment.com / Candidate@123");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
