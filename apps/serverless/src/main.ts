import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as express from 'express';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();

  app.setGlobalPrefix(configService.get('API_PREFIX'));

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');

  const config = new DocumentBuilder()
    .setTitle('Pricesenz Backend API Docs')
    .setDescription('Pricesenz Backend API Docs and Structure')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-swagger', app, document);
  const port = configService.get<number>('NEST_PORT');
  await app.listen(port).then(() => {
    console.log(`API server started on port http://localhost:${port}/api`);
    console.log(`Swagger => http://localhost:${port}/api-swagger`);
  });
}
bootstrap();
