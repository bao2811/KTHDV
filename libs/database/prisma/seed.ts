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

  const hrRole = await prisma.role.upsert({
    where: { name: "HR" },
    update: {},
    create: { name: "HR", description: "HR role" },
  });

  const managerRole = await prisma.role.upsert({
    where: { name: "Manager" },
    update: {},
    create: { name: "Manager", description: "Manager role" },
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

  const hrPassword = await bcrypt.hash("HR@123", 12);
  const hrUser = await prisma.user.upsert({
    where: { email: "hr@recruitment.com" },
    update: {},
    create: {
      email: "hr@recruitment.com",
      password: hrPassword,
      roleId: hrRole.id,
      provider: "local",
    },
  });

  await prisma.profile.upsert({
    where: { userId: hrUser.id },
    update: {},
    create: {
      userId: hrUser.id,
      fullName: "HR Manager",
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

  // Pipeline Stages
  const stages = [
    { name: "Submitted", order: 1, color: "#3B82F6" },
    { name: "Screening", order: 2, color: "#9333EA" },
    { name: "Matched", order: 3, color: "#10B981" },
    { name: "Interviewing", order: 4, color: "#F59E0B" },
    { name: "Offered", order: 5, color: "#8B5CF6" },
  ];

  for (const stage of stages) {
    await prisma.pipelineStage.upsert({
      where: { name: stage.name },
      update: { order: stage.order, color: stage.color },
      create: stage,
    });
  }

  // Companies
  const companies = [
    { name: "FPT Software", industry: "Technology", size: "10000+", website: "https://fpt-software.com" },
    { name: "VNG Corporation", industry: "Internet", size: "2000-5000", website: "https://vng.com.vn" },
    { name: "Viettel Group", industry: "Telecommunications", size: "50000+", website: "https://viettel.com.vn" },
  ];

  for (const c of companies) {
    const existing = await prisma.company.findFirst({ where: { name: c.name } });
    if (!existing) {
      await prisma.company.create({ data: c });
    }
  }

  // Locations
  const locations = [
    { city: "Hanoi", district: "Cau Giay", address: "Duy Tan Street" },
    { city: "HCMC", district: "District 1", address: "Le Loi Street" },
    { city: "Da Nang", district: "Hai Chau", address: "Bach Dang Street" },
  ];

  for (const l of locations) {
    const existing = await prisma.location.findFirst({ 
      where: { city: l.city, district: l.district } 
    });
    if (!existing) {
      await prisma.location.create({ data: l });
    }
  }

  // Categories
  const categories = [
    "Software Development",
    "Data Science",
    "Product Management",
    "Design",
    "Marketing",
    "Sales",
  ];

  for (const name of categories) {
    const existing = await prisma.jobCategory.findFirst({ where: { name } });
    if (!existing) {
      await prisma.jobCategory.create({ data: { name } });
    }
  }

  // Skills
  const skills = [
    { name: "Node.js", category: "Backend" },
    { name: "React", category: "Frontend" },
    { name: "TypeScript", category: "Language" },
    { name: "PostgreSQL", category: "Database" },
    { name: "Docker", category: "DevOps" },
  ];

  for (const s of skills) {
    await prisma.skill.upsert({
      where: { name: s.name },
      update: { category: s.category },
      create: s,
    });
  }

  console.log("Seed done.");
  console.log("Admin: admin@recruitment.com / Admin@123");
  console.log("HR: hr@recruitment.com / HR@123");
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
