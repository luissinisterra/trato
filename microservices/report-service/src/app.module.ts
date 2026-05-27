import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';

import { DatabaseConfig } from './config/database.config';
import { ReportModule } from './modules/report/report.module';
import { ReportRequestModule } from './modules/report-request/report-request.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfig,
    }),
    HttpModule.register({
      timeout: 10000,
      maxRedirects: 3,
    }),
    ReportModule,
    ReportRequestModule,
  ],
})
export class AppModule {}
