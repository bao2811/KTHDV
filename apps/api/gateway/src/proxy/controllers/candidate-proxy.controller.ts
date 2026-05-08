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
  UploadedFile,
  UseInterceptors,
  Request,
  Inject,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import FormData from 'form-data';
import type { IServiceProxy } from '../interfaces/service-proxy.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { SERVICE_PROXY } from '../proxy.constants';

const CANDIDATE_SERVICE_URL =
  process.env.CANDIDATE_SERVICE_URL || 'http://localhost:3001';

const getAuthConfig = (req: any) => ({
  headers: {
    Authorization: req.headers.authorization,
  },
});

@ApiTags('Candidates (via Proxy)')
@Controller('candidates')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CandidateProxyController {
  constructor(@Inject(SERVICE_PROXY) private proxy: IServiceProxy) {}

  // Profiles
  @Post('profiles')
  async createProfile(
    @Request() req: any,
    @Body() body: any,
    @CurrentUser('id') userId: number,
  ) {
    return this.proxy.post(
      `${CANDIDATE_SERVICE_URL}/candidates/profiles`,
      {
        ...body,
        userId,
      },
      getAuthConfig(req),
    );
  }

  @Get('profiles')
  async getProfiles(
    @Request() req: any,
    @Query('search') search?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const url = new URL(`${CANDIDATE_SERVICE_URL}/candidates/profiles`);
    if (search) url.searchParams.append('search', search);
    if (page) url.searchParams.append('page', page.toString());
    if (limit) url.searchParams.append('limit', limit.toString());
    return this.proxy.get(url.toString(), getAuthConfig(req));
  }

  @Get('profiles/user/:userId')
  async getProfileByUserId(
    @Request() req: any,
    @Param('userId') userId: number,
  ) {
    return this.proxy.get(
      `${CANDIDATE_SERVICE_URL}/candidates/profiles/user/${userId}`,
      getAuthConfig(req),
    );
  }

  @Get('profiles/:id')
  async getProfile(@Request() req: any, @Param('id') id: number) {
    return this.proxy.get(
      `${CANDIDATE_SERVICE_URL}/candidates/profiles/${id}`,
      getAuthConfig(req),
    );
  }

  @Patch('profiles/:userId')
  async updateProfile(
    @Request() req: any,
    @Param('userId') userId: number,
    @Body() body: any,
  ) {
    return this.proxy.patch(
      `${CANDIDATE_SERVICE_URL}/candidates/profiles/${userId}`,
      body,
      getAuthConfig(req),
    );
  }

  // Experiences
  @Post('profiles/:profileId/experiences')
  async createExperience(
    @Request() req: any,
    @Param('profileId') profileId: number,
    @Body() body: any,
  ) {
    return this.proxy.post(
      `${CANDIDATE_SERVICE_URL}/candidates/profiles/${profileId}/experiences`,
      body,
      getAuthConfig(req),
    );
  }

  @Get('profiles/:profileId/experiences')
  async getExperiences(
    @Request() req: any,
    @Param('profileId') profileId: number,
  ) {
    return this.proxy.get(
      `${CANDIDATE_SERVICE_URL}/candidates/profiles/${profileId}/experiences`,
      getAuthConfig(req),
    );
  }

  @Patch('experiences/:id')
  async updateExperience(
    @Request() req: any,
    @Param('id') id: number,
    @Body() body: any,
  ) {
    return this.proxy.patch(
      `${CANDIDATE_SERVICE_URL}/candidates/experiences/${id}`,
      body,
      getAuthConfig(req),
    );
  }

  @Delete('experiences/:id')
  async deleteExperience(@Request() req: any, @Param('id') id: number) {
    return this.proxy.delete(
      `${CANDIDATE_SERVICE_URL}/candidates/experiences/${id}`,
      getAuthConfig(req),
    );
  }

  // Educations
  @Post('profiles/:profileId/educations')
  async createEducation(
    @Request() req: any,
    @Param('profileId') profileId: number,
    @Body() body: any,
  ) {
    return this.proxy.post(
      `${CANDIDATE_SERVICE_URL}/candidates/profiles/${profileId}/educations`,
      body,
      getAuthConfig(req),
    );
  }

  @Get('profiles/:profileId/educations')
  async getEducations(
    @Request() req: any,
    @Param('profileId') profileId: number,
  ) {
    return this.proxy.get(
      `${CANDIDATE_SERVICE_URL}/candidates/profiles/${profileId}/educations`,
      getAuthConfig(req),
    );
  }

  @Patch('educations/:id')
  async updateEducation(
    @Request() req: any,
    @Param('id') id: number,
    @Body() body: any,
  ) {
    return this.proxy.patch(
      `${CANDIDATE_SERVICE_URL}/candidates/educations/${id}`,
      body,
      getAuthConfig(req),
    );
  }

  @Delete('educations/:id')
  async deleteEducation(@Request() req: any, @Param('id') id: number) {
    return this.proxy.delete(
      `${CANDIDATE_SERVICE_URL}/candidates/educations/${id}`,
      getAuthConfig(req),
    );
  }

  // Resumes (via file-upload service)
  @Post('resumes')
  @UseInterceptors(FileInterceptor('file'))
  async uploadCV(
    @Request() req: any,
    @UploadedFile() file: any,
    @CurrentUser('id') userId: number,
  ) {
    const originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');
    const formData = new FormData();
    formData.append('file', file.buffer, {
      filename: originalname,
      contentType: file.mimetype,
    });
    formData.append('userId', userId.toString());

    return this.proxy.post(
      `${CANDIDATE_SERVICE_URL}/upload/cv`,
      formData,
      {
        headers: {
          ...getAuthConfig(req).headers,
          ...formData.getHeaders(),
        },
      },
    );
  }

  @Get('resumes')
  async getMyCVs(@Request() req: any, @CurrentUser('id') userId: number) {
    return this.proxy.get(
      `${CANDIDATE_SERVICE_URL}/upload/my-cvs`,
      getAuthConfig(req),
    );
  }

  @Patch('resumes/:id/primary')
  async setPrimaryCV(@Request() req: any, @Param('id') id: number) {
    return this.proxy.patch(
      `${CANDIDATE_SERVICE_URL}/upload/cv/${id}/primary`,
      {},
      getAuthConfig(req),
    );
  }

  @Delete('resumes/:id')
  async deleteCV(@Request() req: any, @Param('id') id: number) {
    return this.proxy.get(
      `${CANDIDATE_SERVICE_URL}/upload/cv/${id}/delete`,
      getAuthConfig(req),
    );
  }

  @Get('resumes/:id/download')
  @ApiOperation({ summary: 'Tải/Xem CV (Trả về link MinIO presigned)' })
  async downloadCV(
    @Request() req: any,
    @Param('id') id: number,
    @Res() res: Response,
  ) {
    // We call the candidate service which now returns a JSON with { success: true, url: '...' }
    // but the original controller used res.redirect. 
    // Let's assume we want to proxy the JSON response or redirect directly.
    // To avoid CORS in Swagger, we'll return the JSON URL.
    const result = await this.proxy.get(
      `${CANDIDATE_SERVICE_URL}/upload/cv/${id}/download`,
      getAuthConfig(req),
    );
    
    // If it's a redirect from the candidate service, it might be tricky to proxy.
    // But I just changed candidate service to use JSON if I want, or I can just 
    // let it redirect and this proxy will handle it.
    // Wait, the http-proxy-service returns response.data.
    return res.json(result);
  }

  @Get('resumes/:id/view')
  @ApiOperation({ summary: 'Xem CV trực tiếp (Proxy stream qua Backend)' })
  async viewCV(
    @Request() req: any,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const response = await this.proxy.stream(
      `${CANDIDATE_SERVICE_URL}/upload/cv/${id}/view`,
      getAuthConfig(req),
    );

    // Forward headers safely
    const contentType = response.headers['content-type'] || 'application/pdf';
    const contentDisp = response.headers['content-disposition'] || 'inline';
    
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', contentDisp);

    // Pipe stream
    response.data.pipe(res);
  }

  // Applications
  @Post('applications')
  async applyForJob(
    @Request() req: any,
    @Body() body: any,
    @CurrentUser('id') candidateId: number,
  ) {
    return this.proxy.post(
      `${CANDIDATE_SERVICE_URL}/applications/apply`,
      {
        ...body,
        candidateId,
      },
      getAuthConfig(req),
    );
  }

  @Get('applications')
  async getMyApplications(
    @Request() req: any,
    @Query('status') status?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const url = new URL(`${CANDIDATE_SERVICE_URL}/applications/me`);
    if (status) url.searchParams.append('status', status);
    if (page) url.searchParams.append('page', page.toString());
    if (limit) url.searchParams.append('limit', limit.toString());
    return this.proxy.get(url.toString(), getAuthConfig(req));
  }

  @Get('applications/stats')
  async getApplicationStats(@Request() req: any) {
    return this.proxy.get(
      `${CANDIDATE_SERVICE_URL}/applications/me/stats`,
      getAuthConfig(req),
    );
  }

  @Get('applications/:id')
  async getApplication(@Request() req: any, @Param('id') id: number) {
    return this.proxy.get(
      `${CANDIDATE_SERVICE_URL}/applications/${id}`,
      getAuthConfig(req),
    );
  }

  @Delete('applications/:id')
  async cancelApplication(@Request() req: any, @Param('id') id: number) {
    return this.proxy.delete(
      `${CANDIDATE_SERVICE_URL}/applications/${id}`,
      getAuthConfig(req),
    );
  }
}
