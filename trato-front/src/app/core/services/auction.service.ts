import { Injectable } from '@angular/core';
import { ApiClientService } from './api-client.service';
import { Auction, ApiResponse } from '../models/auction.models';

@Injectable({ providedIn: 'root' })
export class AuctionService {
  constructor(private readonly api: ApiClientService) {}

  getAll() {
    return this.api.get<ApiResponse<Auction[]>>('/auctions');
  }

  getById(id: number) {
    return this.api.get<Auction>(`/auctions/${id}`);
  }

  create(payload: any) {
    return this.api.post<ApiResponse<Auction>>('/auctions', payload);
  }

  createProduct(payload: any) {
    return this.api.post<any>('/products', payload);
  }

  update(id: number, payload: any) {
    return this.api.put<ApiResponse<Auction>>(`/auctions/${id}`, payload);
  }

  remove(id: number) {
    return this.api.delete<ApiResponse<{ message?: string }>>(`/auctions/${id}`);
  }
}
