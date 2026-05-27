import { Controller, All, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { ProductService } from './product.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

/**
 * ProductController
 *
 * Rutas protegidas — requieren JWT válido:
 *   GET|POST|PUT|PATCH|DELETE /products/*  → product-service (Go + Gin :3004)
 */
@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @All()
  forwardRoot(@Req() request: Request) {
    return this.forward(request);
  }

  @All('*')
  forwardAll(@Req() request: Request) {
    return this.forward(request);
  }

  private forward(request: Request) {
    const path = request.path.replace(/^\/api\/products/, '');
    return this.productService.forward(request, `/products${path}`);
  }
}
