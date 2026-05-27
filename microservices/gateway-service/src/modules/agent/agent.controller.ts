import { Controller, All, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AgentService } from './agent.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('agents')
@UseGuards(JwtAuthGuard)
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  @All()
  forwardRoot(@Req() request: Request) {
    return this.forward(request);
  }

  @All('*')
  forwardAll(@Req() request: Request) {
    return this.forward(request);
  }

  private forward(request: Request) {
    let path = request.path;
    if (path.startsWith('/api/agents')) {
      path = path.replace(/^\/api\/agents/, '');
    } else if (path.startsWith('/agents')) {
      path = path.replace(/^\/agents/, '');
    }
    if (!path) {
      path = '/chat';
    }
    const userId = (request as any).user?.id || (request as any).user?.sub;
    if (userId) {
      (request as any).headers['x-user-id'] = String(userId);
    }
    return this.agentService.forward(request, path);
  }
}
