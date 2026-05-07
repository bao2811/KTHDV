import { PrismaClient, JobStatus, JobType, SkillLevel } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding jobs...');

  // 1. Create Companies
  const companies = await Promise.all([
    prisma.company.create({
      data: {
        name: 'FPT Software',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/FPT_Software_logo.svg/1200px-FPT_Software_logo.svg.png',
        industry: 'Technology',
        size: '10000+',
        website: 'https://fptsoftware.com',
        description: 'Leading IT services provider in SE Asia.',
      },
    }),
    prisma.company.create({
      data: {
        name: 'VNG Corporation',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/VNG_Logo.png',
        industry: 'Internet',
        size: '2000-5000',
        website: 'https://vng.com.vn',
        description: 'Vietnam leading technology company.',
      },
    }),
    prisma.company.create({
      data: {
        name: 'Viettel Group',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Viettel_logo_2021.svg/1200px-Viettel_logo_2021.svg.png',
        industry: 'Telecommunications',
        size: '50000+',
        website: 'https://viettel.com.vn',
        description: 'Largest telecommunications group in Vietnam.',
      },
    }),
    prisma.company.create({
      data: {
        name: 'Techcombank',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/vi/a/a7/Logo_Techcombank.png',
        industry: 'Banking',
        size: '10000+',
        website: 'https://techcombank.com',
        description: 'Leading commercial bank in Vietnam.',
      },
    }),
    prisma.company.create({
      data: {
        name: 'Shopee Vietnam',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Shopee.svg/1200px-Shopee.svg.png',
        industry: 'E-commerce',
        size: '1000-5000',
        website: 'https://shopee.vn',
        description: 'Top e-commerce platform in SE Asia.',
      },
    }),
  ]);

  // 2. Create Locations
  const locations = await Promise.all([
    prisma.location.create({ data: { city: 'Hà Nội', district: 'Cầu Giấy', address: 'Duy Tân' } }),
    prisma.location.create({ data: { city: 'Hà Nội', district: 'Nam Từ Liêm', address: 'Keangnam Landmark' } }),
    prisma.location.create({ data: { city: 'TP. Hồ Chí Minh', district: 'Quận 1', address: 'Bitexco' } }),
    prisma.location.create({ data: { city: 'TP. Hồ Chí Minh', district: 'Quận 7', address: 'Phú Mỹ Hưng' } }),
    prisma.location.create({ data: { city: 'Đà Nẵng', district: 'Hải Châu', address: 'Bạch Đằng' } }),
  ]);

  // 3. Create Categories
  const categories = await Promise.all([
    prisma.jobCategory.create({ data: { name: 'Công nghệ thông tin' } }),
    prisma.jobCategory.create({ data: { name: 'Marketing / Truyền thông' } }),
    prisma.jobCategory.create({ data: { name: 'Kinh doanh / Bán hàng' } }),
    prisma.jobCategory.create({ data: { name: 'Tài chính / Ngân hàng' } }),
    prisma.jobCategory.create({ data: { name: 'Nhân sự / Hành chính' } }),
  ]);

  // 4. Create Skills
  const skills = await Promise.all([
    prisma.skill.create({ data: { name: 'React', category: 'Frontend' } }),
    prisma.skill.create({ data: { name: 'Node.js', category: 'Backend' } }),
    prisma.skill.create({ data: { name: 'TypeScript', category: 'Language' } }),
    prisma.skill.create({ data: { name: 'NestJS', category: 'Backend' } }),
    prisma.skill.create({ data: { name: 'Prisma', category: 'Database' } }),
    prisma.skill.create({ data: { name: 'SQL', category: 'Database' } }),
    prisma.skill.create({ data: { name: 'Marketing Strategy', category: 'Marketing' } }),
    prisma.skill.create({ data: { name: 'Sales Skills', category: 'Sales' } }),
  ]);

  // 5. Create Jobs (Batch of 20)
  const jobTitles = [
    'Senior Frontend Developer (React)',
    'Backend Engineer (NestJS/Node.js)',
    'Fullstack Developer (TypeScript)',
    'Mobile App Developer (Flutter)',
    'DevOps Engineer (AWS/Docker)',
    'Marketing Manager',
    'Social Media Specialist',
    'Sales Executive',
    'Account Manager',
    'Financial Analyst',
    'HR Manager',
    'Talent Acquisition Specialist',
    'Data Scientist (Python)',
    'Quality Assurance Engineer',
    'Product Owner',
    'UI/UX Designer',
    'Content Creator',
    'Digital Marketing Lead',
    'Business Analyst',
    'Customer Success Specialist'
  ];

  for (let i = 0; i < jobTitles.length; i++) {
    const job = await prisma.job.create({
      data: {
        title: jobTitles[i],
        description: `Đây là mô tả chi tiết cho vị trí ${jobTitles[i]}. Chúng tôi đang tìm kiếm ứng viên tài năng gia nhập đội ngũ.`,
        salaryMin: 15000000 + Math.random() * 20000000,
        salaryMax: 40000000 + Math.random() * 30000000,
        experienceYears: Math.floor(Math.random() * 5),
        jobType: i % 3 === 0 ? JobType.FULL_TIME : (i % 3 === 1 ? JobType.PART_TIME : JobType.REMOTE),
        status: JobStatus.ACTIVE,
        companyId: companies[i % companies.length].id,
        categoryId: categories[i % categories.length].id,
        locationId: locations[i % locations.length].id,
        publishedAt: new Date(),
        expiredAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      },
    });

    // Add 2-3 random skills for each job
    const randomSkills = skills.sort(() => 0.5 - Math.random()).slice(0, 3);
    for (const skill of randomSkills) {
      await prisma.jobSkill.create({
        data: {
          jobId: job.id,
          skillId: skill.id,
          level: Math.random() > 0.5 ? SkillLevel.REQUIRED : SkillLevel.NICE_TO_HAVE,
          minYears: Math.floor(Math.random() * 3),
        },
      });
    }
  }

  console.log('Seeding jobs completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
