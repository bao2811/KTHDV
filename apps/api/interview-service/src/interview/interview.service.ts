import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InterviewService {
  constructor(private readonly prisma: PrismaService) {}

  // Availability slots
  createSlot(data: { userId: number; startTime: string; endTime: string }) {
    return this.prisma.availabilitySlot.create({
      data: {
        userId: data.userId,
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
      },
    });
  }

  listSlots(userId?: number) {
    return this.prisma.availabilitySlot.findMany({
      where: userId ? { userId } : undefined,
      orderBy: { startTime: 'asc' },
    });
  }

  async updateSlot(
    id: number,
    data: Partial<{ startTime?: string; endTime?: string; isBooked?: boolean }>,
  ) {
    const slot = await this.prisma.availabilitySlot.findUnique({
      where: { id },
    });
    if (!slot) {
      throw new NotFoundException('Slot không tồn tại');
    }
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
    const slot = await this.prisma.availabilitySlot.findUnique({
      where: { id },
    });
    if (!slot) {
      throw new NotFoundException('Slot không tồn tại');
    }
    return this.prisma.availabilitySlot.delete({ where: { id } });
  }

  // Interviews
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
        durationMinutes: data.durationMinutes,
        interviewType: data.interviewType,
        meetingLink: data.meetingLink,
        notes: data.notes,
      },
    });
  }

  listInterviews(params: { applicationId?: number; interviewerId?: number }) {
    const where: any = {};
    if (params.applicationId) {
      where.applicationId = params.applicationId;
    }
    if (params.interviewerId) {
      where.interviewerId = params.interviewerId;
    }
    return this.prisma.interview.findMany({
      where,
      orderBy: { scheduledAt: 'asc' },
    });
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
    const interview = await this.prisma.interview.findUnique({ where: { id } });
    if (!interview) {
      throw new NotFoundException('Interview không tồn tại');
    }
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
}
