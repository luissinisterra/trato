import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { RefreshToken } from './entities/refresh-token.entity';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { UserModule } from '../user/user.module';
import type { StringValue } from 'ms';

@Module({
  imports: [
    UserModule,
    HttpModule,
    TypeOrmModule.forFeature([RefreshToken]),
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET,
      signOptions: {
        expiresIn: (process.env.JWT_ACCESS_EXPIRES_IN || '15m') as StringValue,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard],
})
export class AuthModule {}
