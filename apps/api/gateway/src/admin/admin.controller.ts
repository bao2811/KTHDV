import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('Admin')
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  /**
   * GET /api/admin/stats
   * Thống kê tổng quan hệ thống (Admin only)
   */
  @Get('stats')
  async getStats() {
    return this.adminService.getStats();
  }

  /**
   * GET /api/admin/audit-logs
   * Nhật ký hệ thống với pagination + filter (Admin only)
   *
   * Query params:
   *   - page, limit: pagination
   *   - userId: filter theo user
   *   - resource: filter theo resource (users, jobs, applications, auth...)
   *   - action: filter theo action (CREATE, UPDATE, DELETE, LOGIN...)
   *   - startDate, endDate: filter theo khoảng thời gian
   */
  @Get('audit-logs')
  async getAuditLogs(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('userId') userId?: string,
    @Query('resource') resource?: string,
    @Query('action') action?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.adminService.getAuditLogs({
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      userId,
      resource,
      action,
      startDate,
      endDate,
    });
  }

  /**
   * GET /api/admin/dashboard-chart
   * Dữ liệu biểu đồ tăng trưởng 6 tháng gần nhất (Admin only)
   */
  @Get('dashboard-chart')
  async getDashboardChart() {
    return this.adminService.getDashboardChart();
  }

  /**
   * GET /api/admin/referrals
   * Danh sach referral verifications (Admin only)
   */
  @Get('referrals')
  async getReferrals(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
  ) {
    return this.adminService.getReferrals({
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      status,
    });
  }

  /**
   * PATCH /api/admin/referrals/:id/verify
   * Cap nhat trang thai referral verification (Admin only)
   */
  @Patch('referrals/:id/verify')
  async verifyReferral(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { status: string; responseData?: any },
  ) {
    return this.adminService.verifyReferral(id, body);
  }
}
