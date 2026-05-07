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
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CandidateService } from './candidate.service';

@ApiTags('Candidates')
@Controller('candidates')
@ApiBearerAuth()
export class CandidateController {
  constructor(private readonly candidateService: CandidateService) {}

  // Profiles
  @ApiOperation({ summary: 'Tạo hồ sơ ứng viên' })
  @Post('profiles')
  createProfile(@Body() body: any) {
    return this.candidateService.createProfile(body);
  }

  @ApiOperation({ summary: 'Danh sách hồ sơ ứng viên' })
  @Get('profiles')
  listProfiles(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    return this.candidateService.listProfiles({
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
      search,
    });
  }

  @Get('profiles/user/:userId')
  getProfileByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return this.candidateService.getProfileByUserId(userId);
  }

  @Get('profiles/:id')
  getProfileById(@Param('id', ParseIntPipe) id: number) {
    return this.candidateService.getProfileById(id);
  }

  @Patch('profiles/:userId')
  updateProfile(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() body: any,
  ) {
    return this.candidateService.updateProfile(userId, body);
  }

  // Experiences
  @Post('profiles/:profileId/experiences')
  createExperience(
    @Param('profileId', ParseIntPipe) profileId: number,
    @Body() body: any,
  ) {
    return this.candidateService.createExperience(profileId, body);
  }

  @Get('profiles/:profileId/experiences')
  listExperiences(@Param('profileId', ParseIntPipe) profileId: number) {
    return this.candidateService.listExperiences(profileId);
  }

  @Patch('experiences/:id')
  updateExperience(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.candidateService.updateExperience(id, body);
  }

  @Delete('experiences/:id')
  deleteExperience(@Param('id', ParseIntPipe) id: number) {
    return this.candidateService.deleteExperience(id);
  }

  // Educations
  @Post('profiles/:profileId/educations')
  createEducation(
    @Param('profileId', ParseIntPipe) profileId: number,
    @Body() body: any,
  ) {
    return this.candidateService.createEducation(profileId, body);
  }

  @Get('profiles/:profileId/educations')
  listEducations(@Param('profileId', ParseIntPipe) profileId: number) {
    return this.candidateService.listEducations(profileId);
  }

  @Patch('educations/:id')
  updateEducation(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.candidateService.updateEducation(id, body);
  }

  @Delete('educations/:id')
  deleteEducation(@Param('id', ParseIntPipe) id: number) {
    return this.candidateService.deleteEducation(id);
  }

  // Resumes
  @Post('resumes')
  createResume(@Body() body: any) {
    return this.candidateService.createResume(body);
  }

  @Get('resumes')
  listResumes(@Query('userId') userId?: string) {
    return this.candidateService.listResumes(
      userId ? parseInt(userId, 10) : undefined,
    );
  }

  @Patch('resumes/:id/primary')
  setPrimaryResume(
    @Param('id', ParseIntPipe) id: number,
    @Body('userId', ParseIntPipe) userId: number,
  ) {
    return this.candidateService.setPrimaryResume(id, userId);
  }

  @Delete('resumes/:id')
  deleteResume(@Param('id', ParseIntPipe) id: number) {
    return this.candidateService.deleteResume(id);
  }

  // Applications
  @ApiOperation({ summary: 'Nộp đơn ứng tuyển' })
  @Post('applications')
  createApplication(@Body() body: any) {
    return this.candidateService.createApplication(body);
  }

  @Get('applications')
  listApplications(
    @Query('candidateId') candidateId?: string,
    @Query('jobId') jobId?: string,
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.candidateService.listApplications({
      candidateId: candidateId ? parseInt(candidateId, 10) : undefined,
      jobId: jobId ? parseInt(jobId, 10) : undefined,
      status,
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
  }

  @Get('applications/:id')
  getApplication(@Param('id', ParseIntPipe) id: number) {
    return this.candidateService.getApplication(id);
  }

  @Patch('applications/:id/status')
  updateApplicationStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: any,
  ) {
    return this.candidateService.updateApplicationStatus(id, status);
  }
}
