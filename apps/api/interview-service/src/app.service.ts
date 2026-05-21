import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  getHealth(service: string) {
    return {
      status: 'ok',
      service,
      timestamp: new Date().toISOString(),
    };
  }

  async getReadiness(service: string) {
    await this.prisma.$queryRaw`SELECT 1`;

    return {
      status: 'ready',
      service,
      checks: {
        database: 'ok',
      },
      timestamp: new Date().toISOString(),
    };
  }
}
