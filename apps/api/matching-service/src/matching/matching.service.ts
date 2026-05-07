import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MatchResult } from '@prisma/client';

@Injectable()
export class MatchingService {
  constructor(private readonly prisma: PrismaService) {}

  async runMatch(applicationId: number): Promise<MatchResult> {
    const application = await this.prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        job: {
          include: {
            jobSkills: { include: { skill: true } },
            hardFilters: true,
          },
        },
        candidate: {
          include: { candidateProfile: { include: { experiences: true } } },
        },
        resume: true,
      },
    });

    if (!application) {
      throw new NotFoundException('Application không tồn tại');
    }

    // Simple skill-based matching (MVP)
    // In production, replace with NLP/AI matching
    const jobSkills = application.job.jobSkills || [];
    const totalSkills = jobSkills.length || 1;
    const matchedCount = Math.floor(totalSkills * 0.7); // Placeholder
    const overallScore = totalSkills > 0
      ? Math.round((matchedCount / totalSkills) * 100)
      : 75;

    // Check hard filters
    const passedHardFilter = true; // Simplified for MVP

    const result = await this.prisma.matchResult.upsert({
      where: { applicationId },
      create: {
        applicationId,
        overallScore,
        passedHardFilter,
        matchDetails: {
          totalSkills,
          matchedSkills: matchedCount,
          source: 'skill-based-mvp',
        },
      },
      update: {
        overallScore,
        passedHardFilter,
        matchDetails: {
          totalSkills,
          matchedSkills: matchedCount,
          source: 'skill-based-mvp',
        },
      },
    });

    // Update application status to MATCHED
    await this.prisma.application.update({
      where: { id: applicationId },
      data: { status: 'MATCHED' },
    });

    return result;
  }

  async getMatch(applicationId: number): Promise<MatchResult> {
    const result = await this.prisma.matchResult.findUnique({
      where: { applicationId },
      include: {
        application: {
          include: {
            job: { select: { id: true, title: true } },
            candidate: { select: { id: true, email: true } },
          },
        },
      },
    });
    if (!result) {
      throw new NotFoundException('MatchResult không tồn tại');
    }
    return result;
  }

  async listMatches(params: { page?: number; limit?: number } = {}) {
    const page = params.page || 1;
    const limit = params.limit || 10;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.matchResult.findMany({
        skip,
        take: limit,
        orderBy: { processedAt: 'desc' },
        include: {
          application: {
            include: {
              job: { select: { id: true, title: true } },
              candidate: { select: { id: true, email: true } },
            },
          },
        },
      }),
      this.prisma.matchResult.count(),
    ]);

    return {
      data,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }
}
