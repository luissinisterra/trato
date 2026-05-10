import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ProxyService } from '../../common/proxy/proxy.service';

@Module({
  imports: [HttpModule],
  controllers: [AuthController],
  providers: [AuthService, ProxyService],
})
export class AuthModule {}
