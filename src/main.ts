import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AppModule } from './app.module'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { NestExpressApplication } from '@nestjs/platform-express'
import { join } from 'path'
import process from 'process'
import { doubleCsrf } from 'csrf-csrf'
import * as swaggerUI from 'swagger-ui-express'
import { HttpExceptionFilter } from './shared/exceptions/http-exception-filter.exception'

import requestIp from 'request-ip'

async function bootstrap() {
  // const { invalidCsrfTokenError, generateToken, validateRequest, doubleCsrfProtection } =
  //   doubleCsrf(doubleCsrfOptions)
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  const configService = app.get(ConfigService)

  app.useGlobalPipes(new ValidationPipe())
  app.enableCors()
  app.use(requestIp.mw())
  // app.use(doubleCsrfProtection)
  app.setViewEngine('ejs')
  app.useStaticAssets(join(__dirname, '..', 'public'))
  app.setBaseViewsDir(join(__dirname, '..', 'views'))

  const config = new DocumentBuilder()
    .setTitle('Welcome to Smart API Docs')
    .setDescription('Smart API Docs and Structure')
    .setVersion('1.0')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, config)

  SwaggerModule.setup('docs', app, document, {
    customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.js',
    ],
  })

  const port = process.env.NEST_PORT || 3000
  await app.listen(port)

  console.log(`Server is running on port http://localhost:${port}/admin`)
}

bootstrap()
