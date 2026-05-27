import {
  Controller,
  All,
  Req,
  Res,
  HttpCode,
  Post,
  Options,
} from '@nestjs/common';
import { Request, Response } from 'express';
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

  // Intercepta preflight OPTIONS antes que el @All() catch-all
  @Public()
  @Options()
  @Options('*')
  @HttpCode(204)
  preflight(@Res() res: Response) {
    res.end();
  }

  @Public()
  @Post('register')
  register(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    return this.authService.forward(request, '/auth/register', response);
  }

  @Public()
  @Post('login')
  login(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    return this.authService.forward(request, '/auth/login', response);
  }

  @Public()
  @Post('refresh')
  refresh(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    return this.authService.forward(request, '/auth/refresh', response);
  }

  @Public()
  @Post('logout')
  logout(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    return this.authService.forward(request, '/auth/logout', response);
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
