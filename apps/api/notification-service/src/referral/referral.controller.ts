import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ReferralService } from './referral.service';

@ApiTags('Referrals')
@Controller('referrals')
@ApiBearerAuth()
export class ReferralController {
  constructor(private readonly referralService: ReferralService) {}

  @Post('referrers')
  @ApiOperation({ summary: 'Tạo người tham chiếu' })
  createReferrer(@Body() body: any) {
    return this.referralService.createReferrer(body);
  }

  @Get('referrers')
  @ApiOperation({ summary: 'Danh sách người tham chiếu' })
  listReferrers(@Query('resumeId') resumeId?: string) {
    return this.referralService.listReferrers(
      resumeId ? parseInt(resumeId, 10) : undefined,
    );
  }

  @Post('verifications')
  @ApiOperation({ summary: 'Tạo yêu cầu xác thực' })
  createVerification(
    @Body('referrerId', ParseIntPipe) referrerId: number,
    @Body('token') token: string,
  ) {
    return this.referralService.createVerification(referrerId, token);
  }

  @Get('verifications/:token')
  @ApiOperation({ summary: 'Kiểm tra trạng thái xác thực' })
  getVerification(@Param('token') token: string) {
    return this.referralService.getVerificationByToken(token);
  }

  @Post('verifications/:token/respond')
  @ApiOperation({ summary: 'Phản hồi xác thực' })
  respondVerification(@Param('token') token: string, @Body() body: any) {
    return this.referralService.respondVerification(token, body);
  }
}
