import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MatchingService {
  constructor(private readonly prisma: PrismaService) {}

  async runMatch(applicationId: number) {
    const application = await this.prisma.application.findUnique({
      where: { id: applicationId },
    });

    if (!application) {
      throw new NotFoundException('Application không tồn tại');
    }

    const result = await this.prisma.matchResult.upsert({
      where: { applicationId },
      create: {
        applicationId,
        overallScore: 75.0,
        passedHardFilter: true,
        matchDetails: { source: 'stub', note: 'Simple scoring for MVP' },
      },
      update: {
        overallScore: 75.0,
        passedHardFilter: true,
        matchDetails: { source: 'stub', note: 'Simple scoring for MVP' },
      },
    });

    return result;
  }

  async getMatch(applicationId: number) {
    const result = await this.prisma.matchResult.findUnique({
      where: { applicationId },
    });
    if (!result) {
      throw new NotFoundException('MatchResult không tồn tại');
    }
    return result;
  }
}
