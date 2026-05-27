import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { ReportRequestEntity } from '../entities/report-request.entity';

@Injectable()
export class ReportRequestService {
  private readonly MAX_REPORTS_PER_DAY = 10;

  constructor(
    @InjectRepository(ReportRequestEntity)
    private readonly reportRequestRepository: Repository<ReportRequestEntity>,
  ) {}

  async checkRateLimit(userId: number): Promise<boolean> {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const count = await this.reportRequestRepository.count({
      where: {
        user_id: userId,
        created_at: MoreThan(oneDayAgo),
      },
    });

    if (count >= this.MAX_REPORTS_PER_DAY) {
      throw new BadRequestException({
        success: false,
        message: `You have reached the maximum limit of ${this.MAX_REPORTS_PER_DAY} reports per 24 hours`,
      });
    }

    return true;
  }

  async createRequest(userId: number, reportType: string): Promise<ReportRequestEntity> {
    const request = this.reportRequestRepository.create({
      user_id: userId,
      report_type: reportType,
      status: 'completed', // For now, mark as completed immediately
    });

    return this.reportRequestRepository.save(request);
  }

  async getPendingRequests(userId: number): Promise<ReportRequestEntity[]> {
    return this.reportRequestRepository.find({
      where: {
        user_id: userId,
        status: 'pending',
      },
      order: { created_at: 'DESC' },
    });
  }

  async getAllRequests(userId: number): Promise<ReportRequestEntity[]> {
    return this.reportRequestRepository.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
    });
  }
}
