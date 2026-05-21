import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InterviewService {
  constructor(private readonly prisma: PrismaService) {}

  // ===== Availability Slots =====

  async createSlot(data: { userId: number; startTime: string; endTime: string }) {
    const start = new Date(data.startTime);
    const end = new Date(data.endTime);

    if (end <= start) {
      throw new BadRequestException('endTime phải sau startTime');
    }

    return this.prisma.availabilitySlot.create({
      data: {
        userId: data.userId,
        startTime: start,
        endTime: end,
      },
    });
  }

  listSlots(userId?: number) {
    return this.prisma.availabilitySlot.findMany({
      where: userId ? { userId } : undefined,
      orderBy: { startTime: 'asc' },
    });
  }

  async getSlot(id: number) {
    const slot = await this.prisma.availabilitySlot.findUnique({
      where: { id },
    });
    if (!slot) {
      throw new NotFoundException('Slot không tồn tại');
    }
    return slot;
  }

  async updateSlot(
    id: number,
    data: Partial<{ startTime?: string; endTime?: string; isBooked?: boolean }>,
  ) {
    await this.getSlot(id);
    return this.prisma.availabilitySlot.update({
      where: { id },
      data: {
        startTime: data.startTime ? new Date(data.startTime) : undefined,
        endTime: data.endTime ? new Date(data.endTime) : undefined,
        isBooked: data.isBooked,
      },
    });
  }

  async deleteSlot(id: number) {
    await this.getSlot(id);
    return this.prisma.availabilitySlot.delete({ where: { id } });
  }

  // ===== Interviews =====

  async createInterview(data: {
    applicationId: number;
    interviewerId: number;
    scheduledAt: string;
    durationMinutes?: number;
    interviewType: 'ONLINE' | 'IN_PERSON';
    meetingLink?: string;
    notes?: string;
  }) {
    const interview = await this.prisma.interview.create({
      data: {
        applicationId: data.applicationId,
        interviewerId: data.interviewerId,
        scheduledAt: new Date(data.scheduledAt),
        durationMinutes: data.durationMinutes || 60,
        interviewType: data.interviewType,
        meetingLink: data.meetingLink,
        notes: data.notes,
      },
      include: {
        application: {
          include: {
            candidate: { include: { profile: true } },
            job: { select: { id: true, title: true } },
          },
        },
        interviewer: { include: { profile: true } },
      },
    });

    return this.mapInterview(interview);
  }

  private mapInterview(interview: any) {
    if (!interview) return null;
    
    // Create a plain object to avoid Prisma read-only issues
    const result = { ...interview };

    // Map candidate names
    if (result.application?.candidate) {
      result.application.candidate = {
        ...result.application.candidate,
        fullName: result.application.candidate.profile?.fullName || result.application.candidate.email,
        avatarUrl: result.application.candidate.profile?.avatarUrl || null,
      };
    }

    // Map interviewer names
    if (result.interviewer) {
      result.interviewer = {
        ...result.interviewer,
        fullName: result.interviewer.profile?.fullName || result.interviewer.email,
        avatarUrl: result.interviewer.profile?.avatarUrl || null,
      };
    }

    return result;
  }

  async listInterviews(params: {
    applicationId?: number;
    interviewerId?: number;
    status?: string;
    page?: number;
    limit?: number;
  }) {
    const page = params.page || 1;
    const limit = params.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (params.applicationId) where.applicationId = params.applicationId;
    if (params.interviewerId) where.interviewerId = params.interviewerId;
    if (params.status) where.status = params.status;

    const [data, total] = await Promise.all([
      this.prisma.interview.findMany({
        where,
        skip,
        take: limit,
        orderBy: { scheduledAt: 'asc' },
        include: {
          application: {
            include: {
              candidate: { include: { profile: true } },
              job: { select: { id: true, title: true } },
            },
          },
          interviewer: { include: { profile: true } },
        },
      }),
      this.prisma.interview.count({ where }),
    ]);

    const mappedData = data.map(item => this.mapInterview(item));

    return {
      data: mappedData,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getInterview(id: number) {
    const interview = await this.prisma.interview.findUnique({
      where: { id },
      include: {
        application: {
          include: {
            candidate: { include: { profile: true } },
            job: { select: { id: true, title: true } },
            resume: true,
          },
        },
        interviewer: { include: { profile: true } },
      },
    });
    if (!interview) {
      throw new NotFoundException('Interview không tồn tại');
    }
    return this.mapInterview(interview);
  }

  async updateInterview(
    id: number,
    data: Partial<{
      scheduledAt?: string;
      durationMinutes?: number;
      interviewType?: 'ONLINE' | 'IN_PERSON';
      meetingLink?: string;
      status?: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
      notes?: string;
    }>,
  ) {
    await this.getInterview(id);
    return this.prisma.interview.update({
      where: { id },
      data: {
        scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : undefined,
        durationMinutes: data.durationMinutes,
        interviewType: data.interviewType,
        meetingLink: data.meetingLink,
        status: data.status,
        notes: data.notes,
      },
    });
  }

  async deleteInterview(id: number) {
    await this.getInterview(id);
    return this.prisma.interview.delete({ where: { id } });
  }

  // ===== Auto-Schedule =====

  async findAvailableSlots(interviewerId: number, startDate: string, endDate: string) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    return this.prisma.availabilitySlot.findMany({
      where: {
        userId: interviewerId,
        isBooked: false,
        startTime: { gte: start },
        endTime: { lte: end },
      },
      orderBy: { startTime: 'asc' },
    });
  }

  async autoSchedule(data: {
    applicationId: number;
    interviewerId: number;
    durationMinutes?: number;
    interviewType: 'ONLINE' | 'IN_PERSON';
  }) {
    const duration = data.durationMinutes || 60;

    const availableSlot = await this.prisma.availabilitySlot.findFirst({
      where: {
        userId: data.interviewerId,
        isBooked: false,
        startTime: { gte: new Date() },
      },
      orderBy: { startTime: 'asc' },
    });

    if (!availableSlot) {
      throw new BadRequestException(
        'Không tìm thấy khung giờ trống nào của người phỏng vấn',
      );
    }

    const [interview] = await this.prisma.$transaction([
      this.prisma.interview.create({
        data: {
          applicationId: data.applicationId,
          interviewerId: data.interviewerId,
          scheduledAt: availableSlot.startTime,
          durationMinutes: duration,
          interviewType: data.interviewType,
        },
        include: {
          application: {
            include: {
              candidate: { include: { profile: true } },
              job: { select: { id: true, title: true } },
            },
          },
          interviewer: { include: { profile: true } },
        },
      }),
      this.prisma.availabilitySlot.update({
        where: { id: availableSlot.id },
        data: { isBooked: true },
      }),
    ]);

    return this.mapInterview(interview);
  }
}
