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
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { InterviewService } from './interview.service';

@ApiTags('Interviews')
@Controller('interviews')
@ApiBearerAuth()
export class InterviewController {
  constructor(private readonly interviewService: InterviewService) {}

  // ===== Availability Slots =====

  @Post('slots')
  @ApiOperation({ summary: 'Tạo khung giờ rảnh' })
  createSlot(@Body() body: any) {
    return this.interviewService.createSlot(body);
  }

  @Get('slots')
  @ApiOperation({ summary: 'Danh sách khung giờ rảnh' })
  listSlots(@Query('userId') userId?: string) {
    return this.interviewService.listSlots(
      userId ? parseInt(userId, 10) : undefined,
    );
  }

  @Get('slots/:id')
  @ApiOperation({ summary: 'Chi tiết khung giờ' })
  getSlot(@Param('id', ParseIntPipe) id: number) {
    return this.interviewService.getSlot(id);
  }

  @Patch('slots/:id')
  @ApiOperation({ summary: 'Cập nhật khung giờ' })
  updateSlot(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.interviewService.updateSlot(id, body);
  }

  @Delete('slots/:id')
  @ApiOperation({ summary: 'Xóa khung giờ' })
  deleteSlot(@Param('id', ParseIntPipe) id: number) {
    return this.interviewService.deleteSlot(id);
  }

  // ===== Interviews =====

  @Post('schedule')
  @ApiOperation({ summary: 'Tạo lịch phỏng vấn thủ công' })
  createInterview(@Body() body: any) {
    return this.interviewService.createInterview(body);
  }

  @Post('auto-schedule')
  @ApiOperation({ summary: 'Tự động xếp lịch phỏng vấn' })
  autoSchedule(@Body() body: any) {
    return this.interviewService.autoSchedule(body);
  }

  @Get('available-slots')
  @ApiOperation({ summary: 'Tìm slot trống của interviewer trong khoảng thời gian' })
  findAvailableSlots(
    @Query('interviewerId') interviewerId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.interviewService.findAvailableSlots(
      parseInt(interviewerId, 10),
      startDate,
      endDate,
    );
  }

  @Get('list')
  @ApiOperation({ summary: 'Danh sách lịch phỏng vấn' })
  listInterviews(
    @Query('applicationId') applicationId?: string,
    @Query('interviewerId') interviewerId?: string,
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.interviewService.listInterviews({
      applicationId: applicationId ? parseInt(applicationId, 10) : undefined,
      interviewerId: interviewerId ? parseInt(interviewerId, 10) : undefined,
      status,
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết lịch phỏng vấn' })
  getInterview(@Param('id', ParseIntPipe) id: number) {
    return this.interviewService.getInterview(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật lịch phỏng vấn' })
  updateInterview(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.interviewService.updateInterview(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Hủy lịch phỏng vấn' })
  deleteInterview(@Param('id', ParseIntPipe) id: number) {
    return this.interviewService.deleteInterview(id);
  }
}
