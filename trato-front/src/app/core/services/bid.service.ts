import { Injectable } from '@angular/core';
import { ApiClientService } from './api-client.service';
import { Bid, ApiResponse } from '../models/auction.models';

@Injectable({ providedIn: 'root' })
export class BidService {
  constructor(private readonly api: ApiClientService) {}

  getAll(params?: { auction_id?: number; user_id?: number; status?: string }) {
    const query = params
      ? '?' + Object.entries(params)
          .filter(([, v]) => v !== undefined)
          .map(([k, v]) => `${k}=${v}`)
          .join('&')
      : '';
    return this.api.get<ApiResponse<Bid[]>>(`/bids${query}`);
  }

  getById(id: number) {
    return this.api.get<ApiResponse<Bid>>(`/bids/${id}`);
  }

  create(payload: { auctionId: number; userId: number; amount: number }) {
    return this.api.post<ApiResponse<Bid>>('/bids', payload);
  }

  updateAmount(id: number, amount: number) {
    return this.api.put<ApiResponse<Bid>>(`/bids/${id}/amount`, { amount });
  }

  updateStatus(id: number, status: string) {
    return this.api.patch<ApiResponse<Bid>>(`/bids/${id}/status`, { status });
  }

  remove(id: number) {
    return this.api.delete<ApiResponse<{ message?: string }>>(`/bids/${id}`);
  }
}
