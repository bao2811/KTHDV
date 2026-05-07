import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AvailabilitySlot, Interview } from '@prisma/client';

@Injectable()
export class InterviewService {
  constructor(private readonly prisma: PrismaService) {}

  // ===== Availability Slots =====

  createSlot(data: { userId: number; startTime: string; endTime: string }): Promise<AvailabilitySlot> {
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

  createInterview(data: {
    applicationId: number;
    interviewerId: number;
    scheduledAt: string;
    durationMinutes?: number;
    interviewType: 'ONLINE' | 'IN_PERSON';
    meetingLink?: string;
    notes?: string;
  }) {
    return this.prisma.interview.create({
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
        application: true,
        interviewer: { select: { id: true, email: true } },
      },
    });
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
              candidate: { select: { id: true, email: true } },
              job: { select: { id: true, title: true } },
            },
          },
          interviewer: { select: { id: true, email: true } },
        },
      }),
      this.prisma.interview.count({ where }),
    ]);

    return {
      data,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getInterview(id: number) {
    const interview = await this.prisma.interview.findUnique({
      where: { id },
      include: {
        application: {
          include: {
            candidate: { select: { id: true, email: true } },
            job: { select: { id: true, title: true } },
            resume: true,
          },
        },
        interviewer: { select: { id: true, email: true } },
      },
    });
    if (!interview) {
      throw new NotFoundException('Interview không tồn tại');
    }
    return interview;
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
  // Finds overlapping free slots between an interviewer and a candidate time range.

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

    // Find next available (unbooked) slot for the interviewer
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

    // Book the slot + create interview in a transaction
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
          application: true,
          interviewer: { select: { id: true, email: true } },
        },
      }),
      this.prisma.availabilitySlot.update({
        where: { id: availableSlot.id },
        data: { isBooked: true },
      }),
    ]);

    return interview;
  }
}
