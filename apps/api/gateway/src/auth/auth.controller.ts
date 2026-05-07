import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Req,
  Res,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { Public } from './decorators/public.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * POST /api/auth/register
   * Đăng ký tài khoản mới (mặc định role = Candidate)
   */
  @Public()
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  /**
   * POST /api/auth/login
   * Đăng nhập → access + refresh token
   */
  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  /**
   * POST /api/auth/refresh
   * Refresh access token
   */
  @Public()
  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(@Body() dto: RefreshTokenDto, @Req() req: Request) {
    const user = req.user as { id: number; refreshToken: string };
    return this.authService.refreshTokens(user.id, user.refreshToken);
  }

  /**
   * POST /api/auth/logout
   * Đăng xuất (revoke refresh token) - requires JWT
   */
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@CurrentUser('id') userId: number) {
    return this.authService.logout(userId);
  }

  /**
   * GET /api/auth/google
   * Redirect to Google OAuth
   */
  @Public()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Guard redirects to Google
  }

  /**
   * GET /api/auth/google/callback
   * Google OAuth callback
   */
  @Public()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req: Request, @Res() res: Response) {
    const googleUser = req.user as {
      providerId: string;
      email: string;
      fullName: string;
      avatar?: string;
    };

    const result = await this.authService.googleLogin(googleUser);

    const frontendUrl = this.configService.get<string>('FRONTEND_URL');
    console.log('DEBUG: Google Auth Callback - Redirecting to FRONTEND_URL:', frontendUrl);
    
    // Redirect to frontend callback page with tokens
    const finalFrontendUrl = frontendUrl || 'http://localhost:3456';
    const url = new URL(`${finalFrontendUrl}/auth/callback`);
    url.searchParams.append('accessToken', result.accessToken);
    url.searchParams.append('refreshToken', result.refreshToken);
    url.searchParams.append('user', JSON.stringify(result.user));

    return res.redirect(url.toString());
  }

  /**
   * GET /api/auth/me
   * Thông tin user hiện tại (requires JWT)
   */
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('me')
  async getProfile(@CurrentUser('id') userId: number) {
    return this.authService.getProfile(userId);
  }
}
