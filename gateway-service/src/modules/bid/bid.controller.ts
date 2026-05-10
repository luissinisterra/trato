import { Controller, All, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { BidService } from './bid.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

/**
 * BidController
 *
 * Rutas protegidas — requieren JWT válido:
 *   GET|POST /bids/*  → bid-service (:3005)
 */
@Controller('bids')
@UseGuards(JwtAuthGuard)
export class BidController {
  constructor(private readonly bidService: BidService) {}

  @All()
  @All('*path')
  forward(@Req() request: Request) {
    const path = request.path;
    return this.bidService.forward(request, path);
  }
}
