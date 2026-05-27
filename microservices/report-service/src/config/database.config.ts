import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

import { ReportEntity } from '../modules/report/entities/report.entity';
import { ReportRequestEntity } from '../modules/report-request/entities/report-request.entity';

@Injectable()
export class DatabaseConfig implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const sslEnabled =
      (this.configService.get<string>('DB_SSL') || '').toLowerCase() === 'true';
    const sslRejectUnauthorized =
      (this.configService.get<string>('DB_SSL_REJECT_UNAUTHORIZED') || 'false').toLowerCase() ===
      'true';

    return {
      type: 'postgres',
      host: this.configService.get<string>('DB_HOST', 'localhost'),
      port: this.configService.get<number>('DB_PORT', 5437),
      username: this.configService.get<string>('DB_USER', 'postgres'),
      password: this.configService.get<string>('DB_PASSWORD', 'postgres'),
      database: this.configService.get<string>('DB_NAME', 'report_db'),
      entities: [ReportEntity, ReportRequestEntity],
      ssl: sslEnabled ? { rejectUnauthorized: sslRejectUnauthorized } : undefined,
      synchronize: false,
      logging: process.env.NODE_ENV === 'development',
    };
  }
}
