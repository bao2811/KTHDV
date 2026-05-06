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
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { SERVICE_PROXY } from '../proxy.constants';

const JOB_SERVICE_URL = process.env.JOB_SERVICE_URL || 'http://localhost:3005';

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

  @Get('locations')
  async getLocations(@Request() req: any) {
    return this.proxy.get(
      `${JOB_SERVICE_URL}/jobs/locations`,
      getAuthConfig(req),
    );
  }

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

  @Get('categories')
  async getCategories(@Request() req: any) {
    return this.proxy.get(
      `${JOB_SERVICE_URL}/jobs/categories`,
      getAuthConfig(req),
    );
  }

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
      `${JOB_SERVICE_URL}/jobs/jobs`,
      body,
      getAuthConfig(req),
    );
  }

  @Get('postings')
  async getJobs(
    @Request() req: any,
    @Query('status') status?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const url = new URL(`${JOB_SERVICE_URL}/jobs/jobs`);
    if (status) url.searchParams.append('status', status);
    if (page) url.searchParams.append('page', page.toString());
    if (limit) url.searchParams.append('limit', limit.toString());
    return this.proxy.get(url.toString(), getAuthConfig(req));
  }

  @Get('postings/:id')
  async getJob(@Request() req: any, @Param('id') id: number) {
    return this.proxy.get(
      `${JOB_SERVICE_URL}/jobs/jobs/${id}`,
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
      `${JOB_SERVICE_URL}/jobs/jobs/${id}`,
      body,
      getAuthConfig(req),
    );
  }

  @Delete('postings/:id')
  async deleteJob(@Request() req: any, @Param('id') id: number) {
    return this.proxy.delete(
      `${JOB_SERVICE_URL}/jobs/jobs/${id}`,
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
      `${JOB_SERVICE_URL}/jobs/jobs/${jobId}/skills`,
      body,
      getAuthConfig(req),
    );
  }

  @Get('postings/:jobId/skills')
  async getJobSkills(@Request() req: any, @Param('jobId') jobId: number) {
    return this.proxy.get(
      `${JOB_SERVICE_URL}/jobs/jobs/${jobId}/skills`,
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
      `${JOB_SERVICE_URL}/jobs/jobs/${jobId}/skills/${skillId}`,
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
    const url = new URL(`${JOB_SERVICE_URL}/jobs/jobs/${jobId}/applications`);
    if (status) url.searchParams.append('status', status);
    if (page) url.searchParams.append('page', page.toString());
    if (limit) url.searchParams.append('limit', limit.toString());
    return this.proxy.get(url.toString(), getAuthConfig(req));
  }

  @Get('postings/:jobId/statistics')
  async getJobStatistics(@Request() req: any, @Param('jobId') jobId: number) {
    return this.proxy.get(
      `${JOB_SERVICE_URL}/jobs/jobs/${jobId}/statistics`,
      getAuthConfig(req),
    );
  }
}
