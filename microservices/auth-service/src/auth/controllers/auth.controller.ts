import {
  Body,
  Res,
  Controller,
  Get,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../services/auth.service';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import type { AuthUserRequest } from '../../common/types/auth-user-request.type';
import type { Response } from 'express';
import { firstValueFrom } from 'rxjs';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  private setRefreshTokenCookie(res: Response, refreshToken: string) {
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/api/auth',
    });
  }

  private clearRefreshTokenCookie(res: Response) {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/api/auth',
    });
  }

  @Post('register')
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.register(dto);
    this.setRefreshTokenCookie(res, result.data.refreshToken);

    return {
      success: true,
      data: {
        user: result.data.user,
        accessToken: result.data.accessToken,
      },
    };
  }

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(dto);
    this.setRefreshTokenCookie(res, result.data.refreshToken);

    const userId = result.data.user?.id;
    if (userId) {
      const workerUrl = this.configService.get<string>('WORKER_URL') || 'https://trato-notifications.luchoporst.workers.dev';
      const notifySecret = this.configService.get<string>('NOTIFY_SECRET');
      if (notifySecret) {
        firstValueFrom(
          this.httpService.post(`${workerUrl}/notify`, {
            eventType: 'LOGIN_ALERT',
            userId: String(userId),
            title: 'Nuevo inicio de sesión',
            message: 'Se detectó un nuevo inicio de sesión en tu cuenta.',
            metadata: {},
          }, {
            headers: { 'x-notify-secret': notifySecret },
          }),
        ).catch((err) => console.error('Login notification failed:', err.message));
      }
    }

    return {
      success: true,
      data: {
        user: result.data.user,
        accessToken: result.data.accessToken,
      },
    };
  }

  @Post('refresh')
  async refresh(
    @Req() req: AuthUserRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedException({
        success: false,
        message: 'Missing refresh token cookie',
      });
    }

    const result = await this.authService.refresh(refreshToken);
    this.setRefreshTokenCookie(res, result.data.refreshToken);

    return {
      success: true,
      data: {
        user: result.data.user,
        accessToken: result.data.accessToken,
      },
    };
  }

  @Post('logout')
  async logout(
    @Req() req: AuthUserRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedException({
        success: false,
        message: 'Missing refresh token cookie',
      });
    }

    const result = await this.authService.logout(refreshToken);
    this.clearRefreshTokenCookie(res);
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() req: AuthUserRequest) {
    const userId = req.user?.sub;

    if (!userId) {
      throw new UnauthorizedException({
        success: false,
        message: 'Missing authenticated user',
      });
    }

    return this.authService.getMe(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('validate')
  async validate(@Req() req: AuthUserRequest) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new UnauthorizedException('Token inválido');
    }
    return { user: req.user };
  }
}
