import {
  Controller,
  Post,
  Get,
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

const NOTIFICATION_SERVICE_URL =
  process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3006';

const getAuthConfig = (req: any) => ({
  headers: {
    Authorization: req.headers.authorization,
  },
});

@ApiTags('Referrals (via Proxy)')
@Controller('referrals')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotificationProxyController {
  constructor(@Inject(SERVICE_PROXY) private proxy: IServiceProxy) {}

  @Post('referrers')
  @ApiOperation({ summary: 'Tạo người tham chiếu' })
  async createReferrer(@Request() req: any, @Body() body: any) {
    return this.proxy.post(
      `${NOTIFICATION_SERVICE_URL}/referrals/referrers`,
      body,
      getAuthConfig(req),
    );
  }

  @Get('referrers')
  @ApiOperation({ summary: 'Danh sách người tham chiếu' })
  async listReferrers(
    @Request() req: any,
    @Query('resumeId') resumeId?: string,
  ) {
    const url = new URL(`${NOTIFICATION_SERVICE_URL}/referrals/referrers`);
    if (resumeId) url.searchParams.append('resumeId', resumeId);
    return this.proxy.get(url.toString(), getAuthConfig(req));
  }

  @Post('verifications')
  @ApiOperation({ summary: 'Tạo yêu cầu xác thực referral' })
  async createVerification(@Request() req: any, @Body() body: any) {
    return this.proxy.post(
      `${NOTIFICATION_SERVICE_URL}/referrals/verifications`,
      body,
      getAuthConfig(req),
    );
  }

  @Get('verifications/:token')
  @ApiOperation({ summary: 'Kiểm tra trạng thái xác thực' })
  async getVerification(@Request() req: any, @Param('token') token: string) {
    return this.proxy.get(
      `${NOTIFICATION_SERVICE_URL}/referrals/verifications/${token}`,
      getAuthConfig(req),
    );
  }

  @Post('verifications/:token/respond')
  @ApiOperation({ summary: 'Phản hồi xác thực referral' })
  async respondVerification(
    @Request() req: any,
    @Param('token') token: string,
    @Body() body: any,
  ) {
    return this.proxy.post(
      `${NOTIFICATION_SERVICE_URL}/referrals/verifications/${token}/respond`,
      body,
      getAuthConfig(req),
    );
  }
}
