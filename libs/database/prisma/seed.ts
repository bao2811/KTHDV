import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

const permissions = [
  ["dashboard", "read"],
  ["users", "read"],
  ["users", "create"],
  ["users", "update"],
  ["users", "delete"],
  ["roles", "read"],
  ["roles", "create"],
  ["roles", "update"],
  ["roles", "delete"],
  ["companies", "read"],
  ["companies", "create"],
  ["companies", "update"],
  ["companies", "delete"],
  ["master-data", "read"],
  ["master-data", "create"],
  ["master-data", "update"],
  ["master-data", "delete"],
  ["jobs", "read"],
  ["jobs", "create"],
  ["jobs", "update"],
  ["jobs", "delete"],
  ["applications", "read"],
  ["applications", "update"],
  ["interviews", "read"],
  ["interviews", "create"],
  ["interviews", "update"],
  ["interviews", "delete"],
  ["referrals", "read"],
  ["referrals", "update"],
  ["settings", "read"],
] as const;

const rolePermissionMap: Record<string, string[]> = {
  Admin: permissions.map(([resource, action]) => `${resource}:${action}`),
  HR: [
    "dashboard:read",
    "companies:read",
    "master-data:read",
    "jobs:read",
    "jobs:create",
    "jobs:update",
    "applications:read",
    "applications:update",
    "interviews:read",
    "interviews:create",
    "interviews:update",
    "referrals:read",
    "referrals:update",
  ],
  Candidate: ["jobs:read", "applications:read", "interviews:read"],
};

async function syncRolePermissions(roleName: string, permissionKeys: string[]) {
  const role = await prisma.role.findUnique({ where: { name: roleName } });
  if (!role) return;

  const permissionRows: Array<{
    id: number;
    resource: string;
    action: string;
  }> = await prisma.permission.findMany();
  const selectedIds = permissionRows
    .filter((permission: { resource: string; action: string }) =>
      permissionKeys.includes(`${permission.resource}:${permission.action}`),
    )
    .map((permission: { id: number }) => permission.id);

  await prisma.rolePermission.deleteMany({ where: { roleId: role.id } });
  if (selectedIds.length > 0) {
    await prisma.rolePermission.createMany({
      data: selectedIds.map((permissionId: number) => ({
        roleId: role.id,
        permissionId,
      })),
      skipDuplicates: true,
    });
  }
}

async function upsertUser(
  email: string,
  password: string,
  roleId: number,
  fullName: string,
) {
  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      roleId,
      provider: "local",
      status: "ACTIVE",
    },
    create: {
      email,
      password: hashedPassword,
      roleId,
      provider: "local",
      status: "ACTIVE",
    },
  });

  await prisma.profile.upsert({
    where: { userId: user.id },
    update: { fullName },
    create: { userId: user.id, fullName },
  });

  return user;
}

async function upsertCompany(data: {
  name: string;
  logoUrl?: string;
  industry?: string;
  size?: string;
  website?: string;
  description?: string;
}) {
  const existing = await prisma.company.findFirst({
    where: { name: data.name },
  });
  if (existing) {
    return prisma.company.update({ where: { id: existing.id }, data });
  }
  return prisma.company.create({ data });
}

async function upsertLocation(data: {
  city: string;
  district?: string;
  address?: string;
}) {
  const existing = await prisma.location.findFirst({
    where: {
      city: data.city,
      district: data.district,
      address: data.address,
    },
  });
  if (existing) {
    return prisma.location.update({ where: { id: existing.id }, data });
  }
  return prisma.location.create({ data });
}

async function upsertCategory(name: string) {
  const existing = await prisma.jobCategory.findFirst({ where: { name } });
  if (existing) {
    return prisma.jobCategory.update({
      where: { id: existing.id },
      data: { name },
    });
  }
  return prisma.jobCategory.create({ data: { name } });
}

