import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
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

const INTERVIEW_SERVICE_URL =
  process.env.INTERVIEW_SERVICE_URL || 'http://localhost:3003';

const getAuthConfig = (req: any) => ({
  headers: {
    Authorization: req.headers.authorization,
  },
});

@ApiTags('Interviews (via Proxy)')
@Controller('interviews')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class InterviewProxyController {
  constructor(@Inject(SERVICE_PROXY) private proxy: IServiceProxy) {}

  // ===== Slots =====

  @Post('slots')
  @ApiOperation({ summary: 'Tạo khung giờ rảnh' })
  async createSlot(@Request() req: any, @Body() body: any) {
    return this.proxy.post(
      `${INTERVIEW_SERVICE_URL}/interviews/slots`,
      body,
      getAuthConfig(req),
    );
  }

  @Get('slots')
  @ApiOperation({ summary: 'Danh sách khung giờ rảnh' })
  async listSlots(@Request() req: any, @Query('userId') userId?: string) {
    const url = new URL(`${INTERVIEW_SERVICE_URL}/interviews/slots`);
    if (userId) url.searchParams.append('userId', userId);
    return this.proxy.get(url.toString(), getAuthConfig(req));
  }

  @Get('slots/:id')
  @ApiOperation({ summary: 'Chi tiết khung giờ' })
  async getSlot(@Request() req: any, @Param('id') id: number) {
    return this.proxy.get(
      `${INTERVIEW_SERVICE_URL}/interviews/slots/${id}`,
      getAuthConfig(req),
    );
  }

  @Patch('slots/:id')
  @ApiOperation({ summary: 'Cập nhật khung giờ' })
  async updateSlot(
    @Request() req: any,
    @Param('id') id: number,
    @Body() body: any,
  ) {
    return this.proxy.patch(
      `${INTERVIEW_SERVICE_URL}/interviews/slots/${id}`,
      body,
      getAuthConfig(req),
    );
  }

  @Delete('slots/:id')
  @ApiOperation({ summary: 'Xóa khung giờ' })
  async deleteSlot(@Request() req: any, @Param('id') id: number) {
    return this.proxy.delete(
      `${INTERVIEW_SERVICE_URL}/interviews/slots/${id}`,
      getAuthConfig(req),
    );
  }

  // ===== Interviews =====

  @Post('schedule')
  @ApiOperation({ summary: 'Tạo lịch phỏng vấn thủ công' })
  async createInterview(@Request() req: any, @Body() body: any) {
    return this.proxy.post(
      `${INTERVIEW_SERVICE_URL}/interviews/schedule`,
      body,
      getAuthConfig(req),
    );
  }

  @Post('auto-schedule')
  @ApiOperation({ summary: 'Tự động xếp lịch phỏng vấn' })
  async autoSchedule(@Request() req: any, @Body() body: any) {
    return this.proxy.post(
      `${INTERVIEW_SERVICE_URL}/interviews/auto-schedule`,
      body,
      getAuthConfig(req),
    );
  }

  @Get('available-slots')
  @ApiOperation({ summary: 'Tìm slot trống' })
  async findAvailableSlots(
    @Request() req: any,
    @Query('interviewerId') interviewerId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const url = new URL(`${INTERVIEW_SERVICE_URL}/interviews/available-slots`);
    if (interviewerId) url.searchParams.append('interviewerId', interviewerId);
    if (startDate) url.searchParams.append('startDate', startDate);
    if (endDate) url.searchParams.append('endDate', endDate);
    return this.proxy.get(url.toString(), getAuthConfig(req));
  }

  @Get('list')
  @ApiOperation({ summary: 'Danh sách lịch phỏng vấn' })
  async listInterviews(
    @Request() req: any,
    @Query('applicationId') applicationId?: string,
    @Query('interviewerId') interviewerId?: string,
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const url = new URL(`${INTERVIEW_SERVICE_URL}/interviews/list`);
    if (applicationId) url.searchParams.append('applicationId', applicationId);
    if (interviewerId) url.searchParams.append('interviewerId', interviewerId);
    if (status) url.searchParams.append('status', status);
    if (page) url.searchParams.append('page', page);
    if (limit) url.searchParams.append('limit', limit);
    return this.proxy.get(url.toString(), getAuthConfig(req));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết lịch phỏng vấn' })
  async getInterview(@Request() req: any, @Param('id') id: number) {
    return this.proxy.get(
      `${INTERVIEW_SERVICE_URL}/interviews/${id}`,
      getAuthConfig(req),
    );
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật lịch phỏng vấn' })
  async updateInterview(
    @Request() req: any,
    @Param('id') id: number,
    @Body() body: any,
  ) {
    return this.proxy.patch(
      `${INTERVIEW_SERVICE_URL}/interviews/${id}`,
      body,
      getAuthConfig(req),
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Hủy lịch phỏng vấn' })
  async deleteInterview(@Request() req: any, @Param('id') id: number) {
    return this.proxy.delete(
      `${INTERVIEW_SERVICE_URL}/interviews/${id}`,
      getAuthConfig(req),
    );
  }
}
