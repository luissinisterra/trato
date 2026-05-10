import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { BidController } from './bid.controller';
import { BidService } from './bid.service';
import { ProxyService } from '../../common/proxy/proxy.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Module({
  imports: [HttpModule],
  controllers: [BidController],
  providers: [BidService, ProxyService, JwtAuthGuard],
})
export class BidModule {}
