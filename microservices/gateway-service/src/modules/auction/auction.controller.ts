import { Controller, All, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuctionService } from './auction.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('auctions')
@UseGuards(JwtAuthGuard)
export class AuctionController {
  constructor(private readonly auctionService: AuctionService) {}

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
    return this.auctionService.forward(request, path);
  }
}
