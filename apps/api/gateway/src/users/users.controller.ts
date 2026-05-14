import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

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
  ) {
    return this.usersService.findAll({
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      search,
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
}
