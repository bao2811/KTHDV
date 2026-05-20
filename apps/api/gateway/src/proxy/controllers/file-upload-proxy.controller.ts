import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  UploadedFile,
  UseInterceptors,
  Request,
  Inject,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { SERVICE_PROXY } from '../proxy.constants';
import type { IServiceProxy } from '../interfaces/service-proxy.interface';
import FormData from 'form-data';

const CANDIDATE_SERVICE_URL =
  process.env.CANDIDATE_SERVICE_URL || 'http://localhost:3001';

const getAuthConfig = (req: any) => ({
  headers: {
    Authorization: req.headers.authorization,
  },
});

@ApiTags('File Upload (via Proxy)')
@Controller('upload')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FileUploadProxyController {
  constructor(@Inject(SERVICE_PROXY) private proxy: IServiceProxy) {}

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
  
  @Post('avatar')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  async uploadAvatar(
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
      `${CANDIDATE_SERVICE_URL}/upload/avatar`,
      formData,
      {
        headers: {
          ...getAuthConfig(req).headers,
          ...formData.getHeaders(),
        },
      },
    );
  }

  @Post('company-logo')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  async uploadCompanyLogo(
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
      `${CANDIDATE_SERVICE_URL}/upload/company-logo`,
      formData,
      {
        headers: {
          ...getAuthConfig(req).headers,
          ...formData.getHeaders(),
        },
      },
    );
  }

  @Get('my-cvs')
  async getMyCVs(@Request() req: any) {
    return this.proxy.get(
      `${CANDIDATE_SERVICE_URL}/upload/my-cvs`,
      getAuthConfig(req),
    );
  }

  @Post('cv/:id/primary')
  async setPrimaryCV(@Request() req: any, @Param('id') id: string) {
    return this.proxy.post(
      `${CANDIDATE_SERVICE_URL}/upload/cv/${id}/primary`,
      {},
      getAuthConfig(req),
    );
  }

  @Get('cv/:id/delete')
  async deleteCV(@Request() req: any, @Param('id') id: string) {
    return this.proxy.get(
      `${CANDIDATE_SERVICE_URL}/upload/cv/${id}/delete`,
      getAuthConfig(req),
    );
  }

  @Get('cv/:id/download')
  @ApiOperation({ summary: 'Tải/Xem CV (Trả về link MinIO presigned)' })
  async downloadCV(
    @Request() req: any,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const result = await this.proxy.get(
      `${CANDIDATE_SERVICE_URL}/upload/cv/${id}/download`,
      getAuthConfig(req),
    );
    return res.json(result);
  }

  @Get('cv/:id/view')
  @ApiOperation({ summary: 'Xem CV trực tiếp (Proxy stream qua Backend)' })
  async viewCV(
    @Request() req: any,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    try {
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
    } catch (error: any) {
      console.error('Gateway View CV Proxy Error:', error.message);
      return res.status(error.status || 500).json({ 
        message: 'Lỗi khi kết nối đến dịch vụ CV',
        details: error.message 
      });
    }
  }
}
