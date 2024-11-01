import { Module } from '@nestjs/common';
import { AdminGatewayController } from './admin-gateway.controller';
import { AdminGatewayService } from './admin-gateway.service';

@Module({
  imports: [],
  controllers: [AdminGatewayController],
  providers: [AdminGatewayService],
})
export class AdminGatewayModule {}
