import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import * as https from 'https';

import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { AuctionModule } from './modules/auction/auction.module';
import { ProductModule } from './modules/product/product.module';
import { BidModule } from './modules/bid/bid.module';
import { PaymentModule } from './modules/payment/payment.module';
import { ReportModule } from './modules/report/report.module';
import { NotificationModule } from './modules/notification/notification.module';
import { AgentModule } from './modules/agent/agent.module';

@Module({
  imports: [
    // ConfigModule global — carga .env en toda la aplicación
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // HttpModule global — disponible en todos los módulos
    HttpModule.register({
      timeout: 10000,
      maxRedirects: 3,
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    }),

    // Módulos de cada microservicio
    AuthModule,
    UserModule,
    AuctionModule,
    ProductModule,
    BidModule,
    PaymentModule,
    ReportModule,
    NotificationModule,
    AgentModule,
  ],
})
export class AppModule {}
