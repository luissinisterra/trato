import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { ReportEntity } from './entities/report.entity';
import { ReportController } from './controllers/report.controller';
import { ReportService } from './services/report.service';
import { ReportRequestModule } from '../report-request/report-request.module';

@Module({
  imports: [TypeOrmModule.forFeature([ReportEntity]), HttpModule, ReportRequestModule],
  controllers: [ReportController],
  providers: [ReportService],
  exports: [ReportService],
})
export class ReportModule {}
