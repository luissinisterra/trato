import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ReportService } from '../services/report.service';
import { ReportRequestService } from '../../report-request/services/report-request.service';
import { CreateReportDto } from '../dto/report.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportController {
  constructor(
    private readonly reportService: ReportService,
    private readonly reportRequestService: ReportRequestService,
  ) {}

  @Post('generate')
  async generateReport(@Body() dto: CreateReportDto, @Request() req) {
    const userId = req.user.sub || req.user.id;

    // Check rate limit
    await this.reportRequestService.checkRateLimit(userId);

    // Create request record
    await this.reportRequestService.createRequest(userId, dto.type);

    // Generate report
    const report = await this.reportService.generateReport(userId, dto.type);

    return {
      success: true,
      data: report,
    };
  }

  @Get(':id')
  async getReport(@Param('id') id: number, @Request() req) {
    const userId = req.user.sub || req.user.id;
    const report = await this.reportService.getReportById(id, userId);

    if (!report) {
      return {
        success: false,
        message: 'Report not found',
      };
    }

    return {
      success: true,
      data: report,
    };
  }

  @Get('user/:userId')
  async getUserReports(@Param('userId') userId: number, @Request() req) {
    // Users can only see their own reports
    const requestingUserId = req.user.sub || req.user.id;
    if (userId !== requestingUserId) {
      return {
        success: false,
        message: 'You can only view your own reports',
      };
    }

    const reports = await this.reportService.getUserReports(userId);

    return {
      success: true,
      data: reports,
    };
  }

  @Get('user/:userId/pending')
  async getPendingRequests(@Param('userId') userId: number, @Request() req) {
    // Users can only see their own requests
    const requestingUserId = req.user.sub || req.user.id;
    if (userId !== requestingUserId) {
      return {
        success: false,
        message: 'You can only view your own pending requests',
      };
    }

    const requests = await this.reportRequestService.getPendingRequests(userId);

    return {
      success: true,
      data: requests,
    };
  }

  @Delete(':id')
  async deleteReport(@Param('id') id: number, @Request() req) {
    const userId = req.user.sub || req.user.id;
    await this.reportService.deleteReport(id, userId);

    return {
      success: true,
      message: 'Report deleted successfully',
    };
  }
}
