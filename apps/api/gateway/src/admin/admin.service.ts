import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  /**
   * GET /api/admin/stats
   * Thống kê tổng quan cho Admin Dashboard
   */
  async getStats() {
    const now = new Date();
    const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // Parallel queries for performance
    const [
      totalUsers,
      usersLastMonth,
      totalActiveJobs,
      jobsLastMonth,
      applicationsThisMonth,
      applicationsLastMonth,
    ] = await Promise.all([
      // Total users
      this.prisma.user.count(),
      // Users created last month (for growth calculation)
      this.prisma.user.count({
        where: {
          createdAt: {
            gte: firstDayLastMonth,
            lt: firstDayThisMonth,
          },
        },
      }),
      // Active jobs
      this.prisma.job.count({
        where: { status: 'ACTIVE' },
      }),
      // Active jobs last month
      this.prisma.job.count({
        where: {
          status: 'ACTIVE',
          createdAt: { lt: firstDayThisMonth },
        },
      }),
      // Applications this month
      this.prisma.application.count({
        where: {
          appliedAt: { gte: firstDayThisMonth },
        },
      }),
      // Applications last month
      this.prisma.application.count({
        where: {
          appliedAt: {
            gte: firstDayLastMonth,
            lt: firstDayThisMonth,
          },
        },
      }),
    ]);

    // Calculate growth percentages
    const calcGrowth = (current: number, previous: number): number => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 1000) / 10;
    };

    const usersThisMonth = await this.prisma.user.count({
      where: { createdAt: { gte: firstDayThisMonth } },
    });

    return {
      totalUsers,
      totalActiveJobs,
      totalApplicationsThisMonth: applicationsThisMonth,
      systemHealth: 99.9, // Placeholder — can integrate real health checks later
      growth: {
        users: calcGrowth(usersThisMonth, usersLastMonth),
        jobs: calcGrowth(totalActiveJobs, jobsLastMonth || 1),
        applications: calcGrowth(applicationsThisMonth, applicationsLastMonth),
      },
    };
  }

  /**
   * GET /api/admin/audit-logs
   * Nhật ký hệ thống với pagination + filter
   */
  async getAuditLogs(params: {
    page?: number;
    limit?: number;
    userId?: string;
    resource?: string;
    action?: string;
    startDate?: string;
    endDate?: string;
  }) {
    const page = params.page || 1;
    const limit = params.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (params.userId) {
      where.userId = parseInt(params.userId, 10);
    }
    if (params.resource) {
      where.resource = params.resource;
    }
    if (params.action) {
      where.action = params.action;
    }
    if (params.startDate || params.endDate) {
      where.timestamp = {};
      if (params.startDate) {
        where.timestamp.gte = new Date(params.startDate);
      }
      if (params.endDate) {
        where.timestamp.lte = new Date(params.endDate);
      }
    }

    const [logs, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        include: {
          user: {
            select: { id: true, email: true },
          },
        },
        orderBy: { timestamp: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return {
      data: logs,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * GET /api/admin/dashboard-chart
   * Dữ liệu biểu đồ tăng trưởng (6 tháng gần nhất)
   */
  async getDashboardChart() {
    const now = new Date();
    const months: { month: string; newUsers: number; applications: number }[] = [];

    for (let i = 5; i >= 0; i--) {
      const startDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const endDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);

      const [newUsers, applications] = await Promise.all([
        this.prisma.user.count({
          where: {
            createdAt: {
              gte: startDate,
              lte: endDate,
            },
          },
        }),
        this.prisma.application.count({
          where: {
            appliedAt: {
              gte: startDate,
              lte: endDate,
            },
          },
        }),
      ]);

      // Format month label in Vietnamese
      const monthLabel = `Thg ${startDate.getMonth() + 1}`;

      months.push({
        month: monthLabel,
        newUsers,
        applications,
      });
    }

    return months;
  }

  async getReferrals(params: {
    page?: number;
    limit?: number;
    status?: string;
  }) {
    const page = params.page || 1;
    const limit = params.limit || 20;
    const skip = (page - 1) * limit;
    const where: any = {};

    if (params.status) {
      where.status = params.status;
    }

    const [data, total] = await Promise.all([
      this.prisma.referralVerification.findMany({
        where,
        include: {
          referrer: {
            include: {
              resume: {
                include: {
                  user: {
                    select: {
                      id: true,
                      email: true,
                      profile: { select: { fullName: true, phone: true } },
                      candidateProfile: {
                        select: { fullName: true, phone: true, title: true },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: { sentAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.referralVerification.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async verifyReferral(
    id: number,
    data: { status: string; responseData?: any },
  ) {
    const validStatuses = ['PENDING', 'VERIFIED', 'SUSPICIOUS', 'EXPIRED'];
    if (!validStatuses.includes(data.status)) {
      throw new BadRequestException(
        `Status khong hop le. Chon: ${validStatuses.join(', ')}`,
      );
    }

    const verification = await this.prisma.referralVerification.findUnique({
      where: { id },
    });
    if (!verification) {
      throw new NotFoundException('Referral verification khong ton tai');
    }

    return this.prisma.referralVerification.update({
      where: { id },
      data: {
        status: data.status as any,
        respondedAt: data.status === 'PENDING' ? null : new Date(),
        responseData: data.responseData,
      },
      include: { referrer: true },
    });
  }
}
