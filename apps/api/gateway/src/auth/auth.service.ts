import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  /**
   * Register a new user with Candidate role
   */
  async register(dto: RegisterDto) {
    // Check if email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email đã được sử dụng');
    }

    // Get Candidate role (default for registration)
    const candidateRole = await this.prisma.role.findUnique({
      where: { name: 'Candidate' },
    });

    if (!candidateRole) {
      throw new BadRequestException(
        'Hệ thống chưa được khởi tạo. Vui lòng chạy seed data.',
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(dto.password, 12);

    // Create user + profile in a transaction
    const user = await this.prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email: dto.email,
          password: hashedPassword,
          roleId: candidateRole.id,
          provider: 'local',
        },
      });

      await tx.profile.create({
        data: {
          userId: newUser.id,
          fullName: dto.fullName,
        },
      });

      return newUser;
    });

    // Generate tokens
    const tokens = await this.generateTokens(user.id, user.email);

    // Save refresh token hash
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      user: {
        id: user.id,
        email: user.email,
        role: candidateRole.name,
      },
      ...tokens,
    };
  }

  /**
   * Login with email and password
   */
  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: { role: true },
    });

    if (!user || !user.password) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    if (user.status !== 'ACTIVE') {
      throw new ForbiddenException('Tài khoản đã bị khóa hoặc vô hiệu hóa');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    // Generate tokens
    const tokens = await this.generateTokens(user.id, user.email);

    // Save refresh token hash
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role.name,
        status: user.status,
      },
      ...tokens,
    };
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { role: true },
    });

    if (!user || !user.refreshToken) {
      throw new ForbiddenException('Truy cập bị từ chối');
    }

    const isRefreshTokenValid = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );

    if (!isRefreshTokenValid) {
      throw new ForbiddenException('Refresh token không hợp lệ');
    }

    // Generate new tokens
    const tokens = await this.generateTokens(user.id, user.email);

    // Update refresh token hash
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role.name,
      },
      ...tokens,
    };
  }

  /**
   * Logout - clear refresh token
   */
  async logout(userId: number) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });

    return { message: 'Đăng xuất thành công' };
  }

  /**
   * Handle Google OAuth login/register
   */
  async googleLogin(googleUser: {
    providerId: string;
    email: string;
    fullName: string;
    avatar?: string;
  }) {
    if (!googleUser.email) {
      throw new BadRequestException('Không lấy được email từ Google');
    }

    // Find existing user
    let user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: googleUser.email },
          {
            provider: 'google',
            providerId: googleUser.providerId,
          },
        ],
      },
      include: { role: true },
    });

    if (!user) {
      // Get Candidate role for new Google users
      const candidateRole = await this.prisma.role.findUnique({
        where: { name: 'Candidate' },
      });

      if (!candidateRole) {
        throw new BadRequestException(
          'Hệ thống chưa được khởi tạo. Vui lòng chạy seed data.',
        );
      }

      // Create new user from Google profile
      user = await this.prisma.$transaction(async (tx) => {
        const newUser = await tx.user.create({
          data: {
            email: googleUser.email,
            provider: 'google',
            providerId: googleUser.providerId,
            roleId: candidateRole.id,
          },
          include: { role: true },
        });

        await tx.profile.create({
          data: {
            userId: newUser.id,
            fullName: googleUser.fullName || 'Google User',
            avatarUrl: googleUser.avatar,
          } as any,
        });

        return newUser;
      });
    } else if (user.status !== 'ACTIVE') {
      throw new ForbiddenException('Tài khoản đã bị khóa hoặc vô hiệu hóa');
    }

    // Generate tokens
    const tokens = await this.generateTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role.name,
      },
      ...tokens,
    };
  }

  /**
   * Get current user profile
   */
  async getProfile(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        role: {
          include: {
            permissions: {
              include: { permission: true },
            },
          },
        },
        profile: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User không tồn tại');
    }

    return {
      id: user.id,
      email: user.email,
      status: user.status,
      provider: user.provider,
      role: {
        id: user.role.id,
        name: user.role.name,
        permissions: user.role.permissions.map((rp) => ({
          resource: rp.permission.resource,
          action: rp.permission.action,
        })),
      },
      profile: user.profile
        ? {
            fullName: user.profile.fullName,
            phone: user.profile.phone,
            experience: user.profile.experience,
            education: user.profile.education,
            cvUrl: user.profile.cvUrl,
            avatarUrl: (user.profile as any).avatarUrl,
          }
        : null,
      createdAt: user.createdAt,
    };
  }

  // ==================
  // Private helpers
  // ==================

  private async generateTokens(userId: number, email: string) {
    const payload = { sub: userId, email };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret:
          this.configService.get<string>('JWT_SECRET') || 'default-secret',
        expiresIn: this.configService.get<string>(
          'JWT_EXPIRES_IN',
          '1h',
        ) as any,
      }),
      this.jwtService.signAsync(payload, {
        secret:
          this.configService.get<string>('JWT_REFRESH_SECRET') ||
          'default-refresh-secret',
        expiresIn: this.configService.get<string>(
          'JWT_REFRESH_EXPIRES_IN',
          '7d',
        ) as any,
      }),
    ]);

    return { accessToken, refreshToken };
  }

  private async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 12);
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hashedRefreshToken },
    });
  }
}
