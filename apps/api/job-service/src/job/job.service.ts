import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import {
  ApplicationStatus,
  Company,
  Job,
  Location,
  JobCategory,
  Skill,
  JobApproval,
  JobSkill,
  HardFilter,
  JobStatus,
  ApprovalStatus,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JobQueryDto } from './dto/job-query.dto';
import { AddJobSkillDto } from './dto/add-job-skill.dto';
import { CreateApprovalDto } from './dto/approval.dto';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class JobService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  // Companies
  createCompany(data: {
    name: string;
    logoUrl?: string;
    industry?: string;
    size?: string;
    website?: string;
    description?: string;
  }): Promise<any> {
    return this.prisma.company.create({ data });
  }

  listCompanies(): Promise<any[]> {
    return this.prisma.company.findMany({ orderBy: { id: 'asc' } });
  }

  async getCompany(id: number): Promise<any> {
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
  async createJob(data: CreateJobDto & { createdByUserId?: number }): Promise<Job> {
    // BR-1.5: salaryMin <= salaryMax; experienceYears >= 0
    if (data.salaryMin !== undefined && data.salaryMax !== undefined && data.salaryMin > data.salaryMax) {
      throw new BadRequestException('salaryMin phải nhỏ hơn hoặc bằng salaryMax');
    }
    if (data.experienceYears !== undefined && data.experienceYears < 0) {
      throw new BadRequestException('experienceYears phải lớn hơn hoặc bằng 0');
    }

    const job = await this.prisma.job.create({
      data: {
        ...data,
        status: JobStatus.DRAFT,
        publishedAt: undefined,
        expiredAt: data.expiredAt ? new Date(data.expiredAt) : undefined,
      },
    });

    await this.auditService.log({
      userId: data.createdByUserId,
      action: 'CREATE',
      resource: 'jobs',
      resourceId: job.id,
      details: { status: JobStatus.DRAFT },
    });

    return job;
  }

  async listJobs(params: JobQueryDto): Promise<{ data: any[]; pagination: { page: number; limit: number; total: number; totalPages: number } }> {
    const page = params.page || 1;
    const limit = params.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = {
      companyId: params.companyId,
      categoryId: params.categoryId,
      locationId: params.locationId,
      jobType: params.jobType,
    };

    // If status is provided, use it. If 'ALL', don't filter. If missing, default to ACTIVE.
    if (params.status && params.status !== 'ALL') {
      where.status = params.status;
    } else if (!params.status) {
      where.status = JobStatus.ACTIVE;
    }

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
          _count: { select: { applications: true } },
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

  async getJob(id: number): Promise<any> {
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

  async updateJob(
    id: number,
    data: UpdateJobDto,
  ) {
    const existingJob = await this.getJob(id);
    
    // BR-1.5 validation
    if (data.salaryMin !== undefined && data.salaryMax !== undefined && data.salaryMin > data.salaryMax) {
      throw new BadRequestException('salaryMin phải nhỏ hơn hoặc bằng salaryMax');
    }

    const job = await this.prisma.job.update({
      where: { id },
      data: {
        ...data,
        expiredAt: data.expiredAt ? new Date(data.expiredAt) : undefined,
      },
    });

    await this.auditService.log({
      action: 'UPDATE',
      resource: 'jobs',
      resourceId: id,
      details: { ...data, previousStatus: existingJob.status },
    });

    return job;
  }

  async deleteJob(id: number) {
    await this.getJob(id);
    return this.prisma.job.delete({ where: { id } });
  }

  // Business Operations
  async closeJob(id: number) {
    const job = await this.getJob(id);
    if (job.status === JobStatus.CLOSED) {
      throw new BadRequestException('Công việc đã được đóng trước đó');
    }
    
    return this.prisma.$transaction(async (tx) => {
      // BR-1.4: Khi Job chuyển sang Closed/Expired, tất cả Application đang Submitted chuyển thành Rejected
      await tx.application.updateMany({
        where: { jobId: id, status: ApplicationStatus.SUBMITTED },
        data: { status: ApplicationStatus.REJECTED },
      });

      const updatedJob = await tx.job.update({
        where: { id },
        data: { status: JobStatus.CLOSED },
      });

      await this.auditService.log({
        action: 'CLOSE',
        resource: 'jobs',
        resourceId: id,
        details: { previousStatus: job.status, newStatus: JobStatus.CLOSED },
      });

      return updatedJob;
    });
  }

  async extendJob(id: number, expiredAt: string) {
    const job = await this.getJob(id);
    const newExpiredAt = new Date(expiredAt);

    if (newExpiredAt <= new Date()) {
      throw new BadRequestException('Ngày hết hạn phải ở tương lai');
    }
    
    // BR-1.2: HR có thể gia hạn (tạo mới expiredAt)
    const updatedJob = await this.prisma.job.update({
      where: { id },
      data: { 
        expiredAt: newExpiredAt,
        status: job.status === JobStatus.EXPIRED ? JobStatus.ACTIVE : job.status,
      },
    });

    await this.auditService.log({
      action: 'EXTEND',
      resource: 'jobs',
      resourceId: id,
      details: { previousExpiredAt: job.expiredAt, newExpiredAt },
    });

    return updatedJob;
  }

  // Approvals
  async requestApproval(jobId: number, reviewerId: number) {
    const job = await this.getJob(jobId);
    
    // BR-1.1: Job phải được phê duyệt (Approved) trước khi chuyển sang ACTIVE
    if (job.status !== JobStatus.DRAFT) {
      throw new BadRequestException('Chỉ có thể gửi yêu cầu phê duyệt cho tin ở trạng thái DRAFT');
    }

    // Check if there is already a pending approval
    const existingPending = await this.prisma.jobApproval.findFirst({
      where: { jobId, status: 'PENDING' as any },
    });
    if (existingPending) {
      throw new BadRequestException('Yêu cầu phê duyệt cho tin này đang được xử lý');
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.job.update({
        where: { id: jobId },
        data: { status: JobStatus.PENDING },
      });

      const approval = await tx.jobApproval.create({
        data: {
          jobId,
          reviewerId,
          status: 'PENDING' as any,
        },
      });

      await this.auditService.log({
        action: 'REQUEST_APPROVAL',
        resource: 'jobs',
        resourceId: jobId,
        details: { reviewerId, approvalId: approval.id },
      });

      return approval;
    });
  }

  async updateApproval(jobId: number, approvalId: number, data: CreateApprovalDto) {
    const approval = await this.prisma.jobApproval.findUnique({
      where: { id: approvalId },
    });

    if (!approval || approval.jobId !== jobId) {
      throw new NotFoundException('Approval record not found');
    }

    if (approval.status !== 'PENDING') {
      throw new BadRequestException('Yêu cầu này đã được xử lý');
    }

    return this.prisma.$transaction(async (tx) => {
      const updatedApproval = await tx.jobApproval.update({
        where: { id: approvalId },
        data: {
          status: data.status,
          comment: data.comment,
          reviewedAt: new Date(),
        },
      });

      // BR-1.1: If approved, set job to ACTIVE and set publishedAt
      if (data.status === ApprovalStatus.APPROVED) {
        await tx.job.update({
          where: { id: jobId },
          data: { 
            status: JobStatus.ACTIVE,
            publishedAt: new Date(),
          },
        });
      } else if (data.status === ApprovalStatus.REJECTED) {
        await tx.job.update({
          where: { id: jobId },
          data: { status: JobStatus.DRAFT }, // Move back to draft if rejected
        });
      }

      await this.auditService.log({
        action: 'UPDATE_APPROVAL',
        resource: 'jobs',
        resourceId: jobId,
        details: { status: data.status, approvalId, comment: data.comment },
      });

      return updatedApproval;
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

  async getAllApprovals() {
    return this.prisma.jobApproval.findMany({
      where: { status: 'PENDING' as any },
      include: { 
        job: {
          include: {
            company: true,
            category: true,
            location: true,
            createdBy: true
          }
        },
        reviewer: true
      },
      orderBy: { id: 'desc' }
    });
  }

  // Job Skills Management
  async addJobSkill(
    jobId: number,
    data: AddJobSkillDto,
  ) {
    await this.getJob(jobId);
    return this.prisma.jobSkill.create({
      data: {
        jobId,
        skillId: data.skillId,
        level: data.level,
        minYears: data.minYears || 0,
      },
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
          status: params.status as any,
        }
      : { jobId };

    const [data, total] = await Promise.all([
      this.prisma.application.findMany({
        where,
        skip,
        take: limit,
        include: {
          candidate: { 
            include: { 
              profile: true,
              candidateProfile: {
                include: { experiences: true, educations: true }
              }
            } 
          },
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

  async updateApplicationStatus(
    applicationId: number,
    status: ApplicationStatus,
    updatedByUserId: number,
  ) {
    const application = await this.prisma.application.findUnique({
      where: { id: applicationId },
    });

    if (!application) {
      throw new NotFoundException('Đơn ứng tuyển không tồn tại');
    }

    const updatedApplication = await this.prisma.application.update({
      where: { id: applicationId },
      data: { status },
      include: {
        candidate: { select: { id: true, email: true } },
        job: { select: { id: true, title: true } },
      },
    });

    await this.auditService.log({
      userId: updatedByUserId,
      action: 'UPDATE_APPLICATION_STATUS',
      resource: 'applications',
      resourceId: applicationId,
      details: {
        status,
        jobId: application.jobId,
        candidateId: application.candidateId,
      },
    });

    return updatedApplication;
  }
}

