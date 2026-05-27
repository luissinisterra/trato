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
  forwardRoot(@Req() request: Request) {
    return this.forward(request);
  }

  @All('*')
  forwardAll(@Req() request: Request) {
    return this.forward(request);
  }

  private forward(request: Request) {
    const path = request.path.replace(/^\/api/, '');
    return this.reportService.forward(request, path);
  }
}
