import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { PipelineService } from './pipeline.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('pipeline-stages')
export class PipelineController {
  constructor(private readonly pipelineService: PipelineService) {}

  /**
   * GET /api/pipeline-stages
   * Danh sách pipeline stages (all authenticated users)
   */
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  async findAll() {
    return this.pipelineService.findAll();
  }

  /**
   * POST /api/pipeline-stages
   * Tạo pipeline stage (Admin only)
   */
  @Post()
  @UseGuards(RolesGuard)
  @Roles('Admin')
  async create(@Body() body: { name: string; order: number; color: string }) {
    return this.pipelineService.create(body);
  }

  /**
   * PATCH /api/pipeline-stages/:id
   * Cập nhật pipeline stage (Admin only)
   */
  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('Admin')
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
  @UseGuards(RolesGuard)
  @Roles('Admin')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.pipelineService.remove(id);
  }
}
