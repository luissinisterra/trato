import { Injectable } from '@angular/core';
import { ApiClientService } from './api-client.service';
import { CreateProductPayload, Product } from '../models/product.models';

@Injectable({ providedIn: 'root' })
export class ProductService {
  constructor(private readonly api: ApiClientService) {}

  getAll() {
    return this.api.get<{ success: boolean; data: Product[] }>('/products');
  }

  getById(id: number) {
    return this.api.get<{ success: boolean; data: Product }>(`/products/${id}`);
  }

  create(payload: CreateProductPayload) {
    return this.api.post<{ success: boolean; data: Product }>('/products', payload);
  }
}
