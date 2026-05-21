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
  async findAll(params: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    status?: string;
  }) {
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
    if (params.role) {
      where.role = { name: params.role };
    }
    if (params.status) {
      where.status = params.status;
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
      orderBy: { id: 'asc' },
    });
  }

  async createRole(data: { name: string; description?: string }) {
    if (!data.name?.trim()) {
      throw new BadRequestException('Ten role khong duoc de trong');
    }

    return this.prisma.role.create({
      data: {
        name: data.name.trim(),
        description: data.description,
      },
      include: {
        permissions: { include: { permission: true } },
        _count: { select: { users: true } },
      },
    });
  }

  async updateRoleInfo(
    id: number,
    data: { name?: string; description?: string },
  ) {
    const role = await this.prisma.role.findUnique({ where: { id } });
    if (!role) {
      throw new NotFoundException('Role khong ton tai');
    }

    return this.prisma.role.update({
      where: { id },
      data: {
        name: data.name?.trim() || undefined,
        description: data.description,
      },
      include: {
        permissions: { include: { permission: true } },
        _count: { select: { users: true } },
      },
    });
  }

  async deleteRole(id: number) {
    const role = await this.prisma.role.findUnique({
      where: { id },
      include: { _count: { select: { users: true } } },
    });
    if (!role) {
      throw new NotFoundException('Role khong ton tai');
    }
    if (role._count.users > 0) {
      throw new BadRequestException('Khong the xoa role dang co user');
    }

    await this.prisma.role.delete({ where: { id } });
    return { success: true };
  }

  async findAllPermissions() {
    return this.prisma.permission.findMany({
      orderBy: [{ resource: 'asc' }, { action: 'asc' }],
    });
  }

  async updateRolePermissions(roleId: number, permissionIds: number[]) {
    const role = await this.prisma.role.findUnique({ where: { id: roleId } });
    if (!role) {
      throw new NotFoundException('Role khong ton tai');
    }
    if (!Array.isArray(permissionIds)) {
      throw new BadRequestException('permissionIds phai la mang');
    }

    const uniqueIds = [...new Set(permissionIds.map(Number))];
    const count = await this.prisma.permission.count({
      where: { id: { in: uniqueIds } },
    });
    if (count !== uniqueIds.length) {
      throw new BadRequestException('Co permission khong ton tai');
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.rolePermission.deleteMany({ where: { roleId } });
      if (uniqueIds.length > 0) {
        await tx.rolePermission.createMany({
          data: uniqueIds.map((permissionId) => ({ roleId, permissionId })),
          skipDuplicates: true,
        });
      }
    });

    return this.prisma.role.findUnique({
      where: { id: roleId },
      include: {
        permissions: { include: { permission: true } },
        _count: { select: { users: true } },
      },
    });
  }

  /**
   * Update user profile (fullName, phone, etc.)
   */
  async updateProfile(userId: number, data: { fullName?: string; phone?: string; avatarUrl?: string }) {
    return this.prisma.profile.upsert({
      where: { userId },
      update: data,
      create: {
        userId,
        fullName: data.fullName || 'User',
        phone: data.phone,
        avatarUrl: data.avatarUrl,
      },
    });
  }

  /**
   * Update user avatar only
   */
  async updateProfileAvatar(userId: number, avatarUrl: string) {
    return this.prisma.profile.upsert({
      where: { userId },
      update: { avatarUrl },
      create: {
        userId,
        fullName: 'User',
        avatarUrl,
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
