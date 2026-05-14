import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JobService } from './job.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { CreateCompanyDto } from './dto/create-company.dto';
import { CreateLocationDto } from './dto/create-location.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateSkillDto } from './dto/create-skill.dto';
import { JobQueryDto } from './dto/job-query.dto';
import { CreateApprovalDto, RequestApprovalDto } from './dto/approval.dto';
import { AddJobSkillDto } from './dto/add-job-skill.dto';
import { CreateHardFilterDto } from './dto/create-hard-filter.dto';
import { ExtendJobDto } from './dto/extend-job.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ApplicationStatus } from '@prisma/client';

@ApiTags('Jobs')
@Controller('jobs')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class JobController {
  constructor(private readonly jobService: JobService) {}

  // Companies
  @ApiOperation({ summary: 'Tạo công ty mới' })
  @Post('companies')
  @Roles('HR', 'Admin')
  createCompany(@Body() body: CreateCompanyDto) {
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

  @Put('companies/:id')
  @Roles('HR', 'Admin')
  updateCompany(@Param('id', ParseIntPipe) id: number, @Body() body: Partial<CreateCompanyDto>) {
    return this.jobService.updateCompany(id, body);
  }

  @Delete('companies/:id')
  @Roles('Admin')
  deleteCompany(@Param('id', ParseIntPipe) id: number) {
    return this.jobService.deleteCompany(id);
  }

  // Locations
  @Post('locations')
  @Roles('HR', 'Admin')
  createLocation(@Body() body: CreateLocationDto) {
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

  @Put('locations/:id')
  @Roles('HR', 'Admin')
  updateLocation(@Param('id', ParseIntPipe) id: number, @Body() body: Partial<CreateLocationDto>) {
    return this.jobService.updateLocation(id, body);
  }

  @Delete('locations/:id')
  @Roles('Admin')
  deleteLocation(@Param('id', ParseIntPipe) id: number) {
    return this.jobService.deleteLocation(id);
  }

  // Categories
  @Post('categories')
  @Roles('HR', 'Admin')
  createCategory(@Body() body: CreateCategoryDto) {
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

  @Put('categories/:id')
  @Roles('HR', 'Admin')
  updateCategory(@Param('id', ParseIntPipe) id: number, @Body() body: Partial<CreateCategoryDto>) {
    return this.jobService.updateCategory(id, body);
  }

  @Delete('categories/:id')
  @Roles('Admin')
  deleteCategory(@Param('id', ParseIntPipe) id: number) {
    return this.jobService.deleteCategory(id);
  }

  // Skills
  @Post('skills')
  @Roles('HR', 'Admin')
  createSkill(@Body() body: CreateSkillDto) {
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

  @Put('skills/:id')
  @Roles('HR', 'Admin')
  updateSkill(@Param('id', ParseIntPipe) id: number, @Body() body: Partial<CreateSkillDto>) {
    return this.jobService.updateSkill(id, body);
  }

  @Delete('skills/:id')
  @Roles('Admin')
  deleteSkill(@Param('id', ParseIntPipe) id: number) {
    return this.jobService.deleteSkill(id);
  }

  // Approvals (Special routes - MUST be above :id)
  @ApiOperation({ summary: 'Lấy danh sách tất cả yêu cầu duyệt đang chờ' })
  @Get('approvals')
  @Roles('Manager', 'Admin')
  getPendingApprovals() {
    return this.jobService.getAllApprovals();
  }

  // Jobs
  @ApiOperation({ summary: 'Tạo tin tuyển dụng mới' })
  @Post()
  @Roles('HR', 'Admin')
  createJob(@Body() body: CreateJobDto, @CurrentUser('id') userId: number) {
    return this.jobService.createJob({ ...body, createdByUserId: userId });
  }

  @ApiOperation({ summary: 'Danh sách tin tuyển dụng (kèm bộ lọc)' })
  @Get()
  listJobs(@Query() query: JobQueryDto) {
    return this.jobService.listJobs(query);
  }

  @Get(':id')
  getJob(@Param('id', ParseIntPipe) id: number) {
    return this.jobService.getJob(id);
  }

  @Patch(':id')
  @Roles('HR', 'Admin')
  updateJob(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateJobDto) {
    return this.jobService.updateJob(id, body);
  }

  @Delete(':id')
  @Roles('HR', 'Admin')
  deleteJob(@Param('id', ParseIntPipe) id: number) {
    return this.jobService.deleteJob(id);
  }

  @ApiOperation({ summary: 'Đóng tin tuyển dụng' })
  @Patch(':id/close')
  @Roles('HR', 'Admin')
  closeJob(@Param('id', ParseIntPipe) id: number) {
    return this.jobService.closeJob(id);
  }

  @ApiOperation({ summary: 'Gia hạn tin tuyển dụng' })
  @Patch(':id/extend')
  @Roles('HR', 'Admin')
  extendJob(@Param('id', ParseIntPipe) id: number, @Body() body: ExtendJobDto) {
    return this.jobService.extendJob(id, body.expiredAt);
  }

  @ApiOperation({ summary: 'Gửi yêu cầu duyệt tin' })
  @Post(':id/approvals')
  @Roles('HR', 'Admin')
  requestApproval(@Param('id', ParseIntPipe) id: number, @Body() body: RequestApprovalDto) {
    return this.jobService.requestApproval(id, body.reviewerId);
  }

  @ApiOperation({ summary: 'Duyệt hoặc từ chối tin' })
  @Patch(':id/approvals/:approvalId')
  @Roles('Manager', 'Admin')
  approveJob(
    @Param('id', ParseIntPipe) id: number,
    @Param('approvalId', ParseIntPipe) approvalId: number,
    @Body() body: CreateApprovalDto,
  ) {
    return this.jobService.updateApproval(id, approvalId, body);
  }

  @Get(':id/approvals')
  @Roles('HR', 'Manager', 'Admin')
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
  @Post(':jobId/skills')
  @Roles('HR', 'Admin')
  addJobSkill(@Param('jobId', ParseIntPipe) jobId: number, @Body() body: AddJobSkillDto) {
    return this.jobService.addJobSkill(jobId, body);
  }

  @Get(':jobId/skills')
  listJobSkills(@Param('jobId', ParseIntPipe) jobId: number) {
    return this.jobService.listJobSkills(jobId);
  }

  @Delete(':jobId/skills/:skillId')
  @Roles('HR', 'Admin')
  removeJobSkill(
    @Param('jobId', ParseIntPipe) jobId: number,
    @Param('skillId', ParseIntPipe) skillId: number,
  ) {
    return this.jobService.removeJobSkill(jobId, skillId);
  }

  // Hard Filters
  @ApiOperation({ summary: 'Thêm bộ lọc cứng' })
  @Post(':jobId/hard-filters')
  @Roles('HR', 'Admin')
  addHardFilter(
    @Param('jobId', ParseIntPipe) jobId: number,
    @Body() body: CreateHardFilterDto,
  ) {
    return this.jobService.addHardFilter(jobId, body);
  }

  @Get(':jobId/hard-filters')
  listHardFilters(@Param('jobId', ParseIntPipe) jobId: number) {
    return this.jobService.listHardFilters(jobId);
  }

  @Delete('hard-filters/:id')
  @Roles('HR', 'Admin')
  removeHardFilter(@Param('id', ParseIntPipe) id: number) {
    return this.jobService.removeHardFilter(id);
  }

  // Applications
  @Get(':jobId/applications')
  @Roles('HR', 'Admin', 'Manager')
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

  @Patch('applications/:applicationId/status')
  @Roles('HR', 'Admin', 'Manager')
  @ApiOperation({ summary: 'Cập nhật trạng thái ứng tuyển' })
  updateApplicationStatus(
    @Param('applicationId', ParseIntPipe) applicationId: number,
    @Body('status') status: ApplicationStatus,
    @CurrentUser('id') userId: number,
  ) {
    return this.jobService.updateApplicationStatus(applicationId, status, userId);
  }

  // Statistics
  @Get(':jobId/statistics')
  @Roles('HR', 'Admin', 'Manager')
  getJobStatistics(@Param('jobId', ParseIntPipe) jobId: number) {
    return this.jobService.getJobStatistics(jobId);
  }
}

