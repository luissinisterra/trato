import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReportEntity } from '../entities/report.entity';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ReportService {
  private readonly auctionsServiceUrl: string;
  private readonly bidServiceUrl: string;
  private readonly paymentServiceUrl: string;
  private readonly userServiceUrl: string;

  constructor(
    @InjectRepository(ReportEntity)
    private readonly reportRepository: Repository<ReportEntity>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.auctionsServiceUrl = this.configService.get<string>('AUCTIONS_SERVICE_URL', 'http://localhost:3003');
    this.bidServiceUrl = this.configService.get<string>('BID_SERVICE_URL', 'http://localhost:3005');
    this.paymentServiceUrl = this.configService.get<string>('PAYMENT_SERVICE_URL', 'http://localhost:3006');
    this.userServiceUrl = this.configService.get<string>('USER_SERVICE_URL', 'http://localhost:3002');
  }

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
      const auctions = await this.getUserAuctions(userId);
      const statusCounts = auctions.reduce(
        (acc, auction) => {
          const status = String(auction.status || '').toLowerCase();
          if (status === 'closed') acc.completed += 1;
          else if (status === 'cancelled') acc.cancelled += 1;
          else if (status === 'active' || status === 'scheduled') acc.active += 1;
          return acc;
        },
        { completed: 0, cancelled: 0, active: 0 },
      );

      const totalAuctions = auctions.length;
      const averagePrice = totalAuctions
        ? auctions.reduce((sum, auction) => {
            const price = Number(auction.currentPrice ?? auction.startPrice ?? 0);
            return sum + (Number.isFinite(price) ? price : 0);
          }, 0) / totalAuctions
        : 0;

      return {
        total_auctions: totalAuctions,
        completed: statusCounts.completed,
        cancelled: statusCounts.cancelled,
        active: statusCounts.active,
        average_price: Number(averagePrice.toFixed(2)),
        currency: 'USD',
        period: 'all_time',
      };
    } catch (err) {
      console.error('Error fetching auction history:', err);
      return { error: 'Unable to calculate auction history', details: err.message };
    }
  }

  private async generateBidHistory(userId: number): Promise<Record<string, any>> {
    try {
      const bids = await this.getUserBids(userId);
      const successfulBids = bids.filter((bid) => ['accepted'].includes(String(bid.status || '').toLowerCase())).length;
      const failedBids = bids.filter((bid) => ['rejected', 'cancelled'].includes(String(bid.status || '').toLowerCase())).length;
      const averageBidAmount = bids.length
        ? bids.reduce((sum, bid) => sum + Number(bid.amount ?? 0), 0) / bids.length
        : 0;

      return {
        total_bids: bids.length,
        successful_bids: successfulBids,
        failed_bids: failedBids,
        pending_bids: bids.filter((bid) => String(bid.status || '').toLowerCase() === 'pending').length,
        average_bid_amount: Number(averageBidAmount.toFixed(2)),
        currency: 'USD',
        period: 'all_time',
      };
    } catch (err) {
      console.error('Error fetching bid history:', err);
      return { error: 'Unable to calculate bid history', details: err.message };
    }
  }

  private async generateEarningsReport(userId: number): Promise<Record<string, any>> {
    try {
      const auctions = await this.getUserAuctions(userId);
      const paymentLists = await Promise.all(
        auctions.map((auction) => this.getPaymentsForAuction(auction.id)),
      );
      const payments = paymentLists.flat();
      const completedPayments = payments.filter((payment) => String(payment.status || '').toLowerCase() === 'completed');
      const totalEarnings = completedPayments.reduce((sum, payment) => sum + Number(payment.amount ?? 0), 0);
      const totalTransactions = completedPayments.length;
      const averageTransaction = totalTransactions ? totalEarnings / totalTransactions : 0;
      const pendingTransactions = payments.filter((payment) => String(payment.status || '').toLowerCase() === 'pending').length;

      return {
        total_earnings: Number(totalEarnings.toFixed(2)),
        total_transactions: totalTransactions,
        average_transaction: Number(averageTransaction.toFixed(2)),
        pending_transactions: pendingTransactions,
        currency: 'USD',
        period: 'all_time',
      };
    } catch (err) {
      console.error('Error fetching earnings report:', err);
      return { error: 'Unable to calculate earnings', details: err.message };
    }
  }

  private async generateSalesSummary(userId: number): Promise<Record<string, any>> {
    try {
      const auctions = await this.getUserAuctions(userId);
      const paymentLists = await Promise.all(
        auctions.map((auction) => this.getPaymentsForAuction(auction.id)),
      );
      const payments = paymentLists.flat();
      const completedPayments = payments.filter((payment) => String(payment.status || '').toLowerCase() === 'completed');
      const totalSales = completedPayments.length;
      const totalAmount = completedPayments.reduce((sum, payment) => sum + Number(payment.amount ?? 0), 0);
      const averageSaleValue = totalSales ? totalAmount / totalSales : 0;
      const topAuctions = Object.entries(
        completedPayments.reduce((acc, payment) => {
          const auctionId = payment.auction_id ?? payment.auctionId ?? 'unknown';
          acc[auctionId] = (acc[auctionId] || 0) + Number(payment.amount ?? 0);
          return acc;
        }, {} as Record<string, number>),
      )
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([auctionId]) => auctionId);

      return {
        total_sales: totalSales,
        total_amount: Number(totalAmount.toFixed(2)),
        average_sale_value: Number(averageSaleValue.toFixed(2)),
        currency: 'USD',
        completed_auctions: auctions.filter((auction) => String(auction.status || '').toLowerCase() === 'closed').length,
        top_auction_ids: topAuctions,
        period: 'all_time',
      };
    } catch (err) {
      console.error('Error fetching sales summary:', err);
      return { error: 'Unable to calculate sales summary', details: err.message };
    }
  }

  private async getAllAuctions(): Promise<any[]> {
    const raw = await this.fetchFromService<any>(`${this.auctionsServiceUrl}/auctions`);
    return this.unwrapResponseArray(raw);
  }

  private async getUserAuctions(userId: number): Promise<any[]> {
    const auctions = await this.getAllAuctions();
    return auctions.filter((auction) => {
      const sellerId = auction.sellerId ?? auction.seller_id;
      return Number(sellerId) === Number(userId);
    });
  }

  private async getUserBids(userId: number): Promise<any[]> {
    const raw = await this.fetchFromService<any>(`${this.bidServiceUrl}/bids?user_id=${userId}`);
    return this.unwrapResponseArray(raw);
  }

  private async getPaymentsForAuction(auctionId: number): Promise<any[]> {
    const raw = await this.fetchFromService<any>(`${this.paymentServiceUrl}/payments/auction/${auctionId}`);
    return this.unwrapResponseArray(raw);
  }

  private unwrapResponseArray(raw: any): any[] {
    if (Array.isArray(raw)) {
      return raw;
    }
    if (raw && Array.isArray(raw.data)) {
      return raw.data;
    }
    return [];
  }

  private async fetchFromService<T>(url: string): Promise<T> {
    const response = await lastValueFrom(this.httpService.get<T>(url, { timeout: 10000 }));
    return response.data as T;
  }
}
