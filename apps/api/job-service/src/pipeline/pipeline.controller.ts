import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { PipelineService } from './pipeline.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Pipeline Stages')
@Controller('pipeline-stages')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PipelineController {
  constructor(private readonly pipelineService: PipelineService) {}

  /**
   * GET /api/pipeline-stages
   * Danh sách pipeline stages (all authenticated users)
   */
  @Get()
  async findAll() {
    return this.pipelineService.findAll();
  }

  /**
   * POST /api/pipeline-stages
   * Tạo pipeline stage (Admin only)
   */
  @Post()
  async create(@Body() body: { name: string; order: number; color: string }) {
    return this.pipelineService.create(body);
  }

  /**
   * PATCH /api/pipeline-stages/:id
   * Cập nhật pipeline stage (Admin only)
   */
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { name?: string; order?: number; color?: string },
  ) {
    return this.pipelineService.update(id, body);
  }

  /**
   * DELETE /api/pipeline-stages/:id
   * Xóa pipeline stage (Admin only)
   */
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.pipelineService.remove(id);
  }
}
