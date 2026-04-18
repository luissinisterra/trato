import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersAuth } from './entities/users-auth.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import type { StringValue } from 'ms';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersAuth, RefreshToken]),
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET || 'access-secret-dev',
      signOptions: {
        expiresIn: (process.env.JWT_ACCESS_EXPIRES_IN || '15m') as StringValue,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard],
})
export class AuthModule {}
