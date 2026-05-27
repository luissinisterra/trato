import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ProxyService } from '../../common/proxy/proxy.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Module({
  imports: [HttpModule],
  controllers: [UserController],
  providers: [UserService, ProxyService, JwtAuthGuard],
})
export class UserModule {}
