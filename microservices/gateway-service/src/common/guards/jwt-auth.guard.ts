import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { firstValueFrom } from 'rxjs';

/**
 * JwtAuthGuard
 *
 * Valida el Bearer token consultando al auth-service.
 * NO valida JWT localmente — delega la lógica al auth-service.
 *
 * Flujo:
 *  1. Lee el header Authorization del request entrante.
 *  2. Hace POST /auth/validate al auth-service con el token.
 *  3. Si el auth-service responde 200 → permite el acceso y adjunta el payload al request.
 *  4. Si responde con error → lanza UnauthorizedException (401).
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException('Token no proporcionado');
    }

    const authServiceUrl =
      this.configService.get<string>('AUTH_SERVICE_URL') ||
      'http://localhost:3001';
    const validateUrl = `${authServiceUrl}/auth/validate`;

    try {
      const { data } = await firstValueFrom(
        this.httpService.post(
          validateUrl,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        ),
      );

      // Adjunta el payload del usuario al request para uso posterior
      (request as any).user = data.user ?? data;
      return true;
    } catch (error) {
      this.logger.warn(`Token inválido o auth-service no disponible: ${error?.message}`);
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }

  private extractToken(request: Request): string | null {
    const authHeader = request.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.substring(7);
  }
}
