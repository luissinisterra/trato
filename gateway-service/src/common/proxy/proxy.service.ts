import { Injectable, HttpException, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Request } from 'express';
import { firstValueFrom, Observable } from 'rxjs';
import { AxiosRequestConfig, AxiosResponse } from 'axios';

/**
 * ProxyService
 *
 * Servicio reutilizable para reenviar requests HTTP al microservicio destino.
 * Preserva:
 *  - Método HTTP (GET, POST, PUT, PATCH, DELETE)
 *  - Body
 *  - Query params
 *  - Headers (incluido Authorization Bearer)
 *
 * Maneja errores del downstream y los propaga con el mismo código HTTP.
 */
@Injectable()
export class ProxyService {
  private readonly logger = new Logger(ProxyService.name);

  constructor(private readonly httpService: HttpService) {}

  async forward(request: Request, targetUrl: string): Promise<any> {
    const method = request.method.toLowerCase();
    const queryString = this.buildQueryString(request.query);
    const url = queryString ? `${targetUrl}${queryString}` : targetUrl;

    const headers = this.buildHeaders(request);

    const config: AxiosRequestConfig = { headers };

    this.logger.debug(`Forwarding ${request.method} → ${url}`);

    try {
      let response$: Observable<AxiosResponse<any>>;

      if (['post', 'put', 'patch'].includes(method)) {
        response$ = this.httpService[method](url, request.body, config);
      } else {
        response$ = this.httpService[method](url, config);
      }

      const { data } = await firstValueFrom(response$);
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
    };

    // Reenvía el Bearer token al microservicio
    const auth = request.headers['authorization'];
    if (auth) {
      headers['Authorization'] = auth as string;
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
