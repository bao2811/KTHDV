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
    const jobCount = await this.prisma.job.count({ where: { companyId: id } });
    if (jobCount > 0) {
      throw new BadRequestException(
        'Khong the xoa cong ty dang duoc gan voi tin tuyen dung',
      );
    }
    return this.prisma.company.delete({ where: { id } });
  }

  // Locations
  createLocation(data: { city: string; district?: string; address?: string }) {
    const { city, district, address } = data;
    return this.prisma.location.create({ 
      data: { city, district, address } 
    });
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
    const { city, district, address } = data;
    return this.prisma.location.update({ 
      where: { id }, 
      data: { city, district, address } 
    });
  }

  async deleteLocation(id: number) {
    await this.getLocation(id);
    const jobCount = await this.prisma.job.count({ where: { locationId: id } });
    if (jobCount > 0) {
      throw new BadRequestException(
        'Khong the xoa dia diem dang duoc gan voi tin tuyen dung',
      );
    }
    return this.prisma.location.delete({ where: { id } });
  }

  // Categories
  createCategory(data: { name: string; parentId?: number }) {
    const { name, parentId } = data;
    return this.prisma.jobCategory.create({ 
      data: { name, parentId } 
    });
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
    const { name, parentId } = data;
    return this.prisma.jobCategory.update({ 
      where: { id }, 
      data: { name, parentId } 
    });
  }

  async deleteCategory(id: number) {
    await this.getCategory(id);
    const [jobCount, childCount] = await Promise.all([
      this.prisma.job.count({ where: { categoryId: id } }),
      this.prisma.jobCategory.count({ where: { parentId: id } }),
    ]);
    if (jobCount > 0 || childCount > 0) {
      throw new BadRequestException(
        'Khong the xoa nganh nghe dang duoc su dung hoac co danh muc con',
      );
    }
    return this.prisma.jobCategory.delete({ where: { id } });
  }

  // Skills
  createSkill(data: { name: string; category?: string }) {
    const { name, category } = data;
    return this.prisma.skill.create({ 
      data: { name, category }
    });
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
    const jobSkillCount = await this.prisma.jobSkill.count({
      where: { skillId: id },
    });
    if (jobSkillCount > 0) {
      throw new BadRequestException(
        'Khong the xoa ky nang dang duoc gan voi tin tuyen dung',
      );
    }
    return this.prisma.skill.delete({ where: { id } });
  }

  // Jobs
  private getRoleName(role: any): string | undefined {
    return typeof role === 'string' ? role : role?.name;
  }

  private normalizeOptionalId(value?: number | null) {
    return value === null || value === undefined ? undefined : value;
  }

  private async findReviewer(tx: any, reviewerId?: number) {
    if (reviewerId) {
      const reviewer = await tx.user.findFirst({
        where: {
          id: reviewerId,
          role: { name: { in: ['Manager', 'Admin'] } },
        },
      });

      if (!reviewer) {
        throw new BadRequestException('Nguoi duyet khong hop le');
      }

      return reviewer;
    }

    const reviewer = await tx.user.findFirst({
      where: { role: { name: { in: ['Manager', 'Admin'] } } },
      orderBy: { id: 'asc' },
    });

    if (!reviewer) {
      throw new BadRequestException(
        'Chua co tai khoan Admin/Manager de duyet tin tuyen dung',
      );
    }

    return reviewer;
  }

  async createJob(
    data: CreateJobDto & { createdByUserId?: number; createdByRole?: any },
  ): Promise<Job> {
    // BR-1.5: salaryMin <= salaryMax; experienceYears >= 0
    if (data.salaryMin !== undefined && data.salaryMax !== undefined && data.salaryMin > data.salaryMax) {
      throw new BadRequestException('salaryMin phải nhỏ hơn hoặc bằng salaryMax');
    }
    if (data.experienceYears !== undefined && data.experienceYears < 0) {
      throw new BadRequestException('experienceYears phải lớn hơn hoặc bằng 0');
    }

    const roleName = this.getRoleName(data.createdByRole);
    const initialStatus = data.status || JobStatus.DRAFT;

    if (roleName === 'HR' && initialStatus === JobStatus.ACTIVE) {
      throw new ForbiddenException(
        'HR không có quyền đăng tin trực tiếp. Vui lòng gửi yêu cầu phê duyệt.',
      );
    }
    
    const job = await this.prisma.$transaction(async (tx) => {
      const newJob = await tx.job.create({
        data: {
          title: data.title,
          description: data.description,
          salaryMin: data.salaryMin,
          salaryMax: data.salaryMax,
          experienceYears: data.experienceYears,
          jobType: data.jobType,
          companyId: this.normalizeOptionalId(data.companyId),
          categoryId: this.normalizeOptionalId(data.categoryId),
          locationId: this.normalizeOptionalId(data.locationId),
          createdByUserId: data.createdByUserId,
          status: initialStatus,
          publishedAt: initialStatus === JobStatus.ACTIVE ? new Date() : undefined,
          expiredAt: data.expiredAt ? new Date(data.expiredAt) : undefined,
        },
      });

      // If status is PENDING, we must create a JobApproval record
      if (initialStatus === JobStatus.PENDING) {
        const reviewer = await this.findReviewer(tx);
        await tx.jobApproval.create({
          data: {
            jobId: newJob.id,
            reviewerId: reviewer.id,
            status: ApprovalStatus.PENDING,
          },
        });
      }

      return newJob;
    });

    await this.auditService.log({
      userId: data.createdByUserId,
      action: 'CREATE',
      resource: 'jobs',
      resourceId: job.id,
      details: { status: job.status },
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
      where.status = params.status as JobStatus;
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
    user?: any
  ) {
    const existingJob = await this.getJob(id);
    const roleName = this.getRoleName(user?.role);
    
    // Governance: HR cannot activate jobs directly
    if (roleName === 'HR' && data.status === JobStatus.ACTIVE) {
      throw new ForbiddenException('HR không có quyền trực tiếp đăng tin. Vui lòng chuyển sang trạng thái PENDING để yêu cầu duyệt.');
    }

    // BR-1.5 validation
    if (data.salaryMin !== undefined && data.salaryMax !== undefined && data.salaryMin > data.salaryMax) {
      throw new BadRequestException('salaryMin phải nhỏ hơn hoặc bằng salaryMax');
    }

    const job = await this.prisma.$transaction(async (tx) => {
      const updatedJob = await tx.job.update({
        where: { id },
        data: {
          title: data.title,
          description: data.description,
          salaryMin: data.salaryMin,
          salaryMax: data.salaryMax,
          experienceYears: data.experienceYears,
          jobType: data.jobType,
          companyId: this.normalizeOptionalId(data.companyId),
          categoryId: this.normalizeOptionalId(data.categoryId),
          locationId: this.normalizeOptionalId(data.locationId),
          status: data.status,
          publishedAt:
            data.status === JobStatus.ACTIVE && !existingJob.publishedAt
              ? new Date()
              : undefined,
          expiredAt: data.expiredAt ? new Date(data.expiredAt) : undefined,
        },
      });

      // If status changed to PENDING, create approval record if it doesn't exist or is not pending
      if (data.status === JobStatus.PENDING && existingJob.status !== JobStatus.PENDING) {
        const reviewer = await this.findReviewer(tx);
        await tx.jobApproval.create({
          data: {
            jobId: id,
            reviewerId: reviewer.id,
            status: ApprovalStatus.PENDING,
          },
        });
      }

      return updatedJob;
    });

    await this.auditService.log({
      userId: user?.id,
      action: 'UPDATE',
      resource: 'jobs',
      resourceId: id,
      details: { ...data, previousStatus: existingJob.status },
    });

    return job;
  }

  async deleteJob(id: number) {
    const job = await this.getJob(id);
    if (job.status !== JobStatus.DRAFT) {
      throw new BadRequestException('Chỉ có thể xóa tin tuyển dụng ở trạng thái DRAFT');
    }

    const applicationCount = await this.prisma.application.count({
      where: { jobId: id },
    });
    if (applicationCount > 0) {
      throw new BadRequestException('Không thể xóa tin đã có ứng viên. Vui lòng đóng tin.');
    }

    return this.prisma.job.delete({ where: { id } });
  }

  // Business Operations
  async closeJob(id: number) {
    const job = await this.getJob(id);
    if (job.status === JobStatus.CLOSED) {
      throw new BadRequestException('Công việc đã được đóng trước đó');
    }
    
    if (![JobStatus.ACTIVE, JobStatus.EXPIRED].includes(job.status)) {
      throw new BadRequestException(
        'Chi co the dong tin dang hoat dong hoac da het han',
      );
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
    if (![JobStatus.ACTIVE, JobStatus.EXPIRED].includes(job.status)) {
      throw new BadRequestException(
        'Chi co the gia han tin dang hoat dong hoac da het han',
      );
    }

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
  async requestApproval(jobId: number, reviewerId?: number) {
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

      const reviewer = await this.findReviewer(tx, reviewerId);
      const approval = await tx.jobApproval.create({
        data: {
          jobId,
          reviewerId: reviewer.id,
          status: 'PENDING' as any,
        },
      });

      await this.auditService.log({
        action: 'REQUEST_APPROVAL',
        resource: 'jobs',
        resourceId: jobId,
        details: { reviewerId: reviewer.id, approvalId: approval.id },
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
    return this.prisma.jobSkill.upsert({
      where: { jobId_skillId: { jobId, skillId: data.skillId } },
      create: {
        jobId,
        skillId: data.skillId,
        level: data.level,
        minYears: data.minYears || 0,
      },
      update: {
        level: data.level,
        minYears: data.minYears || 0,
      },
    });
  }

  async removeJobSkill(jobId: number, skillId: number) {
    await this.getJob(jobId);
    const existing = await this.prisma.jobSkill.findUnique({
      where: { jobId_skillId: { jobId, skillId } },
    });
    if (!existing) {
      throw new NotFoundException('Job skill khong ton tai');
    }
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
    const hardFilter = await this.prisma.hardFilter.findUnique({ where: { id } });
    if (!hardFilter) {
      throw new NotFoundException('Hard filter khong ton tai');
    }
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
