import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ReferralService } from './referral.service';

@Controller('referrals')
export class ReferralController {
  constructor(private readonly referralService: ReferralService) {}

  @Post('referrers')
  createReferrer(@Body() body: any) {
    return this.referralService.createReferrer(body);
  }

  @Get('referrers')
  listReferrers(@Query('resumeId') resumeId?: string) {
    return this.referralService.listReferrers(
      resumeId ? parseInt(resumeId, 10) : undefined,
    );
  }

  @Post('verifications')
  createVerification(
    @Body('referrerId', ParseIntPipe) referrerId: number,
    @Body('token') token: string,
  ) {
    return this.referralService.createVerification(referrerId, token);
  }

  @Get('verifications/:token')
  getVerification(@Param('token') token: string) {
    return this.referralService.getVerificationByToken(token);
  }

  @Post('verifications/:token/respond')
  respondVerification(@Param('token') token: string, @Body() body: any) {
    return this.referralService.respondVerification(token, body);
  }
}