async function upsertJob(data: {
  title: string;
  description: string;
  salaryMin: number;
  salaryMax: number;
  experienceYears: number;
  jobType: "FULL_TIME" | "PART_TIME" | "REMOTE";
  status: "DRAFT" | "PENDING" | "ACTIVE" | "CLOSED" | "EXPIRED";
  companyId: number;
  categoryId: number;
  locationId: number;
  createdByUserId: number;
  skills: Array<{
    skillId: number;
    level: "REQUIRED" | "NICE_TO_HAVE";
    minYears: number;
  }>;
}) {
  const existing = await prisma.job.findFirst({
    where: { title: data.title, companyId: data.companyId },
  });

  const jobData = {
    title: data.title,
    description: data.description,
    salaryMin: data.salaryMin,
    salaryMax: data.salaryMax,
    experienceYears: data.experienceYears,
    jobType: data.jobType,
    status: data.status,
    companyId: data.companyId,
    categoryId: data.categoryId,
    locationId: data.locationId,
    createdByUserId: data.createdByUserId,
    publishedAt: data.status === "ACTIVE" ? new Date() : null,
    expiredAt: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
  };

  const job = existing
    ? await prisma.job.update({ where: { id: existing.id }, data: jobData })
    : await prisma.job.create({ data: jobData });

  await prisma.jobSkill.deleteMany({ where: { jobId: job.id } });
  await prisma.jobSkill.createMany({
    data: data.skills.map((skill) => ({ jobId: job.id, ...skill })),
    skipDuplicates: true,
  });

  return job;
}

