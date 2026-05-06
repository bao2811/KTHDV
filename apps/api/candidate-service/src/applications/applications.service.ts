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
    return this.prisma.application.create({
      data,
      include: {
        job: true,
        candidate: { include: { profile: true } },
        resume: true,
      },
    });
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
          interviews: true,
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
        interviews: { include: { interviewer: true } },
      },
    });
    if (!app) {
      throw new NotFoundException('Application không tồn tại');
    }
    return app;
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
}
