import { Controller, All, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { ReportService } from './report.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

/**
 * ReportController
 *
 * Rutas protegidas — requieren JWT válido:
 *   GET|POST|PUT|PATCH|DELETE /reports/*  → report-service (:3007)
 */
@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @All()
  @All('*path')
  forward(@Req() request: Request) {
    const path = request.path;
    return this.reportService.forward(request, path);
  }
}
