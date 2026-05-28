import { Injectable, HttpException, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Request, Response } from 'express';
import { firstValueFrom, Observable } from 'rxjs';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import * as https from 'https';

@Injectable()
export class ProxyService {
  private readonly logger = new Logger(ProxyService.name);
  private readonly agent = new https.Agent({ rejectUnauthorized: false });

  constructor(private readonly httpService: HttpService) {}

  async forward(request: Request, targetUrl: string, response?: Response): Promise<any> {
    const method = request.method.toLowerCase();
    const queryString = this.buildQueryString(request.query);
    const url = queryString ? `${targetUrl}${queryString}` : targetUrl;

    const headers = this.buildHeaders(request);

    const config: AxiosRequestConfig = { headers, httpsAgent: this.agent };

    this.logger.debug(`Forwarding ${request.method} → ${url}`);

    try {
      let response$: Observable<AxiosResponse<any>>;

      if (['post', 'put', 'patch'].includes(method)) {
        response$ = this.httpService[method](url, request.body, config);
      } else {
        response$ = this.httpService[method](url, config);
      }

      const { data, headers: responseHeaders } = await firstValueFrom(response$);

      if (response && responseHeaders['set-cookie']) {
        const cookies = responseHeaders['set-cookie'];
        if (Array.isArray(cookies)) {
          cookies.forEach((cookie) => response.setHeader('Set-Cookie', cookie));
        } else {
          response.setHeader('Set-Cookie', [cookies]);
        }
      }

      return data;
    } catch (error) {
      const status = error?.response?.status || 502;
      const message =
        error?.response?.data?.message ||
        error?.response?.data ||
        error?.message ||
        'Error al contactar el microservicio';

      this.logger.error(`Error forwarding to ${url}: ${status} - ${JSON.stringify(message)}`);
      throw new HttpException(message, status);
    }
  }

  private buildHeaders(request: Request): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    const auth = request.headers['authorization'];
    if (auth) {
      headers['Authorization'] = auth as string;
    }

    const cookie = request.headers['cookie'];
    if (cookie) {
      headers['Cookie'] = cookie as string;
    }

    const userAgent = request.headers['user-agent'];
    if (userAgent) {
      headers['User-Agent'] = userAgent as string;
    }

    return headers;
  }

  private buildQueryString(query: Record<string, any>): string {
    const keys = Object.keys(query);
    if (!keys.length) return '';
    const params = new URLSearchParams();
    keys.forEach((key) => params.append(key, query[key]));
    return `?${params.toString()}`;
  }
}
