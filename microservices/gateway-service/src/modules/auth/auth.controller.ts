import {
  Controller,
  All,
  Req,
  UseGuards,
  HttpCode,
  Post,
  Body,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { Public } from '../../common/decorators/public.decorator';

/**
 * AuthController
 *
 * Rutas públicas (sin JWT):
 *   POST /auth/register  → auth-service
 *   POST /auth/login     → auth-service
 *   POST /auth/refresh   → auth-service
 *
 * Todas las demás rutas bajo /auth/* también se reenvían.
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  register(@Req() request: Request) {
    return this.authService.forward(request, '/auth/register');
  }

  @Public()
  @Post('login')
  login(@Req() request: Request) {
    return this.authService.forward(request, '/auth/login');
  }

  @Public()
  @Post('refresh')
  refresh(@Req() request: Request) {
    return this.authService.forward(request, '/auth/refresh');
  }

  @Public()
  @Post('logout')
  logout(@Req() request: Request) {
    return this.authService.forward(request, '/auth/logout');
  }

  /**
   * Captura cualquier otra ruta bajo /auth/*
   * Útil para expansión futura sin modificar el gateway.
   */
  @Public()
  @All()
  catchAllRoot(@Req() request: Request) {
    return this.catchAll(request);
  }

  @Public()
  @All('*')
  catchAllSub(@Req() request: Request) {
    return this.catchAll(request);
  }

  private catchAll(request: Request) {
    const fullPath = request.path.replace(/^\/api/, '');
    return this.authService.forward(request, fullPath);
  }
}
