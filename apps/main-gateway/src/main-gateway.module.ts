import { Module } from '@nestjs/common';
import { MainGatewayController } from './main-gateway.controller';
import { MainGatewayService } from './main-gateway.service';

@Module({
  imports: [],
  controllers: [MainGatewayController],
  providers: [MainGatewayService],
})
export class MainGatewayModule {}
