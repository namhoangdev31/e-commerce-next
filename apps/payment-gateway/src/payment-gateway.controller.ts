import { Controller, Get } from '@nestjs/common';
import { PaymentGatewayService } from './payment-gateway.service';

@Controller()
export class PaymentGatewayController {
  constructor(private readonly paymentGatewayService: PaymentGatewayService) {}

  @Get()
  getHello(): string {
    return this.paymentGatewayService.getHello();
  }
}
