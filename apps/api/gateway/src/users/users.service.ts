import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get all users with pagination
   */
  async findAll(params: { page?: number; limit?: number; search?: string }) {
    const page = params.page || 1;
    const limit = params.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (params.search) {
      where.OR = [
        { email: { contains: params.search, mode: 'insensitive' } },
        {
          profile: {
            fullName: { contains: params.search, mode: 'insensitive' },
          },
        },
      ];
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          status: true,
          provider: true,
          createdAt: true,
          role: {
            select: { id: true, name: true },
          },
          profile: {
            select: { fullName: true, phone: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: users,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get user by ID
   */
  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        status: true,
        provider: true,
        createdAt: true,
        updatedAt: true,
        role: {
          select: {
            id: true,
            name: true,
            permissions: {
              include: { permission: true },
            },
          },
        },
        profile: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User không tồn tại');
    }

    return user;
  }

  /**
   * Update user status (Active/Inactive/Locked)
   */
  async updateStatus(id: number, status: string) {
    const validStatuses = ['ACTIVE', 'INACTIVE', 'LOCKED'];
    if (!validStatuses.includes(status)) {
      throw new BadRequestException(
        `Status không hợp lệ. Chọn: ${validStatuses.join(', ')}`,
      );
    }

    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User không tồn tại');
    }

    return this.prisma.user.update({
      where: { id },
      data: { status: status as any },
      select: {
        id: true,
        email: true,
        status: true,
      },
    });
  }

  /**
   * Update user role
   */
  async updateRole(id: number, roleId: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User không tồn tại');
    }

    const role = await this.prisma.role.findUnique({ where: { id: roleId } });
    if (!role) {
      throw new NotFoundException('Role không tồn tại');
    }

    return this.prisma.user.update({
      where: { id },
      data: { roleId },
      select: {
        id: true,
        email: true,
        role: { select: { id: true, name: true } },
      },
    });
  }

  /**
   * Get all roles
   */
  async findAllRoles() {
    return this.prisma.role.findMany({
      include: {
        permissions: {
          include: { permission: true },
        },
        _count: { select: { users: true } },
      },
    });
  }
  /**
   * Get all potential job reviewers (Admin, Manager)
   */
  async findReviewers() {
    return this.prisma.user.findMany({
      where: {
        role: {
          name: { in: ['Admin', 'Manager'] },
        },
        status: 'ACTIVE',
      },
      select: {
        id: true,
        email: true,
        profile: {
          select: { fullName: true },
        },
        role: {
          select: { name: true },
        },
      },
    });
  }
}
