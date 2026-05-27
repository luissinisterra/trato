import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { ProxyService } from '../../common/proxy/proxy.service';

@Injectable()
export class AgentService {
  private readonly baseUrl: string;

  constructor(
    private readonly proxyService: ProxyService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = this.configService.get<string>('AI_AGENT_SERVICE_URL');
  }

  forward(request: Request, path: string): Promise<any> {
    const targetUrl = `${this.baseUrl}${path}`;
    return this.proxyService.forward(request, targetUrl);
  }
}
