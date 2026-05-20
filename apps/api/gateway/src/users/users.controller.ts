import {
  Controller,
  Delete,
  Get,
  Patch,
  Param,
  Body,
  Post,
  Put,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * GET /api/users/reviewers
   * Danh sách người có quyền duyệt tin (Admin, HR)
   */
  @Get('reviewers')
  @Roles('Admin', 'HR')
  async findReviewers() {
    return this.usersService.findReviewers();
  }

  /**
   * GET /api/users
   * Danh sách users (Admin only)
   */
  @Get()
  @Roles('Admin')
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('role') role?: string,
    @Query('status') status?: string,
  ) {
    return this.usersService.findAll({
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      search,
      role,
      status,
    });
  }

  /**
   * GET /api/users/roles
   * Danh sách roles (Admin only)
   */
  @Get('roles')
  @Roles('Admin')
  async findAllRoles() {
    return this.usersService.findAllRoles();
  }

  /**
   * POST /api/users/roles
   * Tao role moi (Admin only)
   */
  @Post('roles')
  @Roles('Admin')
  async createRole(@Body() body: { name: string; description?: string }) {
    return this.usersService.createRole(body);
  }

  /**
   * PATCH /api/users/roles/:id
   * Cap nhat role (Admin only)
   */
  @Patch('roles/:id')
  @Roles('Admin')
  async updateRoleInfo(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { name?: string; description?: string },
  ) {
    return this.usersService.updateRoleInfo(id, body);
  }

  /**
   * DELETE /api/users/roles/:id
   * Xoa role neu chua co user (Admin only)
   */
  @Delete('roles/:id')
  @Roles('Admin')
  async deleteRole(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.deleteRole(id);
  }

  /**
   * GET /api/users/permissions
   * Danh sach permissions (Admin only)
   */
  @Get('permissions')
  @Roles('Admin')
  async findAllPermissions() {
    return this.usersService.findAllPermissions();
  }

  /**
   * PUT /api/users/roles/:id/permissions
   * Gan lai permissions cho role (Admin only)
   */
  @Put('roles/:id/permissions')
  @Roles('Admin')
  async updateRolePermissions(
    @Param('id', ParseIntPipe) id: number,
    @Body('permissionIds') permissionIds: number[],
  ) {
    return this.usersService.updateRolePermissions(id, permissionIds);
  }

  /**
   * GET /api/users/:id
   * Chi tiết user (Admin only)
   */
  @Get(':id')
  @Roles('Admin')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  /**
   * PATCH /api/users/:id/status
   * Thay đổi status (Admin only)
   */
  @Patch(':id/status')
  @Roles('Admin')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: string,
  ) {
    return this.usersService.updateStatus(id, status);
  }

  /**
   * PATCH /api/users/:id/role
   * Thay đổi role (Admin only)
   */
  @Patch(':id/role')
  @Roles('Admin')
  async updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Body('roleId', ParseIntPipe) roleId: number,
  ) {
    return this.usersService.updateRole(id, roleId);
  }

  /**
   * PATCH /api/users/me/profile
   * Cập nhật profile của chính mình
   */
  @Patch('me/profile')
  async updateMyProfile(
    @CurrentUser('id') userId: number,
    @Body() body: { fullName?: string; phone?: string; avatarUrl?: string },
  ) {
    return this.usersService.updateProfile(userId, body);
  }
}
