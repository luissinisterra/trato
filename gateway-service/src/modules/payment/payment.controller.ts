import { Controller, All, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

/**
 * PaymentController
 *
 * Rutas protegidas — requieren JWT válido:
 *   GET|POST|PUT|PATCH|DELETE /payments/*  → payment-service (:3006)
 */
@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @All()
  @All('*path')
  forward(@Req() request: Request) {
    const path = request.path;
    return this.paymentService.forward(request, path);
  }
}
