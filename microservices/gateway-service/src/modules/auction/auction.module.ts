import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AuctionController } from './auction.controller';
import { AuctionService } from './auction.service';
import { ProxyService } from '../../common/proxy/proxy.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Module({
  imports: [HttpModule],
  controllers: [AuctionController],
  providers: [AuctionService, ProxyService, JwtAuthGuard],
})
export class AuctionModule {}
