import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(data: {
    name: string;
    description?: string;
    category?: string;
    imageUrl?: string;
    ownerId: number;
  }): Promise<Product> {
    const product = new Product();
    product.name = data.name;
    product.description = data.description ?? '';
    product.category = data.category ?? 'OTHER';
    product.imageUrl = data.imageUrl ?? null;
    product.ownerId = data.ownerId;
    return this.productRepository.save(product);
  }

  async findByOwner(ownerId: number): Promise<Product[]> {
    return this.productRepository.find({ where: { ownerId }, order: { createdAt: 'DESC' } });
  }

  async findById(id: number): Promise<Product | null> {
    return this.productRepository.findOne({ where: { id } });
  }
}