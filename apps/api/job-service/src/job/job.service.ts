import { Injectable, NotFoundException } from '@nestjs/common';
import { ApplicationStatus, Company, Job, Location, JobCategory, Skill, JobApproval, JobSkill, HardFilter } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JobService {
  constructor(private readonly prisma: PrismaService) {}

  // Companies
  createCompany(data: {
    name: string;
    logoUrl?: string;
    industry?: string;
    size?: string;
    website?: string;
    description?: string;
  }): Promise<Company> {
    return this.prisma.company.create({ data });
  }

  listCompanies(): Promise<Company[]> {
    return this.prisma.company.findMany({ orderBy: { id: 'asc' } });
  }

  async getCompany(id: number): Promise<Company> {
    const company = await this.prisma.company.findUnique({ where: { id } });
    if (!company) {
      throw new NotFoundException('Company không tồn tại');
    }
    return company;
  }

  async updateCompany(
    id: number,
    data: Partial<{
      name: string;
      logoUrl?: string;
      industry?: string;
      size?: string;
      website?: string;
      description?: string;
    }>,
  ) {
    await this.getCompany(id);
    return this.prisma.company.update({ where: { id }, data });
  }

  async deleteCompany(id: number) {
    await this.getCompany(id);
    return this.prisma.company.delete({ where: { id } });
  }

  // Locations
  createLocation(data: { city: string; district?: string; address?: string }) {
    return this.prisma.location.create({ data });
  }

  listLocations() {
    return this.prisma.location.findMany({ orderBy: { id: 'asc' } });
  }

  async getLocation(id: number) {
    const location = await this.prisma.location.findUnique({ where: { id } });
    if (!location) {
      throw new NotFoundException('Location không tồn tại');
    }
    return location;
  }

  async updateLocation(
    id: number,
    data: Partial<{ city: string; district?: string; address?: string }>,
  ) {
    await this.getLocation(id);
    return this.prisma.location.update({ where: { id }, data });
  }

  async deleteLocation(id: number) {
    await this.getLocation(id);
    return this.prisma.location.delete({ where: { id } });
  }

  // Categories
  createCategory(data: { name: string; parentId?: number }) {
    return this.prisma.jobCategory.create({ data });
  }

  listCategories() {
    return this.prisma.jobCategory.findMany({ orderBy: { id: 'asc' } });
  }

  async getCategory(id: number) {
    const category = await this.prisma.jobCategory.findUnique({
      where: { id },
    });
    if (!category) {
      throw new NotFoundException('Category không tồn tại');
    }
    return category;
  }

  async updateCategory(
    id: number,
    data: Partial<{ name: string; parentId?: number | null }>,
  ) {
    await this.getCategory(id);
    return this.prisma.jobCategory.update({ where: { id }, data });
  }

  async deleteCategory(id: number) {
    await this.getCategory(id);
    return this.prisma.jobCategory.delete({ where: { id } });
  }

  // Skills
  createSkill(data: { name: string; category?: string }) {
    return this.prisma.skill.create({ data });
  }

  listSkills() {
    return this.prisma.skill.findMany({ orderBy: { id: 'asc' } });
  }

  async getSkill(id: number) {
    const skill = await this.prisma.skill.findUnique({ where: { id } });
    if (!skill) {
      throw new NotFoundException('Skill không tồn tại');
    }
    return skill;
  }

  async updateSkill(
    id: number,
    data: Partial<{ name: string; category?: string }>,
  ) {
    await this.getSkill(id);
    return this.prisma.skill.update({ where: { id }, data });
  }

  async deleteSkill(id: number) {
    await this.getSkill(id);
    return this.prisma.skill.delete({ where: { id } });
  }

  // Jobs
  createJob(data: {
    title: string;
    description: string;
    salaryMin?: number;
    salaryMax?: number;
    experienceYears?: number;
    jobType?: 'FULL_TIME' | 'PART_TIME' | 'REMOTE';
    status?: 'DRAFT' | 'PENDING' | 'ACTIVE' | 'CLOSED' | 'EXPIRED';
    companyId?: number;
    categoryId?: number;
    locationId?: number;
    createdByUserId?: number;
    publishedAt?: string;
    expiredAt?: string;
  }): Promise<Job> {
    return this.prisma.job.create({
      data: {
        ...data,
        publishedAt: data.publishedAt ? new Date(data.publishedAt) : undefined,
        expiredAt: data.expiredAt ? new Date(data.expiredAt) : undefined,
      },
    });
  }

  async listJobs(params: {
    page?: number;
    limit?: number;
    status?: string;
    companyId?: number;
    categoryId?: number;
    locationId?: number;
    search?: string;
    jobType?: 'FULL_TIME' | 'PART_TIME' | 'REMOTE';
    salaryMin?: number;
    salaryMax?: number;
  }): Promise<{ data: any[]; pagination: { page: number; limit: number; total: number; totalPages: number } }> {
    const page = params.page || 1;
    const limit = params.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = {
      status: params.status || undefined,
      companyId: params.companyId,
      categoryId: params.categoryId,
      locationId: params.locationId,
      jobType: params.jobType,
    };

    if (params.search) {
      where.OR = [
        { title: { contains: params.search, mode: 'insensitive' } },
        { description: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    if (params.salaryMin !== undefined || params.salaryMax !== undefined) {
      where.salaryMin = params.salaryMin !== undefined ? { gte: params.salaryMin } : undefined;
      where.salaryMax = params.salaryMax !== undefined ? { lte: params.salaryMax } : undefined;
    }

    const [data, total] = await Promise.all([
      this.prisma.job.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          company: true,
          location: true,
          category: true,
          jobSkills: { include: { skill: true } },
        },
      }),
      this.prisma.job.count({ where }),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getJob(id: number): Promise<Job> {
    const job = await this.prisma.job.findUnique({
      where: { id },
      include: {
        company: true,
        category: true,
        location: true,
        jobSkills: { include: { skill: true } },
        hardFilters: true,
        _count: { select: { applications: true } },
        createdBy: true,
      },
    });
    if (!job) {
      throw new NotFoundException('Job không tồn tại');
    }
    return job;
  }

  // Job Skills Management
  async addJobSkill(
    jobId: number,
    data: {
      skillId: number;
      level: 'REQUIRED' | 'NICE_TO_HAVE';
      minYears?: number;
    },
  ) {
    await this.getJob(jobId);
    return this.prisma.jobSkill.create({
      data: {
        jobId,
        skillId: data.skillId,
        level: data.level,
        minYears: data.minYears || 0,
      },
      include: { skill: true },
    });
  }

  async removeJobSkill(jobId: number, skillId: number) {
    return this.prisma.jobSkill.delete({
      where: { jobId_skillId: { jobId, skillId } },
    });
  }

  async listJobSkills(jobId: number) {
    await this.getJob(jobId);
    return this.prisma.jobSkill.findMany({
      where: { jobId },
      include: { skill: true },
    });
  }

  // Hard Filters Management
  async addHardFilter(
    jobId: number,
    data: {
      filterType: 'EXPERIENCE' | 'EDUCATION' | 'SKILL';
      requiredValue: string;
      operator: 'GTE' | 'EQ' | 'IN';
    },
  ) {
    await this.getJob(jobId);
    return this.prisma.hardFilter.create({
      data: {
        jobId,
        ...data,
      },
    });
  }

  async removeHardFilter(id: number) {
    return this.prisma.hardFilter.delete({ where: { id } });
  }

  async listHardFilters(jobId: number) {
    await this.getJob(jobId);
    return this.prisma.hardFilter.findMany({ where: { jobId } });
  }

  async updateJob(
    id: number,
    data: Partial<{
      title: string;
      description: string;
      salaryMin?: number;
      salaryMax?: number;
      experienceYears?: number;
      jobType?: 'FULL_TIME' | 'PART_TIME' | 'REMOTE';
      status?: 'DRAFT' | 'PENDING' | 'ACTIVE' | 'CLOSED' | 'EXPIRED';
      companyId?: number | null;
      categoryId?: number | null;
      locationId?: number | null;
      publishedAt?: string | null;
      expiredAt?: string | null;
    }>,
  ) {
    await this.getJob(id);
    return this.prisma.job.update({
      where: { id },
      data: {
        ...data,
        publishedAt: data.publishedAt
          ? new Date(data.publishedAt)
          : data.publishedAt === null
            ? null
            : undefined,
        expiredAt: data.expiredAt
          ? new Date(data.expiredAt)
          : data.expiredAt === null
            ? null
            : undefined,
      },
    });
  }

  async deleteJob(id: number) {
    await this.getJob(id);
    return this.prisma.job.delete({ where: { id } });
  }

  // Approvals
  async createApproval(
    jobId: number,
    data: {
      reviewerId: number;
      status: 'APPROVED' | 'REJECTED';
      comment?: string;
    },
  ) {
    await this.getJob(jobId);
    return this.prisma.jobApproval.create({
      data: {
        jobId,
        ...data,
      },
      include: { reviewer: true, job: true },
    });
  }

  async getApprovals(jobId: number) {
    await this.getJob(jobId);
    return this.prisma.jobApproval.findMany({
      where: { jobId },
      include: { reviewer: true },
      orderBy: { reviewedAt: 'desc' },
    });
  }

  // ===== Applications =====
  async getJobApplications(
    jobId: number,
    params: { status?: string; page?: number; limit?: number } = {},
  ) {
    await this.getJob(jobId);

    const page = params.page || 1;
    const limit = params.limit || 10;
    const skip = (page - 1) * limit;

    const where = params.status
      ? {
          jobId,
          status: params.status as ApplicationStatus,
        }
      : { jobId };

    const [data, total] = await Promise.all([
      this.prisma.application.findMany({
        where,
        skip,
        take: limit,
        include: {
          candidate: { include: { profile: true } },
          resume: true,
          matchResult: true,
        },
        orderBy: { appliedAt: 'desc' },
      }),
      this.prisma.application.count({ where }),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // ===== Statistics =====
  async getJobStatistics(jobId: number) {
    await this.getJob(jobId);

    const job = await this.prisma.job.findUnique({
      where: { id: jobId },
      include: {
        _count: {
          select: {
            applications: true,
            jobSkills: true,
            approvals: true,
          },
        },
      },
    });

    const applicationStats = await this.prisma.application.groupBy({
      by: ['status'],
      where: { jobId },
      _count: true,
    });

    return {
      job,
      applicationStats: Object.fromEntries(
        applicationStats.map((stat) => [stat.status, stat._count]),
      ),
    };
  }
}
