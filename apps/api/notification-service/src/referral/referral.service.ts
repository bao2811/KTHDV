import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReferralService {
  constructor(private readonly prisma: PrismaService) {}

  createReferrer(data: {
    resumeId: number;
    name?: string;
    email?: string;
    phone?: string;
    position?: string;
  }) {
    return this.prisma.referrer.create({ data });
  }

  listReferrers(resumeId?: number) {
    return this.prisma.referrer.findMany({
      where: resumeId ? { resumeId } : undefined,
      orderBy: { id: 'asc' },
    });
  }

  async createVerification(referrerId: number, token: string) {
    const referrer = await this.prisma.referrer.findUnique({
      where: { id: referrerId },
    });
    if (!referrer) {
      throw new NotFoundException('Referrer không tồn tại');
    }
    return this.prisma.referralVerification.create({
      data: {
        referrerId,
        token,
      },
    });
  }

  async getVerificationByToken(token: string) {
    const verification = await this.prisma.referralVerification.findUnique({
      where: { token },
      include: { referrer: true },
    });
    if (!verification) {
      throw new NotFoundException('Verification không tồn tại');
    }
    return verification;
  }

  async respondVerification(
    token: string,
    data: {
      status: 'PENDING' | 'VERIFIED' | 'SUSPICIOUS' | 'EXPIRED';
      responseData?: any;
    },
  ) {
    const verification = await this.prisma.referralVerification.findUnique({
      where: { token },
    });
    if (!verification) {
      throw new NotFoundException('Verification không tồn tại');
    }
    return this.prisma.referralVerification.update({
      where: { token },
      data: {
        status: data.status,
        respondedAt: new Date(),
        responseData: data.responseData,
      },
    });
  }
}
