import { Controller, Get } from '@nestjs/common';
import { AdminGatewayService } from './admin-gateway.service';

@Controller()
export class AdminGatewayController {
  constructor(private readonly adminGatewayService: AdminGatewayService) {}

  @Get()
  getHello(): string {
    return this.adminGatewayService.getHello();
  }
}
