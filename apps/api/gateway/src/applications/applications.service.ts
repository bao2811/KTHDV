import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ApplicationsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Apply for a job
   * Candidate must have a profile and a resume to apply
   */
  async applyForJob(data: {
    jobId: number;
    candidateId: number;
    resumeId: number;
  }) {
    // Verify job exists and is ACTIVE
    const job = await this.prisma.job.findUnique({
      where: { id: data.jobId },
    });
    if (!job) {
      throw new NotFoundException('Job không tồn tại');
    }
    if (job.status !== 'ACTIVE') {
      throw new BadRequestException('Công việc này không còn tuyển dụng');
    }

    // Verify resume belongs to candidate
    const resume = await this.prisma.resume.findUnique({
      where: { id: data.resumeId },
    });
    if (!resume || resume.userId !== data.candidateId) {
      throw new BadRequestException('Resume không hợp lệ');
    }

    // Check if already applied
    const existing = await this.prisma.application.findFirst({
      where: {
        jobId: data.jobId,
        candidateId: data.candidateId,
      },
    });
    if (existing) {
      throw new BadRequestException('Bạn đã ứng tuyển công việc này rồi');
    }

    // Create application
    const app = await this.prisma.application.create({
      data,
      include: {
        job: true,
        candidate: { include: { profile: true } },
        resume: true,
      },
    });

    return this.mapApplication(app);
  }

  /**
   * Get applications for a candidate
   */
  async getCandidateApplications(
    candidateId: number,
    params: { status?: string; page?: number; limit?: number } = {},
  ) {
    const page = params.page || 1;
    const limit = params.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = { candidateId };
    if (params.status) {
      where.status = params.status;
    }

    const [data, total] = await Promise.all([
      this.prisma.application.findMany({
        where,
        skip,
        take: limit,
        include: {
          job: {
            include: { company: true, location: true },
          },
          resume: true,
          matchResult: true,
          interviews: {
            include: { interviewer: { include: { profile: true } } }
          },
        },
        orderBy: { appliedAt: 'desc' },
      }),
      this.prisma.application.count({ where }),
    ]);

    const mappedData = data.map((app) => this.mapApplication(app));

    return {
      data: mappedData,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get application details
   */
  async getApplication(id: number) {
    const app = await this.prisma.application.findUnique({
      where: { id },
      include: {
        job: {
          include: {
            company: true,
            category: true,
            location: true,
            jobSkills: { include: { skill: true } },
          },
        },
        candidate: { include: { profile: true } },
        resume: true,
        matchResult: true,
        interviews: { 
          include: { 
            interviewer: { include: { profile: true } } 
          } 
        },
      },
    });
    if (!app) {
      throw new NotFoundException('Application không tồn tại');
    }
    return this.mapApplication(app);
  }

  /**
   * Cancel application (only if status is SUBMITTED)
   */
  async cancelApplication(id: number) {
    const app = await this.getApplication(id);
    if (app.status !== 'SUBMITTED') {
      throw new BadRequestException(
        'Chỉ có thể hủy ứng tuyển ở trạng thái "Đã nộp"',
      );
    }
    return this.prisma.application.delete({ where: { id } });
  }

  /**
   * Get application statistics for a candidate
   */
  async getCandidateApplicationStats(candidateId: number) {
    const stats = await this.prisma.application.groupBy({
      by: ['status'],
      where: { candidateId },
      _count: true,
    });

    const total = await this.prisma.application.count({
      where: { candidateId },
    });

    return {
      total,
      byStatus: Object.fromEntries(
        stats.map((stat) => [stat.status, stat._count]),
      ),
    };
  }

  /**
   * Update application status (HR/Admin)
   */
  async updateApplicationStatus(id: number, status: string) {
    // Check if exists
    await this.getApplication(id);

    const app = await this.prisma.application.update({
      where: { id },
      data: { status: status as any },
      include: {
        job: true,
        candidate: { include: { profile: true } },
      },
    });

    return this.mapApplication(app);
  }

  private mapApplication(app: any) {
    if (!app) return null;
    const result = { ...app };

    if (result.candidate) {
      result.candidate = {
        ...result.candidate,
        fullName: result.candidate.profile?.fullName || result.candidate.email,
        avatarUrl: result.candidate.profile?.avatarUrl || null,
      };
    }

    if (result.interviews && Array.isArray(result.interviews)) {
      result.interviews = result.interviews.map((int: any) => {
        if (int.interviewer) {
          return {
            ...int,
            interviewer: {
              ...int.interviewer,
              fullName: int.interviewer.profile?.fullName || int.interviewer.email,
              avatarUrl: int.interviewer.profile?.avatarUrl || null,
            },
          };
        }
        return int;
      });
    }

    return result;
  }

  /**
   * Get all applications with filtering (HR/Admin)
   */
  async getAllApplications(
    params: { status?: string; jobId?: number; page?: number; limit?: number } = {},
  ) {
    const page = params.page || 1;
    const limit = params.limit || 50;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (params.status) where.status = params.status;
    if (params.jobId) where.jobId = params.jobId;

    const [data, total] = await Promise.all([
      this.prisma.application.findMany({
        where,
        skip,
        take: limit,
        include: {
          job: {
            include: { company: true, location: true },
          },
          candidate: { include: { profile: true } },
          resume: true,
          matchResult: true,
          interviews: { 
            include: { 
              interviewer: { include: { profile: true } } 
            } 
          },
        },
        orderBy: { appliedAt: 'desc' },
      }),
      this.prisma.application.count({ where }),
    ]);

    const mappedData = data.map((app) => this.mapApplication(app));

    return {
      data: mappedData,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
