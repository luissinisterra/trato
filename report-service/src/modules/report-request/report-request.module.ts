import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportRequestEntity } from './entities/report-request.entity';
import { ReportRequestService } from './services/report-request.service';

@Module({
  imports: [TypeOrmModule.forFeature([ReportRequestEntity])],
  providers: [ReportRequestService],
  exports: [ReportRequestService],
})
export class ReportRequestModule {}
