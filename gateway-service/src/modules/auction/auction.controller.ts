import { Controller, All, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuctionService } from './auction.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('auctions')
@UseGuards(JwtAuthGuard)
export class AuctionController {
  constructor(private readonly auctionService: AuctionService) {}

  @All()
  @All('*path')
  forward(@Req() request: Request) {
    const path = request.path;
    return this.auctionService.forward(request, path);
  }
}
