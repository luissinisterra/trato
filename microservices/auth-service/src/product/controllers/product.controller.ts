import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from '../services/product.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import type { AuthUserRequest } from '../../common/types/auth-user-request.type';

@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async create(
    @Body() body: {
      name: string;
      description?: string;
      category?: string;
      imageUrl?: string;
      ownerId?: number;
    },
    @Req() req: AuthUserRequest,
  ) {
    const userId = req.user!.sub;
    const product = await this.productService.create({
      name: body.name,
      description: body.description,
      category: body.category,
      imageUrl: body.imageUrl,
      ownerId: body.ownerId || userId,
    });
    return { success: true, data: product };
  }

  @Get()
  async list(@Req() req: AuthUserRequest) {
    const userId = req.user!.sub;
    const products = await this.productService.findByOwner(userId);
    return { success: true, data: products };
  }

  @Get(':id')
  async get(@Param('id') id: string, @Req() req: AuthUserRequest) {
    const userId = req.user!.sub;
    const product = await this.productService.findById(Number(id));
    if (!product) {
      return { success: false, message: 'Product not found' };
    }
    return { success: true, data: product };
  }
}