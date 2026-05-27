import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AgentController } from './agent.controller';
import { AgentService } from './agent.service';
import { ProxyService } from '../../common/proxy/proxy.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Module({
  imports: [HttpModule],
  controllers: [AgentController],
  providers: [AgentService, ProxyService, JwtAuthGuard],
})
export class AgentModule {}
