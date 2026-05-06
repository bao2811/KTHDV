import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { MatchingService } from './matching.service';

@Controller('matches')
export class MatchingController {
  constructor(private readonly matchingService: MatchingService) {}

  @Post('run')
  runMatch(@Body('applicationId', ParseIntPipe) applicationId: number) {
    return this.matchingService.runMatch(applicationId);
  }

  @Get(':applicationId')
  getMatch(@Param('applicationId', ParseIntPipe) applicationId: number) {
    return this.matchingService.getMatch(applicationId);
  }
}
