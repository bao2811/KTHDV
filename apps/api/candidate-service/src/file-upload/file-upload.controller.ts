import {
  Controller,
  Post,
  Get,
  Param,
  UploadedFile,
  UseInterceptors,
  Res,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiConsumes, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import express from 'express';
import type { Express } from 'express';
import { FileUploadService } from './file-upload.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('File Upload')
@Controller('upload')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FileUploadController {
  constructor(
    private readonly fileUploadService: FileUploadService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Upload CV for candidate
   * POST /api/upload/cv
   *
   * Form data:
   * - file: CV file (PDF or DOCX, max 10MB)
   */
  @Post('cv')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadCV(@UploadedFile() file: any, @CurrentUser('id') userId: number) {
    // Upload to object storage
    const { fileUrl, fileName, fileType } =
      await this.fileUploadService.uploadCV(file, userId);

    // Save to database
    const resume = await this.prisma.resume.create({
      data: {
        userId,
        fileUrl,
        fileName,
        fileType,
      },
    });

    return {
      success: true,
      resume,
      message: 'Upload CV thành công',
    };
  }

  @Post('avatar')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  async uploadAvatar(
    @UploadedFile() file: any,
    @CurrentUser('id') userId: number,
  ) {
    // Upload avatar to object storage
    const { fileUrl } = await this.fileUploadService.uploadAvatar(file, userId);

    // Get presigned URL for immediate display
    const displayUrl = await this.fileUploadService.getDownloadUrl(fileUrl);

    // Update or Create Profile table (Upsert)
    await this.prisma.profile.upsert({
      where: { userId },
      update: { avatarUrl: displayUrl }, // We store the display URL or object path? 
      // Let's store the object path for consistency, but return the display URL
      create: { 
        userId, 
        fullName: 'User',
        avatarUrl: displayUrl
      },
    });

    return {
      success: true,
      avatarUrl: displayUrl,
      message: 'Cập nhật ảnh đại diện thành công',
    };
  }

  @Post('company-logo')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  async uploadCompanyLogo(
    @UploadedFile() file: any,
    @CurrentUser('id') userId: number,
  ) {
    const { fileUrl } = await this.fileUploadService.uploadCompanyLogo(file, userId);
    const logoUrl = await this.fileUploadService.getDownloadUrl(fileUrl);

    return {
      success: true,
      fileUrl,
      logoUrl,
      message: 'Upload logo công ty thành công',
    };
  }

  /**
   * Get candidate's CVs
   * GET /api/upload/my-cvs
   */
  @Get('my-cvs')
  async getMyCVs(@CurrentUser('id') userId: number) {
    const resumes = await this.prisma.resume.findMany({
      where: { userId },
      orderBy: { uploadedAt: 'desc' },
    });

    return {
      total: resumes.length,
      resumes,
    };
  }

  /**
   * Set primary CV
   * POST /api/upload/cv/:id/primary
   */
  @Post('cv/:id/primary')
  async setPrimaryCV(
    @Param('id') resumeId: string,
    @CurrentUser('id') userId: number,
  ) {
    const resume = await this.prisma.resume.findUnique({
      where: { id: parseInt(resumeId, 10) },
    });

    if (!resume || resume.userId !== userId) {
      return { success: false, message: 'CV không hợp lệ' };
    }

    // Update all to false, then set this one to true
    await this.prisma.$transaction([
      this.prisma.resume.updateMany({
        where: { userId },
        data: { isPrimary: false },
      }),
      this.prisma.resume.update({
        where: { id: parseInt(resumeId, 10) },
        data: { isPrimary: true },
      }),
    ]);

    return {
      success: true,
      message: 'Đặt CV làm mặc định thành công',
    };
  }

  /**
   * Delete CV
   * GET /api/upload/cv/:id/delete
   */
  @Get('cv/:id/delete')
  async deleteCV(
    @Param('id') resumeId: string,
    @CurrentUser('id') userId: number,
  ) {
    const resume = await this.prisma.resume.findUnique({
      where: { id: parseInt(resumeId, 10) },
    });

    if (!resume || resume.userId !== userId) {
      return { success: false, message: 'CV không hợp lệ' };
    }

    // Don't allow deleting if it's the primary CV and there's only one
    const allResumes = await this.prisma.resume.findMany({
      where: { userId },
    });

    if (resume.isPrimary && allResumes.length === 1) {
      return {
        success: false,
        message: 'Không thể xóa CV duy nhất của bạn',
      };
    }

    // Delete from object storage using the full object path.
    await this.fileUploadService.deleteFile(resume.fileUrl);

    // Delete from database
    await this.prisma.resume.delete({
      where: { id: parseInt(resumeId, 10) },
    });

    return {
      success: true,
      message: 'Xóa CV thành công',
    };
  }

  /**
   * Download CV (requires proper MinIO setup)
   * GET /api/upload/cv/:id/download
   */
  @Get('cv/:id/download')
  async downloadCV(
    @Param('id') resumeId: string,
    @CurrentUser('id') userId: number,
    @Res() res: express.Response,
  ) {
    const resume = await this.prisma.resume.findUnique({
      where: { id: parseInt(resumeId, 10) },
    });

    if (!resume || resume.userId !== userId) {
      return res.status(403).json({ message: 'Không có quyền' });
    }

    // Return JSON with URL instead of redirecting
    const downloadUrl = await this.fileUploadService.getDownloadUrl(
      resume.fileUrl,
    );
    return res.json({ success: true, url: downloadUrl });
  }

  /**
   * View CV (Streaming proxy)
   * GET /api/upload/cv/:id/view
   */
  @Get('cv/:id/view')
  async viewCV(
    @Param('id') resumeId: string,
    @CurrentUser('id') userId: number,
    @Res() res: express.Response,
  ) {
    try {
      const { stream, fileName, contentType } = 
        await this.fileUploadService.getFileStream(parseInt(resumeId, 10));

      // Set headers for inline display (with UTF-8 support for Vietnamese filenames)
      const encodedFileName = encodeURIComponent(fileName);
      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `inline; filename="${encodedFileName}"; filename*=UTF-8''${encodedFileName}`);

      // Pipe object storage stream to express response
      stream.pipe(res);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res.status(404).json({ message: error.message });
      }
      console.error('View CV error:', error);
      return res.status(500).json({ message: 'Lỗi khi hiển thị CV' });
    }
  }

  /**
   * Download CV by file path (with full object path)
   * GET /api/upload/cv/:id/*filePath
   */
  @Get('cv/:id/*filePath')
  async downloadCVByPath(
    @Param('id') resumeId: string,
    @Param('filePath') filePath: string,
    @CurrentUser('id') userId: number,
    @Res() res: express.Response,
  ) {
    const resume = await this.prisma.resume.findUnique({
      where: { id: parseInt(resumeId, 10) },
    });

    if (!resume || resume.userId !== userId) {
      return res.status(403).json({ message: 'Không có quyền' });
    }

    // Extract filename from the full path
    const fileName = filePath.split('/').pop() || '';
    if (!fileName) {
      return res.status(400).json({ message: 'File name không hợp lệ' });
    }

    // Return JSON with URL instead of redirecting
    const downloadUrl = await this.fileUploadService.getDownloadUrl(fileName);
    return res.json({ success: true, url: downloadUrl });
  }
}
