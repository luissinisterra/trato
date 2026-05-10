import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * @Public()
 *
 * Decorador para marcar un endpoint como público.
 * Los endpoints marcados con este decorador NO requieren JWT.
 *
 * Uso:
 *   @Public()
 *   @Post('login')
 *   login(@Body() dto: LoginDto) { ... }
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
