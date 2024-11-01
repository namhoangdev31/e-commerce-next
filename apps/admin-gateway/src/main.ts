import { NestFactory } from '@nestjs/core';
import { AdminGatewayModule } from './admin-gateway.module';

async function bootstrap() {
  const app = await NestFactory.create(AdminGatewayModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
