import { Controller, Get } from '@nestjs/common';
import { MainGatewayService } from './main-gateway.service';

@Controller()
export class MainGatewayController {
  constructor(private readonly mainGatewayService: MainGatewayService) {}

  @Get()
  getHello(): string {
    return this.mainGatewayService.getHello();
  }
}
