import { Controller, All, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuctionService } from './auction.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

/**
 * AuctionController
 *
 * Rutas protegidas — requieren JWT válido:
 *   GET|POST|PUT|PATCH|DELETE /auctions/*  → auction-service (Spring Boot :3003)
 */
@Controller('auctions')
@UseGuards(JwtAuthGuard)
export class AuctionController {
  constructor(private readonly auctionService: AuctionService) {}

  @All('*path')
  forward(@Req() request: Request) {
    const path = request.path;
    return this.auctionService.forward(request, path);
  }
}
