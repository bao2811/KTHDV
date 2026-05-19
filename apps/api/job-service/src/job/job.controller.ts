import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JobService } from './job.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Jobs')
@Controller('jobs')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class JobController {
  constructor(private readonly jobService: JobService) {}

  // Companies
  @ApiOperation({ summary: 'Tạo công ty mới' })
  @Post('companies')
  createCompany(@Body() body: any) {
    return this.jobService.createCompany(body);
  }

  @ApiOperation({ summary: 'Danh sách công ty' })
  @Get('companies')
  listCompanies() {
    return this.jobService.listCompanies();
  }

  @Get('companies/:id')
  getCompany(@Param('id', ParseIntPipe) id: number) {
    return this.jobService.getCompany(id);
  }

  @Patch('companies/:id')
  updateCompany(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.jobService.updateCompany(id, body);
  }

  @Delete('companies/:id')
  deleteCompany(@Param('id', ParseIntPipe) id: number) {
    return this.jobService.deleteCompany(id);
  }

  // Locations
  @Post('locations')
  createLocation(@Body() body: any) {
    return this.jobService.createLocation(body);
  }

  @Get('locations')
  listLocations() {
    return this.jobService.listLocations();
  }

  @Get('locations/:id')
  getLocation(@Param('id', ParseIntPipe) id: number) {
    return this.jobService.getLocation(id);
  }

  @Patch('locations/:id')
  updateLocation(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.jobService.updateLocation(id, body);
  }

  @Delete('locations/:id')
  deleteLocation(@Param('id', ParseIntPipe) id: number) {
    return this.jobService.deleteLocation(id);
  }

  // Categories
  @Post('categories')
  createCategory(@Body() body: any) {
    return this.jobService.createCategory(body);
  }

  @Get('categories')
  listCategories() {
    return this.jobService.listCategories();
  }

  @Get('categories/:id')
  getCategory(@Param('id', ParseIntPipe) id: number) {
    return this.jobService.getCategory(id);
  }

  @Patch('categories/:id')
  updateCategory(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.jobService.updateCategory(id, body);
  }

  @Delete('categories/:id')
  deleteCategory(@Param('id', ParseIntPipe) id: number) {
    return this.jobService.deleteCategory(id);
  }

  // Skills
  @Post('skills')
  createSkill(@Body() body: any) {
    return this.jobService.createSkill(body);
  }

  @Get('skills')
  listSkills() {
    return this.jobService.listSkills();
  }

  @Get('skills/:id')
  getSkill(@Param('id', ParseIntPipe) id: number) {
    return this.jobService.getSkill(id);
  }

  @Patch('skills/:id')
  updateSkill(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.jobService.updateSkill(id, body);
  }

  @Delete('skills/:id')
  deleteSkill(@Param('id', ParseIntPipe) id: number) {
    return this.jobService.deleteSkill(id);
  }

  // Jobs
  @ApiOperation({ summary: 'Tạo tin tuyển dụng mới' })
  @Post('jobs')
  createJob(@Body() body: any) {
    return this.jobService.createJob(body);
  }

  @ApiOperation({ summary: 'Danh sách tin tuyển dụng (kèm bộ lọc)' })
  @Get('jobs')
  listJobs(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
    @Query('companyId') companyId?: string,
    @Query('categoryId') categoryId?: string,
    @Query('locationId') locationId?: string,
    @Query('search') search?: string,
    @Query('jobType') jobType?: 'FULL_TIME' | 'PART_TIME' | 'REMOTE',
    @Query('salaryMin') salaryMin?: string,
    @Query('salaryMax') salaryMax?: string,
  ) {
    return this.jobService.listJobs({
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
      status,
      companyId: companyId ? parseInt(companyId, 10) : undefined,
      categoryId: categoryId ? parseInt(categoryId, 10) : undefined,
      locationId: locationId ? parseInt(locationId, 10) : undefined,
      search,
      jobType,
      salaryMin: salaryMin ? parseFloat(salaryMin) : undefined,
      salaryMax: salaryMax ? parseFloat(salaryMax) : undefined,
    });
  }

  @Get('jobs/:id')
  getJob(@Param('id', ParseIntPipe) id: number) {
    return this.jobService.getJob(id);
  }

  @Patch('jobs/:id')
  updateJob(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.jobService.updateJob(id, body);
  }

  @Patch('jobs/:id/close')
  closeJob(@Param('id', ParseIntPipe) id: number) {
    return this.jobService.closeJob(id);
  }

  @Patch('jobs/:id/extend')
  extendJob(
    @Param('id', ParseIntPipe) id: number,
    @Body('expiredAt') expiredAt: string,
  ) {
    return this.jobService.extendJob(id, expiredAt);
  }

  @Delete('jobs/:id')
  deleteJob(@Param('id', ParseIntPipe) id: number) {
    return this.jobService.deleteJob(id);
  }

  @Post('jobs/:id/approvals')
  createApproval(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.jobService.createApproval(id, body);
  }

  @Get('jobs/:id/approvals')
  getApprovals(@Param('id', ParseIntPipe) id: number) {
    return this.jobService.getApprovals(id);
  }

  @Patch('jobs/:jobId/approvals/:approvalId')
  reviewApproval(
    @Param('jobId', ParseIntPipe) jobId: number,
    @Param('approvalId', ParseIntPipe) approvalId: number,
    @Body() body: any,
  ) {
    return this.jobService.reviewApproval(jobId, approvalId, body);
  }

  // Job Skills
  @Post('jobs/:jobId/skills')
  addJobSkill(@Param('jobId', ParseIntPipe) jobId: number, @Body() body: any) {
    return this.jobService.addJobSkill(jobId, body);
  }

  @Get('jobs/:jobId/skills')
  listJobSkills(@Param('jobId', ParseIntPipe) jobId: number) {
    return this.jobService.listJobSkills(jobId);
  }

  @Delete('jobs/:jobId/skills/:skillId')
  removeJobSkill(
    @Param('jobId', ParseIntPipe) jobId: number,
    @Param('skillId', ParseIntPipe) skillId: number,
  ) {
    return this.jobService.removeJobSkill(jobId, skillId);
  }

  // Hard Filters
  @Post('jobs/:jobId/hard-filters')
  addHardFilter(
    @Param('jobId', ParseIntPipe) jobId: number,
    @Body() body: any,
  ) {
    return this.jobService.addHardFilter(jobId, body);
  }

  @Get('jobs/:jobId/hard-filters')
  listHardFilters(@Param('jobId', ParseIntPipe) jobId: number) {
    return this.jobService.listHardFilters(jobId);
  }

  @Delete('hard-filters/:id')
  removeHardFilter(@Param('id', ParseIntPipe) id: number) {
    return this.jobService.removeHardFilter(id);
  }

  // Applications
  @Get('jobs/:jobId/applications')
  getJobApplications(
    @Param('jobId', ParseIntPipe) jobId: number,
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.jobService.getJobApplications(jobId, {
      status,
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
  }

  // Statistics
  @Get('jobs/:jobId/statistics')
  getJobStatistics(@Param('jobId', ParseIntPipe) jobId: number) {
    return this.jobService.getJobStatistics(jobId);
  }
}
