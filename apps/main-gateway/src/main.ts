import { NestFactory } from '@nestjs/core';
import { MainGatewayModule } from './main-gateway.module';

async function bootstrap() {
  const app = await NestFactory.create(MainGatewayModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
