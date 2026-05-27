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
  forwardRoot(@Req() request: Request) {
    return this.forward(request);
  }

  @All('*')
  forwardAll(@Req() request: Request) {
    return this.forward(request);
  }

  private forward(request: Request) {
    const path = request.path.replace(/^\/api/, '');
    return this.bidService.forward(request, path);
  }
}
