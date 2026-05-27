import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { ProxyService } from '../../common/proxy/proxy.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Module({
  imports: [HttpModule],
  controllers: [ReportController],
  providers: [ReportService, ProxyService, JwtAuthGuard],
})
export class ReportModule {}