async function main() {
  console.log("Seeding Nexus Talent data...");

  const [adminRole, hrRole, candidateRole] = await Promise.all([
    prisma.role.upsert({
      where: { name: "Admin" },
      update: { description: "System administrator" },
      create: { name: "Admin", description: "System administrator" },
    }),
    prisma.role.upsert({
      where: { name: "HR" },
      update: { description: "Recruiter and hiring team" },
      create: { name: "HR", description: "Recruiter and hiring team" },
    }),
    prisma.role.upsert({
      where: { name: "Candidate" },
      update: { description: "Job seeker" },
      create: { name: "Candidate", description: "Job seeker" },
    }),
  ]);

  for (const [resource, action] of permissions) {
    await prisma.permission.upsert({
      where: { resource_action: { resource, action } },
      update: {},
      create: { resource, action },
    });
  }

  for (const [roleName, permissionKeys] of Object.entries(rolePermissionMap)) {
    await syncRolePermissions(roleName, permissionKeys);
  }

  const adminUser = await upsertUser(
    "admin@recruitment.com",
    "Admin@123",
    adminRole.id,
    "System Admin",
  );

  const hrUsers = await Promise.all([
    upsertUser(
      "hr.fpt@recruitment.com",
      "HR@123",
      hrRole.id,
      "Nguyen Thi HR FPT",
    ),
    upsertUser(
      "hr.vng@recruitment.com",
      "HR@123",
      hrRole.id,
      "Tran Minh HR VNG",
    ),
    upsertUser(
      "hr.viettel@recruitment.com",
      "HR@123",
      hrRole.id,
      "Le Anh HR Viettel",
    ),
  ]);

  const candidateUser = await upsertUser(
    "candidate@recruitment.com",
    "Candidate@123",
    candidateRole.id,
    "Test Candidate",
  );

  const candidateProfile = await prisma.candidateProfile.upsert({
    where: { userId: candidateUser.id },
    update: {
      fullName: "Test Candidate",
      phone: "0909000001",
      address: "Ha Noi",
      summary: "Frontend developer with React and TypeScript experience.",
    },
    create: {
      userId: candidateUser.id,
      fullName: "Test Candidate",
      phone: "0909000001",
      address: "Ha Noi",
      summary: "Frontend developer with React and TypeScript experience.",
    },
  });

  await prisma.workExperience.deleteMany({
    where: { profileId: candidateProfile.id },
  });
  await prisma.workExperience.createMany({
    data: [
      {
        profileId: candidateProfile.id,
        companyName: "Nexus Lab",
        position: "Frontend Developer",
        startDate: new Date("2022-01-01"),
        endDate: new Date("2025-01-01"),
        description: "Built React dashboards and recruitment workflows.",
      },
    ],
  });

  await prisma.education.deleteMany({
    where: { profileId: candidateProfile.id },
  });
  await prisma.education.createMany({
    data: [
      {
        profileId: candidateProfile.id,
        schoolName: "Vietnam National University",
        degree: "Bachelor",
        major: "Computer Science",
        startDate: new Date("2018-09-01"),
        endDate: new Date("2022-06-01"),
      },
    ],
  });

  await Promise.all([
    prisma.pipelineStage.upsert({
      where: { name: "Submitted" },
      update: { order: 1, color: "#3B82F6" },
      create: { name: "Submitted", order: 1, color: "#3B82F6" },
    }),
    prisma.pipelineStage.upsert({
      where: { name: "Screening" },
      update: { order: 2, color: "#F59E0B" },
      create: { name: "Screening", order: 2, color: "#F59E0B" },
    }),
    prisma.pipelineStage.upsert({
      where: { name: "Interviewing" },
      update: { order: 3, color: "#8B5CF6" },
      create: { name: "Interviewing", order: 3, color: "#8B5CF6" },
    }),
    prisma.pipelineStage.upsert({
      where: { name: "Offered" },
      update: { order: 4, color: "#10B981" },
      create: { name: "Offered", order: 4, color: "#10B981" },
    }),
  ]);

  const companies = await Promise.all([
    upsertCompany({
      name: "FPT Software",
      logoUrl:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/FPT_Software_logo.svg/1200px-FPT_Software_logo.svg.png",
      industry: "Information Technology",
      size: "10000+",
      website: "https://fptsoftware.com",
      description: "Global IT services and digital transformation company.",
    }),
    upsertCompany({
      name: "VNG Corporation",
      logoUrl:
        "https://upload.wikimedia.org/wikipedia/commons/b/b5/VNG_Logo.png",
      industry: "Internet",
      size: "2000-5000",
      website: "https://vng.com.vn",
      description:
        "Vietnamese technology company focused on platforms and games.",
    }),
    upsertCompany({
      name: "Viettel Group",
      logoUrl:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Viettel_logo_2021.svg/1200px-Viettel_logo_2021.svg.png",
      industry: "Telecommunications",
      size: "50000+",
      website: "https://viettel.com.vn",
      description: "Telecommunications and technology group.",
    }),
    upsertCompany({
      name: "Shopee Vietnam",
      logoUrl:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Shopee.svg/1200px-Shopee.svg.png",
      industry: "E-commerce",
      size: "1000-5000",
      website: "https://shopee.vn",
      description: "E-commerce marketplace in Southeast Asia.",
    }),
    upsertCompany({
      name: "Techcombank",
      logoUrl:
        "https://upload.wikimedia.org/wikipedia/vi/a/a7/Logo_Techcombank.png",
      industry: "Banking",
      size: "10000+",
      website: "https://techcombank.com",
      description: "Commercial bank with strong digital banking products.",
    }),
    upsertCompany({
      name: "MoMo",
      industry: "Fintech",
      size: "1000-3000",
      website: "https://momo.vn",
      description: "Digital wallet and fintech ecosystem.",
    }),
    upsertCompany({
      name: "Tiki",
      industry: "E-commerce",
      size: "1000-3000",
      website: "https://tiki.vn",
      description: "Vietnamese e-commerce and logistics platform.",
    }),
  ]);

  const locations = await Promise.all([
    upsertLocation({
      city: "Ha Noi",
      district: "Cau Giay",
      address: "Duy Tan",
    }),
    upsertLocation({
      city: "Ha Noi",
      district: "Nam Tu Liem",
      address: "Keangnam Landmark",
    }),
    upsertLocation({
      city: "Ha Noi",
      district: "Hoan Kiem",
      address: "Trang Tien",
    }),
    upsertLocation({
      city: "TP. Ho Chi Minh",
      district: "Quan 1",
      address: "Le Loi",
    }),
    upsertLocation({
      city: "TP. Ho Chi Minh",
      district: "Quan 7",
      address: "Phu My Hung",
    }),
    upsertLocation({
      city: "TP. Ho Chi Minh",
      district: "Thu Duc",
      address: "Saigon Hi-Tech Park",
    }),
    upsertLocation({
      city: "Da Nang",
      district: "Hai Chau",
      address: "Bach Dang",
    }),
    upsertLocation({
      city: "Can Tho",
      district: "Ninh Kieu",
      address: "Hoa Binh",
    }),
    upsertLocation({
      city: "Hai Phong",
      district: "Ngo Quyen",
      address: "Le Hong Phong",
    }),
    upsertLocation({ city: "Remote", district: "Online", address: "Vietnam" }),
  ]);

  const categories = await Promise.all([
    upsertCategory("Information Technology"),
    upsertCategory("Marketing"),
    upsertCategory("Sales"),
    upsertCategory("Finance and Banking"),
    upsertCategory("Human Resources"),
    upsertCategory("Design"),
    upsertCategory("Data and Analytics"),
    upsertCategory("Operations"),
    upsertCategory("Customer Success"),
    upsertCategory("Product Management"),
  ]);

  const skillNames = [
    ["React", "Frontend"],
    ["Next.js", "Frontend"],
    ["TypeScript", "Language"],
    ["Node.js", "Backend"],
    ["NestJS", "Backend"],
    ["Prisma", "Database"],
    ["PostgreSQL", "Database"],
    ["Docker", "DevOps"],
    ["AWS", "DevOps"],
    ["Python", "Language"],
    ["Java", "Language"],
    ["Spring Boot", "Backend"],
    ["SQL", "Database"],
    ["UI/UX Design", "Design"],
    ["Figma", "Design"],
    ["Product Management", "Product"],
    ["Business Analysis", "Business"],
    ["Digital Marketing", "Marketing"],
    ["SEO", "Marketing"],
    ["Content Strategy", "Marketing"],
    ["Sales Pipeline", "Sales"],
    ["Customer Success", "Operations"],
    ["Data Analysis", "Data"],
    ["Machine Learning", "Data"],
  ] as const;

  const skills = await Promise.all(
    skillNames.map(([name, category]) =>
      prisma.skill.upsert({
        where: { name },
        update: { category },
        create: { name, category },
      }),
    ),
  );
  const skillByName = Object.fromEntries(
    skills.map((skill) => [skill.name, skill]),
  );

  const jobs = await Promise.all([
    upsertJob({
      title: "Senior Frontend Developer",
      description:
        "Build high-quality recruitment dashboards with React, Next.js, and TypeScript.",
      salaryMin: 30000000,
      salaryMax: 55000000,
      experienceYears: 3,
      jobType: "FULL_TIME",
      status: "ACTIVE",
      companyId: companies[0].id,
      categoryId: categories[0].id,
      locationId: locations[0].id,
      createdByUserId: hrUsers[0].id,
      skills: [
        { skillId: skillByName.React.id, level: "REQUIRED", minYears: 3 },
        { skillId: skillByName["Next.js"].id, level: "REQUIRED", minYears: 2 },
        { skillId: skillByName.TypeScript.id, level: "REQUIRED", minYears: 2 },
      ],
    }),
    upsertJob({
      title: "Backend Engineer NestJS",
      description:
        "Develop microservices, APIs, and database workflows for hiring operations.",
      salaryMin: 28000000,
      salaryMax: 52000000,
      experienceYears: 3,
      jobType: "FULL_TIME",
      status: "ACTIVE",
      companyId: companies[1].id,
      categoryId: categories[0].id,
      locationId: locations[5].id,
      createdByUserId: hrUsers[1].id,
      skills: [
        { skillId: skillByName["Node.js"].id, level: "REQUIRED", minYears: 3 },
        { skillId: skillByName.NestJS.id, level: "REQUIRED", minYears: 2 },
        {
          skillId: skillByName.PostgreSQL.id,
          level: "NICE_TO_HAVE",
          minYears: 1,
        },
      ],
    }),
    upsertJob({
      title: "Data Analyst",
      description:
        "Analyze hiring funnels, campaign performance, and product metrics.",
      salaryMin: 22000000,
      salaryMax: 38000000,
      experienceYears: 2,
      jobType: "FULL_TIME",
      status: "ACTIVE",
      companyId: companies[4].id,
      categoryId: categories[6].id,
      locationId: locations[3].id,
      createdByUserId: hrUsers[2].id,
      skills: [
        { skillId: skillByName.SQL.id, level: "REQUIRED", minYears: 2 },
        { skillId: skillByName.Python.id, level: "REQUIRED", minYears: 1 },
        {
          skillId: skillByName["Data Analysis"].id,
          level: "REQUIRED",
          minYears: 2,
        },
      ],
    }),
    upsertJob({
      title: "Digital Marketing Specialist",
      description:
        "Plan campaigns, optimize SEO, and run performance marketing experiments.",
      salaryMin: 18000000,
      salaryMax: 32000000,
      experienceYears: 2,
      jobType: "FULL_TIME",
      status: "ACTIVE",
      companyId: companies[3].id,
      categoryId: categories[1].id,
      locationId: locations[4].id,
      createdByUserId: hrUsers[1].id,
      skills: [
        {
          skillId: skillByName["Digital Marketing"].id,
          level: "REQUIRED",
          minYears: 2,
        },
        { skillId: skillByName.SEO.id, level: "NICE_TO_HAVE", minYears: 1 },
        {
          skillId: skillByName["Content Strategy"].id,
          level: "NICE_TO_HAVE",
          minYears: 1,
        },
      ],
    }),
    upsertJob({
      title: "Product Owner",
      description:
        "Own product discovery, roadmap planning, and delivery coordination.",
      salaryMin: 35000000,
      salaryMax: 65000000,
      experienceYears: 4,
      jobType: "FULL_TIME",
      status: "PENDING",
      companyId: companies[5].id,
      categoryId: categories[9].id,
      locationId: locations[9].id,
      createdByUserId: hrUsers[0].id,
      skills: [
        {
          skillId: skillByName["Product Management"].id,
          level: "REQUIRED",
          minYears: 3,
        },
        {
          skillId: skillByName["Business Analysis"].id,
          level: "REQUIRED",
          minYears: 2,
        },
        { skillId: skillByName.Figma.id, level: "NICE_TO_HAVE", minYears: 1 },
      ],
    }),
    upsertJob({
      title: "UI UX Designer",
      description:
        "Design usable interfaces for HR, candidate, and admin workflows.",
      salaryMin: 20000000,
      salaryMax: 40000000,
      experienceYears: 2,
      jobType: "REMOTE",
      status: "ACTIVE",
      companyId: companies[6].id,
      categoryId: categories[5].id,
      locationId: locations[9].id,
      createdByUserId: hrUsers[2].id,
      skills: [
        {
          skillId: skillByName["UI/UX Design"].id,
          level: "REQUIRED",
          minYears: 2,
        },
        { skillId: skillByName.Figma.id, level: "REQUIRED", minYears: 2 },
        {
          skillId: skillByName["Product Management"].id,
          level: "NICE_TO_HAVE",
          minYears: 1,
        },
      ],
    }),
  ]);

  const resume =
    (await prisma.resume.findFirst({
      where: { userId: candidateUser.id, fileName: "seed-candidate-cv.pdf" },
    })) ||
    (await prisma.resume.create({
      data: {
        userId: candidateUser.id,
        fileName: "seed-candidate-cv.pdf",
        fileUrl: "seed/resumes/seed-candidate-cv.pdf",
        fileType: "PDF",
        isPrimary: true,
      },
    }));

  const application =
    (await prisma.application.findFirst({
      where: { jobId: jobs[0].id, candidateId: candidateUser.id },
    })) ||
    (await prisma.application.create({
      data: {
        jobId: jobs[0].id,
        candidateId: candidateUser.id,
        resumeId: resume.id,
        status: "INTERVIEWING",
      },
    }));

  (await prisma.interview.findFirst({
    where: { applicationId: application.id, interviewerId: hrUsers[0].id },
  })) ||
    (await prisma.interview.create({
      data: {
        applicationId: application.id,
        interviewerId: hrUsers[0].id,
        scheduledAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        durationMinutes: 60,
        interviewType: "ONLINE",
        meetingLink: "https://meet.google.com/seed-demo",
        notes: "Seed interview for admin management testing.",
      },
    }));
  await prisma.workExperience.createMany({
    data: [
      {
        profileId: candidateProfile.id,
        companyName: "Nexus Lab",
        position: "Frontend Developer",
        startDate: new Date("2022-01-01"),
        endDate: new Date("2025-01-01"),
        description: "Built React dashboards and recruitment workflows.",
      },
    ],
  });

  await prisma.education.deleteMany({
    where: { profileId: candidateProfile.id },
  });
  await prisma.education.createMany({
    data: [
      {
        profileId: candidateProfile.id,
        schoolName: "Vietnam National University",
        degree: "Bachelor",
        major: "Computer Science",
        startDate: new Date("2018-09-01"),
        endDate: new Date("2022-06-01"),
      },
    ],
  });

  await Promise.all([
    prisma.pipelineStage.upsert({
      where: { name: "Submitted" },
      update: { order: 1, color: "#3B82F6" },
      create: { name: "Submitted", order: 1, color: "#3B82F6" },
    }),
    prisma.pipelineStage.upsert({
      where: { name: "Screening" },
      update: { order: 2, color: "#F59E0B" },
      create: { name: "Screening", order: 2, color: "#F59E0B" },
    }),
    prisma.pipelineStage.upsert({
      where: { name: "Interviewing" },
      update: { order: 3, color: "#8B5CF6" },
      create: { name: "Interviewing", order: 3, color: "#8B5CF6" },
    }),
    prisma.pipelineStage.upsert({
      where: { name: "Offered" },
      update: { order: 4, color: "#10B981" },
      create: { name: "Offered", order: 4, color: "#10B981" },
    }),
  ]);

  const companies = await Promise.all([
    upsertCompany({
      name: "FPT Software",
      logoUrl:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/FPT_Software_logo.svg/1200px-FPT_Software_logo.svg.png",
      industry: "Information Technology",
      size: "10000+",
      website: "https://fptsoftware.com",
      description: "Global IT services and digital transformation company.",
    }),
    upsertCompany({
      name: "VNG Corporation",
      logoUrl:
        "https://upload.wikimedia.org/wikipedia/commons/b/b5/VNG_Logo.png",
      industry: "Internet",
      size: "2000-5000",
      website: "https://vng.com.vn",
      description:
        "Vietnamese technology company focused on platforms and games.",
    }),
    upsertCompany({
      name: "Viettel Group",
      logoUrl:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Viettel_logo_2021.svg/1200px-Viettel_logo_2021.svg.png",
      industry: "Telecommunications",
      size: "50000+",
      website: "https://viettel.com.vn",
      description: "Telecommunications and technology group.",
    }),
    upsertCompany({
      name: "Shopee Vietnam",
      logoUrl:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Shopee.svg/1200px-Shopee.svg.png",
      industry: "E-commerce",
      size: "1000-5000",
      website: "https://shopee.vn",
      description: "E-commerce marketplace in Southeast Asia.",
    }),
    upsertCompany({
      name: "Techcombank",
      logoUrl:
        "https://upload.wikimedia.org/wikipedia/vi/a/a7/Logo_Techcombank.png",
      industry: "Banking",
      size: "10000+",
      website: "https://techcombank.com",
      description: "Commercial bank with strong digital banking products.",
    }),
    upsertCompany({
      name: "MoMo",
      industry: "Fintech",
      size: "1000-3000",
      website: "https://momo.vn",
      description: "Digital wallet and fintech ecosystem.",
    }),
    upsertCompany({
      name: "Tiki",
      industry: "E-commerce",
      size: "1000-3000",
      website: "https://tiki.vn",
      description: "Vietnamese e-commerce and logistics platform.",
    }),
  ]);

  const locations = await Promise.all([
    upsertLocation({
      city: "Ha Noi",
      district: "Cau Giay",
      address: "Duy Tan",
    }),
    upsertLocation({
      city: "Ha Noi",
      district: "Nam Tu Liem",
      address: "Keangnam Landmark",
    }),
    upsertLocation({
      city: "Ha Noi",
      district: "Hoan Kiem",
      address: "Trang Tien",
    }),
    upsertLocation({
      city: "TP. Ho Chi Minh",
      district: "Quan 1",
      address: "Le Loi",
    }),
    upsertLocation({
      city: "TP. Ho Chi Minh",
      district: "Quan 7",
      address: "Phu My Hung",
    }),
    upsertLocation({
      city: "TP. Ho Chi Minh",
      district: "Thu Duc",
      address: "Saigon Hi-Tech Park",
    }),
    upsertLocation({
      city: "Da Nang",
      district: "Hai Chau",
      address: "Bach Dang",
    }),
    upsertLocation({
      city: "Can Tho",
      district: "Ninh Kieu",
      address: "Hoa Binh",
    }),
    upsertLocation({
      city: "Hai Phong",
      district: "Ngo Quyen",
      address: "Le Hong Phong",
    }),
    upsertLocation({ city: "Remote", district: "Online", address: "Vietnam" }),
  ]);

  const categories = await Promise.all([
    upsertCategory("Information Technology"),
    upsertCategory("Marketing"),
    upsertCategory("Sales"),
    upsertCategory("Finance and Banking"),
    upsertCategory("Human Resources"),
    upsertCategory("Design"),
    upsertCategory("Data and Analytics"),
    upsertCategory("Operations"),
    upsertCategory("Customer Success"),
    upsertCategory("Product Management"),
  ]);

  const skillNames = [
    ["React", "Frontend"],
    ["Next.js", "Frontend"],
    ["TypeScript", "Language"],
    ["Node.js", "Backend"],
    ["NestJS", "Backend"],
    ["Prisma", "Database"],
    ["PostgreSQL", "Database"],
    ["Docker", "DevOps"],
    ["AWS", "DevOps"],
    ["Python", "Language"],
    ["Java", "Language"],
    ["Spring Boot", "Backend"],
    ["SQL", "Database"],
    ["UI/UX Design", "Design"],
    ["Figma", "Design"],
    ["Product Management", "Product"],
    ["Business Analysis", "Business"],
    ["Digital Marketing", "Marketing"],
    ["SEO", "Marketing"],
    ["Content Strategy", "Marketing"],
    ["Sales Pipeline", "Sales"],
    ["Customer Success", "Operations"],
    ["Data Analysis", "Data"],
    ["Machine Learning", "Data"],
  ] as const;

  const skills = await Promise.all(
    skillNames.map(([name, category]) =>
      prisma.skill.upsert({
        where: { name },
        update: { category },
        create: { name, category },
      }),
    ),
  );
  const skillByName = Object.fromEntries(
    skills.map((skill) => [skill.name, skill]),
  );

  const jobs = await Promise.all([
    upsertJob({
      title: "Senior Frontend Developer",
      description:
        "Build high-quality recruitment dashboards with React, Next.js, and TypeScript.",
      salaryMin: 30000000,
      salaryMax: 55000000,
      experienceYears: 3,
      jobType: "FULL_TIME",
      status: "ACTIVE",
      companyId: companies[0].id,
      categoryId: categories[0].id,
      locationId: locations[0].id,
      createdByUserId: hrUsers[0].id,
      skills: [
        { skillId: skillByName.React.id, level: "REQUIRED", minYears: 3 },
        { skillId: skillByName["Next.js"].id, level: "REQUIRED", minYears: 2 },
        { skillId: skillByName.TypeScript.id, level: "REQUIRED", minYears: 2 },
      ],
    }),
    upsertJob({
      title: "Backend Engineer NestJS",
      description:
        "Develop microservices, APIs, and database workflows for hiring operations.",
      salaryMin: 28000000,
      salaryMax: 52000000,
      experienceYears: 3,
      jobType: "FULL_TIME",
      status: "ACTIVE",
      companyId: companies[1].id,
      categoryId: categories[0].id,
      locationId: locations[5].id,
      createdByUserId: hrUsers[1].id,
      skills: [
        { skillId: skillByName["Node.js"].id, level: "REQUIRED", minYears: 3 },
        { skillId: skillByName.NestJS.id, level: "REQUIRED", minYears: 2 },
        {
          skillId: skillByName.PostgreSQL.id,
          level: "NICE_TO_HAVE",
          minYears: 1,
        },
      ],
    }),
    upsertJob({
      title: "Data Analyst",
      description:
        "Analyze hiring funnels, campaign performance, and product metrics.",
      salaryMin: 22000000,
      salaryMax: 38000000,
      experienceYears: 2,
      jobType: "FULL_TIME",
      status: "ACTIVE",
      companyId: companies[4].id,
      categoryId: categories[6].id,
      locationId: locations[3].id,
      createdByUserId: hrUsers[2].id,
      skills: [
        { skillId: skillByName.SQL.id, level: "REQUIRED", minYears: 2 },
        { skillId: skillByName.Python.id, level: "REQUIRED", minYears: 1 },
        {
          skillId: skillByName["Data Analysis"].id,
          level: "REQUIRED",
          minYears: 2,
        },
      ],
    }),
    upsertJob({
      title: "Digital Marketing Specialist",
      description:
        "Plan campaigns, optimize SEO, and run performance marketing experiments.",
      salaryMin: 18000000,
      salaryMax: 32000000,
      experienceYears: 2,
      jobType: "FULL_TIME",
      status: "ACTIVE",
      companyId: companies[3].id,
      categoryId: categories[1].id,
      locationId: locations[4].id,
      createdByUserId: hrUsers[1].id,
      skills: [
        {
          skillId: skillByName["Digital Marketing"].id,
          level: "REQUIRED",
          minYears: 2,
        },
        { skillId: skillByName.SEO.id, level: "NICE_TO_HAVE", minYears: 1 },
        {
          skillId: skillByName["Content Strategy"].id,
          level: "NICE_TO_HAVE",
          minYears: 1,
        },
      ],
    }),
    upsertJob({
      title: "Product Owner",
      description:
        "Own product discovery, roadmap planning, and delivery coordination.",
      salaryMin: 35000000,
      salaryMax: 65000000,
      experienceYears: 4,
      jobType: "FULL_TIME",
      status: "PENDING",
      companyId: companies[5].id,
      categoryId: categories[9].id,
      locationId: locations[9].id,
      createdByUserId: hrUsers[0].id,
      skills: [
        {
          skillId: skillByName["Product Management"].id,
          level: "REQUIRED",
          minYears: 3,
        },
        {
          skillId: skillByName["Business Analysis"].id,
          level: "REQUIRED",
          minYears: 2,
        },
        { skillId: skillByName.Figma.id, level: "NICE_TO_HAVE", minYears: 1 },
      ],
    }),
    upsertJob({
      title: "UI UX Designer",
      description:
        "Design usable interfaces for HR, candidate, and admin workflows.",
      salaryMin: 20000000,
      salaryMax: 40000000,
      experienceYears: 2,
      jobType: "REMOTE",
      status: "ACTIVE",
      companyId: companies[6].id,
      categoryId: categories[5].id,
      locationId: locations[9].id,
      createdByUserId: hrUsers[2].id,
      skills: [
        {
          skillId: skillByName["UI/UX Design"].id,
          level: "REQUIRED",
          minYears: 2,
        },
        { skillId: skillByName.Figma.id, level: "REQUIRED", minYears: 2 },
        {
          skillId: skillByName["Product Management"].id,
          level: "NICE_TO_HAVE",
          minYears: 1,
        },
      ],
    }),
  ]);

  const resume =
    (await prisma.resume.findFirst({
      where: { userId: candidateUser.id, fileName: "seed-candidate-cv.pdf" },
    })) ||
    (await prisma.resume.create({
      data: {
        userId: candidateUser.id,
        fileName: "seed-candidate-cv.pdf",
        fileUrl: "seed/resumes/seed-candidate-cv.pdf",
        fileType: "PDF",
        isPrimary: true,
      },
    }));

  const application =
    (await prisma.application.findFirst({
      where: { jobId: jobs[0].id, candidateId: candidateUser.id },
    })) ||
    (await prisma.application.create({
      data: {
        jobId: jobs[0].id,
        candidateId: candidateUser.id,
        resumeId: resume.id,
        status: "INTERVIEWING",
      },
    }));

  (await prisma.interview.findFirst({
    where: { applicationId: application.id, interviewerId: hrUsers[0].id },
  })) ||
    (await prisma.interview.create({
      data: {
        applicationId: application.id,
        interviewerId: hrUsers[0].id,
        scheduledAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        durationMinutes: 60,
        interviewType: "ONLINE",
        meetingLink: "https://meet.google.com/seed-demo",
        notes: "Seed interview for admin management testing.",
      },
    }));

  console.log("Seed done.");
  console.log("Admin: admin@recruitment.com / Admin@123");
  console.log("HR: hr.fpt@recruitment.com / HR@123");
  console.log("Candidate: candidate@recruitment.com / Candidate@123");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
