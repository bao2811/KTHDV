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
import { InterviewService } from './interview.service';

@Controller('interviews')
export class InterviewController {
  constructor(private readonly interviewService: InterviewService) {}

  // Slots
  @Post('slots')
  createSlot(@Body() body: any) {
    return this.interviewService.createSlot(body);
  }

  @Get('slots')
  listSlots(@Query('userId') userId?: string) {
    return this.interviewService.listSlots(
      userId ? parseInt(userId, 10) : undefined,
    );
  }

  @Patch('slots/:id')
  updateSlot(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.interviewService.updateSlot(id, body);
  }

  @Delete('slots/:id')
  deleteSlot(@Param('id', ParseIntPipe) id: number) {
    return this.interviewService.deleteSlot(id);
  }

  // Interviews
  @Post('interviews')
  createInterview(@Body() body: any) {
    return this.interviewService.createInterview(body);
  }

  @Get('interviews')
  listInterviews(
    @Query('applicationId') applicationId?: string,
    @Query('interviewerId') interviewerId?: string,
  ) {
    return this.interviewService.listInterviews({
      applicationId: applicationId ? parseInt(applicationId, 10) : undefined,
      interviewerId: interviewerId ? parseInt(interviewerId, 10) : undefined,
    });
  }

  @Patch('interviews/:id')
  updateInterview(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.interviewService.updateInterview(id, body);
  }
}
