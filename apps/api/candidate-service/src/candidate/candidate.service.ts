import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CandidateService {
  constructor(private readonly prisma: PrismaService) {}

  // Profiles
  createProfile(data: {
    userId: number;
    fullName: string;
    title?: string;
    phone?: string;
    dateOfBirth?: string;
    address?: string;
    summary?: string;
  }): Promise<any> {
    return this.prisma.candidateProfile.create({
      data: {
        userId: data.userId,
        fullName: data.fullName,
        title: data.title,
        phone: data.phone,
        address: data.address,
        summary: data.summary,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
      },
      include: { experiences: true, educations: true },
    });
  }

  async listProfiles(
    params: { page?: number; limit?: number; search?: string } = {},
  ) {
    const page = params.page || 1;
    const limit = params.limit || 10;
    const skip = (page - 1) * limit;

    const where = params.search
      ? {
          OR: [
            {
              fullName: {
                contains: params.search,
                mode: 'insensitive' as const,
              },
            },
            {
              user: {
                email: {
                  contains: params.search,
                  mode: 'insensitive' as const,
                },
              },
            },
          ],
        }
      : {};

    const [data, total] = await Promise.all([
      this.prisma.candidateProfile.findMany({
        where,
        skip,
        take: limit,
        include: { 
          user: {
            include: { profile: true }
          }, 
          experiences: true, 
          educations: true 
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.candidateProfile.count({ where }),
    ]);

    // Map avatarUrl from profile if available
    const mappedData = data.map(candidate => ({
      ...candidate,
      avatarUrl: candidate.user?.profile?.avatarUrl || null,
    }));

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

  async getProfileByUserId(userId: number) {
    const profile = await this.prisma.candidateProfile.findUnique({
      where: { userId },
      include: { 
        experiences: true, 
        educations: true, 
        user: {
          include: { profile: true }
        } 
      },
    });
    if (!profile) {
      throw new NotFoundException('Profile không tồn tại');
    }
    return {
      ...profile,
      avatarUrl: (profile.user as any)?.profile?.avatarUrl || null,
    };
  }

  async getProfileById(id: number) {
    const profile = await this.prisma.candidateProfile.findUnique({
      where: { id },
      include: { 
        experiences: true, 
        educations: true, 
        user: {
          include: { profile: true }
        } 
      },
    });
    if (!profile) {
      throw new NotFoundException('Profile không tồn tại');
    }
    return {
      ...profile,
      avatarUrl: (profile.user as any)?.profile?.avatarUrl || null,
    };
  }

  async updateProfile(
    userId: number,
    data: Partial<{
      fullName: string;
      title?: string;
      phone?: string;
      dateOfBirth?: string | null;
      address?: string;
      summary?: string;
    }>,
  ) {
    const updateData = {
      fullName: data.fullName || 'User',
      title: data.title,
      phone: data.phone,
      address: data.address,
      summary: data.summary,
      dateOfBirth: data.dateOfBirth
        ? new Date(data.dateOfBirth)
        : data.dateOfBirth === null
          ? null
          : undefined,
    };

    return this.prisma.candidateProfile.upsert({
      where: { userId },
      update: updateData,
      create: {
        userId,
        ...updateData,
      },
    });
  }

  // Experiences
  createExperience(
    profileId: number,
    data: {
      companyName?: string;
      position?: string;
      startDate?: string;
      endDate?: string;
      description?: string;
    },
  ) {
    return this.prisma.workExperience.create({
      data: {
        profileId,
        companyName: data.companyName,
        position: data.position,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        description: data.description,
      },
    });
  }

  listExperiences(profileId: number) {
    return this.prisma.workExperience.findMany({
      where: { profileId },
      orderBy: { id: 'asc' },
    });
  }

  async updateExperience(
    id: number,
    data: Partial<{
      companyName?: string;
      position?: string;
      startDate?: string | null;
      endDate?: string | null;
      description?: string;
    }>,
  ) {
    const existing = await this.prisma.workExperience.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException('Experience không tồn tại');
    }
    return this.prisma.workExperience.update({
      where: { id },
      data: {
        companyName: data.companyName,
        position: data.position,
        startDate: data.startDate
          ? new Date(data.startDate)
          : data.startDate === null
            ? null
            : undefined,
        endDate: data.endDate
          ? new Date(data.endDate)
          : data.endDate === null
            ? null
            : undefined,
        description: data.description,
      },
    });
  }

  async deleteExperience(id: number) {
    const existing = await this.prisma.workExperience.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException('Experience không tồn tại');
    }
    return this.prisma.workExperience.delete({ where: { id } });
  }

  // Educations
  createEducation(
    profileId: number,
    data: {
      schoolName?: string;
      degree?: string;
      major?: string;
      startDate?: string;
      endDate?: string;
    },
  ) {
    return this.prisma.education.create({
      data: {
        profileId,
        schoolName: data.schoolName,
        degree: data.degree,
        major: data.major,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
      },
    });
  }

  listEducations(profileId: number) {
    return this.prisma.education.findMany({
      where: { profileId },
      orderBy: { id: 'asc' },
    });
  }

  async updateEducation(
    id: number,
    data: Partial<{
      schoolName?: string;
      degree?: string;
      major?: string;
      startDate?: string | null;
      endDate?: string | null;
    }>,
  ) {
    const existing = await this.prisma.education.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Education không tồn tại');
    }
    return this.prisma.education.update({
      where: { id },
      data: {
        schoolName: data.schoolName,
        degree: data.degree,
        major: data.major,
        startDate: data.startDate
          ? new Date(data.startDate)
          : data.startDate === null
            ? null
            : undefined,
        endDate: data.endDate
          ? new Date(data.endDate)
          : data.endDate === null
            ? null
            : undefined,
      },
    });
  }

  async deleteEducation(id: number) {
    const existing = await this.prisma.education.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Education không tồn tại');
    }
    return this.prisma.education.delete({ where: { id } });
  }

  // Resumes
  createResume(data: {
    userId: number;
    fileUrl: string;
    fileType: 'PDF' | 'DOCX';
    fileName?: string;
    isPrimary?: boolean;
  }) {
    return this.prisma.resume.create({ data });
  }

  listResumes(userId?: number) {
    return this.prisma.resume.findMany({
      where: userId ? { userId } : undefined,
      orderBy: { uploadedAt: 'desc' },
    });
  }

  async setPrimaryResume(id: number, userId: number) {
    await this.prisma.$transaction([
      this.prisma.resume.updateMany({
        where: { userId },
        data: { isPrimary: false },
      }),
      this.prisma.resume.update({ where: { id }, data: { isPrimary: true } }),
    ]);
    return { success: true };
  }

  async deleteResume(id: number) {
    const existing = await this.prisma.resume.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Resume không tồn tại');
    }
    return this.prisma.resume.delete({ where: { id } });
  }

  // Applications
  createApplication(data: {
    jobId: number;
    candidateId: number;
    resumeId: number;
  }): Promise<any> {
    return this.prisma.application.create({
      data: {
        jobId: data.jobId,
        candidateId: data.candidateId,
        resumeId: data.resumeId,
      },
      include: {
        job: { select: { title: true, company: { select: { name: true } } } },
      },
    });
  }

  async listApplications(
    params: {
      candidateId?: number;
      jobId?: number;
      status?: string;
      page?: number;
      limit?: number;
    } = {},
  ): Promise<{ data: any[]; pagination: any }> {
    const page = params.page || 1;
    const limit = params.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (params.candidateId) {
      where.candidateId = params.candidateId;
    }
    if (params.jobId) {
      where.jobId = params.jobId;
    }
    if (params.status) {
      where.status = params.status;
    }

    const [data, total] = await Promise.all([
      this.prisma.application.findMany({
        where,
        skip,
        take: limit,
        orderBy: { appliedAt: 'desc' },
        include: {
          job: true,
          resume: true,
          matchResult: true,
          interviews: true,
        },
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

  async getApplication(id: number) {
    const app = await this.prisma.application.findUnique({
      where: { id },
      include: { resume: true, matchResult: true, interviews: true },
    });
    if (!app) {
      throw new NotFoundException('Application không tồn tại');
    }
    return app;
  }

  async updateApplicationStatus(
    id: number,
    status: 'SUBMITTED' | 'MATCHED' | 'INTERVIEWING' | 'OFFERED' | 'REJECTED',
  ) {
    await this.getApplication(id);
    return this.prisma.application.update({
      where: { id },
      data: { status },
    });
  }
}
