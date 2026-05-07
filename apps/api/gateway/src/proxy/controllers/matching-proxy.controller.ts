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

const MATCHING_SERVICE_URL =
  process.env.MATCHING_SERVICE_URL || 'http://localhost:3005';

const getAuthConfig = (req: any) => ({
  headers: {
    Authorization: req.headers.authorization,
  },
});

@ApiTags('Matching (via Proxy)')
@Controller('matches')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MatchingProxyController {
  constructor(@Inject(SERVICE_PROXY) private proxy: IServiceProxy) {}

  @Post('run')
  @ApiOperation({ summary: 'Chạy so khớp cho 1 application' })
  async runMatch(@Request() req: any, @Body() body: any) {
    return this.proxy.post(
      `${MATCHING_SERVICE_URL}/matches/run`,
      body,
      getAuthConfig(req),
    );
  }

  @Get('list')
  @ApiOperation({ summary: 'Danh sách kết quả so khớp' })
  async listMatches(
    @Request() req: any,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const url = new URL(`${MATCHING_SERVICE_URL}/matches`);
    if (page) url.searchParams.append('page', page);
    if (limit) url.searchParams.append('limit', limit);
    return this.proxy.get(url.toString(), getAuthConfig(req));
  }

  @Get(':applicationId')
  @ApiOperation({ summary: 'Lấy kết quả so khớp theo application' })
  async getMatch(
    @Request() req: any,
    @Param('applicationId') applicationId: number,
  ) {
    return this.proxy.get(
      `${MATCHING_SERVICE_URL}/matches/${applicationId}`,
      getAuthConfig(req),
    );
  }
}
