import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { ReportEntity } from '../entities/report.entity';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(ReportEntity)
    private readonly reportRepository: Repository<ReportEntity>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async generateReport(userId: number, type: string): Promise<ReportEntity> {
    // Fetch data from other services based on report type
    let reportData = {};

    try {
      if (type === 'auction_history') {
        reportData = await this.generateAuctionHistory(userId);
      } else if (type === 'bid_history') {
        reportData = await this.generateBidHistory(userId);
      } else if (type === 'earnings') {
        reportData = await this.generateEarningsReport(userId);
      } else if (type === 'sales_summary') {
        reportData = await this.generateSalesSummary(userId);
      }
    } catch (err) {
      console.error('Error generating report data:', err);
      reportData = { error: 'Failed to fetch report data', details: err.message };
    }

    const report = this.reportRepository.create({
      user_id: userId,
      type,
      data: reportData,
      generated_at: new Date(),
    });

    return this.reportRepository.save(report);
  }

  async getReportById(reportId: number, userId: number): Promise<ReportEntity> {
    return this.reportRepository.findOne({
      where: { id: reportId, user_id: userId },
    });
  }

  async getUserReports(userId: number): Promise<ReportEntity[]> {
    return this.reportRepository.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
    });
  }

  async deleteReport(reportId: number, userId: number): Promise<void> {
    await this.reportRepository.delete({
      id: reportId,
      user_id: userId,
    });
  }

  private async generateAuctionHistory(userId: number): Promise<Record<string, any>> {
    try {
      // Placeholder: In real scenario, fetch from auctions-service
      return {
        total_auctions: 5,
        completed: 4,
        cancelled: 1,
        average_price: 150.00,
        currency: 'USD',
        period: 'all_time',
      };
    } catch (err) {
      console.error('Error fetching auction history:', err);
      return {};
    }
  }

  private async generateBidHistory(userId: number): Promise<Record<string, any>> {
    try {
      // Placeholder: In real scenario, fetch from bid-service
      return {
        total_bids: 12,
        successful_bids: 4,
        failed_bids: 8,
        average_bid_amount: 85.50,
        currency: 'USD',
        period: 'all_time',
      };
    } catch (err) {
      console.error('Error fetching bid history:', err);
      return {};
    }
  }

  private async generateEarningsReport(userId: number): Promise<Record<string, any>> {
    try {
      // Placeholder: In real scenario, fetch from payment-service
      return {
        total_earnings: 1250.50,
        total_transactions: 8,
        average_transaction: 156.31,
        currency: 'USD',
        period: '30_days',
      };
    } catch (err) {
      console.error('Error fetching earnings report:', err);
      return {};
    }
  }

  private async generateSalesSummary(userId: number): Promise<Record<string, any>> {
    try {
      // Placeholder: In real scenario, fetch from multiple services
      return {
        total_sales: 4,
        total_amount: 950.00,
        average_sale_value: 237.50,
        currency: 'USD',
        top_categories: ['Electronics', 'Home'],
      };
    } catch (err) {
      console.error('Error fetching sales summary:', err);
      return {};
    }
  }
}
