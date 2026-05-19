import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  Inject,
  Request,
} from '@nestjs/common';
import type { IServiceProxy } from '../interfaces/service-proxy.interface';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { SERVICE_PROXY } from '../proxy.constants';

import { Public } from '../../auth/decorators/public.decorator';

const JOB_SERVICE_URL = process.env.JOB_SERVICE_URL || 'http://localhost:3002';

const getAuthConfig = (req: any) => ({
  headers: {
    Authorization: req.headers.authorization,
  },
});

@ApiTags('Jobs (via Proxy)')
@Controller('jobs')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class JobProxyController {
  constructor(@Inject(SERVICE_PROXY) private proxy: IServiceProxy) {}

  // Companies
  @Post('companies')
  async createCompany(@Request() req: any, @Body() body: any) {
    return this.proxy.post(
      `${JOB_SERVICE_URL}/jobs/companies`,
      body,
      getAuthConfig(req),
    );
  }

  @Public()
  @Get('companies')
  async getCompanies(
    @Request() req: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const url = new URL(`${JOB_SERVICE_URL}/jobs/companies`);
    if (page) url.searchParams.append('page', page.toString());
    if (limit) url.searchParams.append('limit', limit.toString());
    return this.proxy.get(url.toString(), getAuthConfig(req));
  }

  @Public()
  @Get('companies/:id')
  async getCompany(@Request() req: any, @Param('id') id: number) {
    return this.proxy.get(
      `${JOB_SERVICE_URL}/jobs/companies/${id}`,
      getAuthConfig(req),
    );
  }

  @Patch('companies/:id')
  async updateCompany(
    @Request() req: any,
    @Param('id') id: number,
    @Body() body: any,
  ) {
    return this.proxy.patch(
      `${JOB_SERVICE_URL}/jobs/companies/${id}`,
      body,
      getAuthConfig(req),
    );
  }

  @Delete('companies/:id')
  async deleteCompany(@Request() req: any, @Param('id') id: number) {
    return this.proxy.delete(
      `${JOB_SERVICE_URL}/jobs/companies/${id}`,
      getAuthConfig(req),
    );
  }

  // Locations
  @Post('locations')
  async createLocation(@Request() req: any, @Body() body: any) {
    return this.proxy.post(
      `${JOB_SERVICE_URL}/jobs/locations`,
      body,
      getAuthConfig(req),
    );
  }

  @Public()
  @Get('locations')
  async getLocations(@Request() req: any) {
    return this.proxy.get(
      `${JOB_SERVICE_URL}/jobs/locations`,
      getAuthConfig(req),
    );
  }

  @Public()
  @Get('locations/:id')
  async getLocation(@Request() req: any, @Param('id') id: number) {
    return this.proxy.get(
      `${JOB_SERVICE_URL}/jobs/locations/${id}`,
      getAuthConfig(req),
    );
  }

  @Patch('locations/:id')
  async updateLocation(
    @Request() req: any,
    @Param('id') id: number,
    @Body() body: any,
  ) {
    return this.proxy.patch(
      `${JOB_SERVICE_URL}/jobs/locations/${id}`,
      body,
      getAuthConfig(req),
    );
  }

  @Delete('locations/:id')
  async deleteLocation(@Request() req: any, @Param('id') id: number) {
    return this.proxy.delete(
      `${JOB_SERVICE_URL}/jobs/locations/${id}`,
      getAuthConfig(req),
    );
  }

  // Categories
  @Post('categories')
  async createCategory(@Request() req: any, @Body() body: any) {
    return this.proxy.post(
      `${JOB_SERVICE_URL}/jobs/categories`,
      body,
      getAuthConfig(req),
    );
  }

  @Public()
  @Get('categories')
  async getCategories(@Request() req: any) {
    return this.proxy.get(
      `${JOB_SERVICE_URL}/jobs/categories`,
      getAuthConfig(req),
    );
  }

  @Public()
  @Get('categories/:id')
  async getCategory(@Request() req: any, @Param('id') id: number) {
    return this.proxy.get(
      `${JOB_SERVICE_URL}/jobs/categories/${id}`,
      getAuthConfig(req),
    );
  }

  @Patch('categories/:id')
  async updateCategory(
    @Request() req: any,
    @Param('id') id: number,
    @Body() body: any,
  ) {
    return this.proxy.patch(
      `${JOB_SERVICE_URL}/jobs/categories/${id}`,
      body,
      getAuthConfig(req),
    );
  }

  @Delete('categories/:id')
  async deleteCategory(@Request() req: any, @Param('id') id: number) {
    return this.proxy.delete(
      `${JOB_SERVICE_URL}/jobs/categories/${id}`,
      getAuthConfig(req),
    );
  }

  // Skills
  @Post('skills')
  async createSkill(@Request() req: any, @Body() body: any) {
    return this.proxy.post(
      `${JOB_SERVICE_URL}/jobs/skills`,
      body,
      getAuthConfig(req),
    );
  }

  @Public()
  @Get('skills')
  async getSkills(@Request() req: any) {
    return this.proxy.get(`${JOB_SERVICE_URL}/jobs/skills`, getAuthConfig(req));
  }

  @Get('skills/:id')
  async getSkill(@Request() req: any, @Param('id') id: number) {
    return this.proxy.get(
      `${JOB_SERVICE_URL}/jobs/skills/${id}`,
      getAuthConfig(req),
    );
  }

  @Patch('skills/:id')
  async updateSkill(
    @Request() req: any,
    @Param('id') id: number,
    @Body() body: any,
  ) {
    return this.proxy.patch(
      `${JOB_SERVICE_URL}/jobs/skills/${id}`,
      body,
      getAuthConfig(req),
    );
  }

  @Delete('skills/:id')
  async deleteSkill(@Request() req: any, @Param('id') id: number) {
    return this.proxy.delete(
      `${JOB_SERVICE_URL}/jobs/skills/${id}`,
      getAuthConfig(req),
    );
  }

  // Job Postings
  @Post('postings')
  async createJob(@Request() req: any, @Body() body: any) {
    return this.proxy.post(
      `${JOB_SERVICE_URL}/jobs`,
      body,
      getAuthConfig(req),
    );
  }

  @Public()
  @Get('postings')
  async getJobs(
    @Request() req: any,
    @Query() query: Record<string, string | number | undefined>,
  ) {
    const url = new URL(`${JOB_SERVICE_URL}/jobs`);
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.append(key, value.toString());
      }
    });
    return this.proxy.get(url.toString(), getAuthConfig(req));
  }

  @Public()
  @Get('postings/:id')
  async getJob(@Request() req: any, @Param('id') id: number) {
    return this.proxy.get(
      `${JOB_SERVICE_URL}/jobs/${id}`,
      getAuthConfig(req),
    );
  }

  @Patch('postings/:id')
  async updateJob(
    @Request() req: any,
    @Param('id') id: number,
    @Body() body: any,
  ) {
    return this.proxy.patch(
      `${JOB_SERVICE_URL}/jobs/${id}`,
      body,
      getAuthConfig(req),
    );
  }

  @Delete('postings/:id')
  async deleteJob(@Request() req: any, @Param('id') id: number) {
    return this.proxy.delete(
      `${JOB_SERVICE_URL}/jobs/${id}`,
      getAuthConfig(req),
    );
  }

  @Patch('postings/:id/close')
  async closeJob(@Request() req: any, @Param('id') id: number) {
    return this.proxy.patch(
      `${JOB_SERVICE_URL}/jobs/${id}/close`,
      {},
      getAuthConfig(req),
    );
  }

  @Patch('postings/:id/extend')
  async extendJob(@Request() req: any, @Param('id') id: number, @Body() body: any) {
    return this.proxy.patch(
      `${JOB_SERVICE_URL}/jobs/${id}/extend`,
      body,
      getAuthConfig(req),
    );
  }

  @Post('postings/:id/approvals')
  async requestApproval(@Request() req: any, @Param('id') id: number, @Body() body: any) {
    return this.proxy.post(
      `${JOB_SERVICE_URL}/jobs/${id}/approvals`,
      body,
      getAuthConfig(req),
    );
  }

  @Patch('postings/:id/approvals/:approvalId')
  async approveJob(
    @Request() req: any,
    @Param('id') id: number,
    @Param('approvalId') approvalId: number,
    @Body() body: any,
  ) {
    return this.proxy.patch(
      `${JOB_SERVICE_URL}/jobs/${id}/approvals/${approvalId}`,
      body,
      getAuthConfig(req),
    );
  }

  @Get('postings/:id/approvals')
  async getApprovals(@Request() req: any, @Param('id') id: number) {
    return this.proxy.get(
      `${JOB_SERVICE_URL}/jobs/${id}/approvals`,
      getAuthConfig(req),
    );
  }

  @Get('approvals')
  async getPendingApprovals(@Request() req: any) {
    return this.proxy.get(
      `${JOB_SERVICE_URL}/jobs/approvals`,
      getAuthConfig(req),
    );
  }

  // Pipeline Stages
  @Get('pipeline-stages')
  async getPipelineStages(@Request() req: any) {
    return this.proxy.get(
      `${JOB_SERVICE_URL}/pipeline-stages`,
      getAuthConfig(req),
    );
  }

  @Post('pipeline-stages')
  async createPipelineStage(@Request() req: any, @Body() body: any) {
    return this.proxy.post(
      `${JOB_SERVICE_URL}/pipeline-stages`,
      body,
      getAuthConfig(req),
    );
  }

  @Patch('pipeline-stages/:id')
  async updatePipelineStage(
    @Request() req: any,
    @Param('id') id: number,
    @Body() body: any,
  ) {
    return this.proxy.patch(
      `${JOB_SERVICE_URL}/pipeline-stages/${id}`,
      body,
      getAuthConfig(req),
    );
  }

  @Delete('pipeline-stages/:id')
  async deletePipelineStage(@Request() req: any, @Param('id') id: number) {
    return this.proxy.delete(
      `${JOB_SERVICE_URL}/pipeline-stages/${id}`,
      getAuthConfig(req),
    );
  }

  // Job Skills
  @Post('postings/:jobId/skills')
  async addJobSkill(
    @Request() req: any,
    @Param('jobId') jobId: number,
    @Body() body: any,
  ) {
    return this.proxy.post(
      `${JOB_SERVICE_URL}/jobs/${jobId}/skills`,
      body,
      getAuthConfig(req),
    );
  }

  @Get('postings/:jobId/skills')
  async getJobSkills(@Request() req: any, @Param('jobId') jobId: number) {
    return this.proxy.get(
      `${JOB_SERVICE_URL}/jobs/${jobId}/skills`,
      getAuthConfig(req),
    );
  }

  @Delete('postings/:jobId/skills/:skillId')
  async removeJobSkill(
    @Request() req: any,
    @Param('jobId') jobId: number,
    @Param('skillId') skillId: number,
  ) {
    return this.proxy.delete(
      `${JOB_SERVICE_URL}/jobs/${jobId}/skills/${skillId}`,
      getAuthConfig(req),
    );
  }

  // Job Applications (statistics)
  @Get('postings/:jobId/applications')
  async getJobApplications(
    @Request() req: any,
    @Param('jobId') jobId: number,
    @Query('status') status?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const url = new URL(`${JOB_SERVICE_URL}/jobs/${jobId}/applications`);
    if (status) url.searchParams.append('status', status);
    if (page) url.searchParams.append('page', page.toString());
    if (limit) url.searchParams.append('limit', limit.toString());
    return this.proxy.get(url.toString(), getAuthConfig(req));
  }

  @Get('postings/:jobId/statistics')
  async getJobStatistics(@Request() req: any, @Param('jobId') jobId: number) {
    return this.proxy.get(
      `${JOB_SERVICE_URL}/jobs/${jobId}/statistics`,
      getAuthConfig(req),
    );
  }

  @Patch('applications/:id/status')
  async updateApplicationStatus(
    @Request() req: any,
    @Param('id') id: number,
    @Body('status') status: string,
  ) {
    return this.proxy.patch(
      `${JOB_SERVICE_URL}/jobs/applications/${id}/status`,
      { status },
      getAuthConfig(req),
    );
  }

  // Hard Filters
  @Post('postings/:jobId/hard-filters')
  async addHardFilter(
    @Request() req: any,
    @Param('jobId') jobId: number,
    @Body() body: any,
  ) {
    return this.proxy.post(
      `${JOB_SERVICE_URL}/jobs/${jobId}/hard-filters`,
      body,
      getAuthConfig(req),
    );
  }

  @Get('postings/:jobId/hard-filters')
  async listHardFilters(@Request() req: any, @Param('jobId') jobId: number) {
    return this.proxy.get(
      `${JOB_SERVICE_URL}/jobs/${jobId}/hard-filters`,
      getAuthConfig(req),
    );
  }

  @Delete('hard-filters/:id')
  async removeHardFilter(@Request() req: any, @Param('id') id: number) {
    return this.proxy.delete(
      `${JOB_SERVICE_URL}/jobs/hard-filters/${id}`,
      getAuthConfig(req),
    );
  }
}
