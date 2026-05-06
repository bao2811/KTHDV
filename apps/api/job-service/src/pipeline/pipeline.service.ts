import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PipelineService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get all pipeline stages ordered by position
   */
  async findAll() {
    return this.prisma.pipelineStage.findMany({
      orderBy: { order: 'asc' },
    });
  }

  /**
   * Create a new pipeline stage
   */
  async create(data: { name: string; order: number; color: string }) {
    return this.prisma.pipelineStage.create({ data });
  }

  /**
   * Update a pipeline stage
   */
  async update(
    id: number,
    data: { name?: string; order?: number; color?: string },
  ) {
    return this.prisma.pipelineStage.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete a pipeline stage
   */
  async remove(id: number) {
    return this.prisma.pipelineStage.delete({
      where: { id },
    });
  }
}
