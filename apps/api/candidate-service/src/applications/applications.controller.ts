import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ApplicationsService } from './applications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Applications')
@Controller('applications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  /**
   * Apply for a job
   * POST /api/applications/apply
   *
   * Body: { jobId: number; resumeId: number }
   */
  @Post('apply')
  async applyForJob(
    @CurrentUser('id') candidateId: number,
    @Body() body: { jobId: number; resumeId: number },
  ) {
    return this.applicationsService.applyForJob({
      jobId: body.jobId,
      candidateId,
      resumeId: body.resumeId,
    });
  }

  /**
   * Get my applications
   * GET /api/applications/me?status=SUBMITTED&page=1&limit=10
   */
  @Get('me')
  async getMyApplications(
    @CurrentUser('id') candidateId: number,
    @Query('status')
    status?: 'SUBMITTED' | 'MATCHED' | 'INTERVIEWING' | 'OFFERED' | 'REJECTED',
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.applicationsService.getCandidateApplications(candidateId, {
      status,
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
  }

  /**
   * Get applications statistics
   * GET /api/applications/me/stats
   */
  @Get('me/stats')
  async getMyApplicationStats(@CurrentUser('id') candidateId: number) {
    return this.applicationsService.getCandidateApplicationStats(candidateId);
  }

  /**
   * Cancel application
   * DELETE /api/applications/:id
   */
  @Delete(':id')
  async cancelApplication(@Param('id', ParseIntPipe) id: number) {
    return this.applicationsService.cancelApplication(id);
  }
}
