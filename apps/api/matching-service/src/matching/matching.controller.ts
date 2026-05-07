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
import { MatchingService } from './matching.service';

@ApiTags('Matching')
@Controller('matches')
@ApiBearerAuth()
export class MatchingController {
  constructor(private readonly matchingService: MatchingService) {}

  @Post('run')
  @ApiOperation({ summary: 'Chạy so khớp cho 1 application' })
  runMatch(@Body('applicationId', ParseIntPipe) applicationId: number) {
    return this.matchingService.runMatch(applicationId);
  }

  @Get(':applicationId')
  @ApiOperation({ summary: 'Lấy kết quả so khớp' })
  getMatch(@Param('applicationId', ParseIntPipe) applicationId: number) {
    return this.matchingService.getMatch(applicationId);
  }

  @Get()
  @ApiOperation({ summary: 'Danh sách kết quả so khớp' })
  listMatches(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.matchingService.listMatches({
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
  }
}
