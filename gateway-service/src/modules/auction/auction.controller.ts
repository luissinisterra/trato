import { Controller, Get, Post, Put, Patch, Delete, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuctionService } from './auction.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('auctions')
@UseGuards(JwtAuthGuard)
export class AuctionController {
  constructor(private readonly auctionService: AuctionService) {}

  @Get()
  @Post()
  @Put()
  @Patch()
  @Delete()
  forward(@Req() request: Request) {
    return this.auctionService.forward(request, request.url);
  }
}
