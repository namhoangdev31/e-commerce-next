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

const requestIp = require('request-ip')

async function bootstrap() {
  // const { invalidCsrfTokenError, generateToken, validateRequest, doubleCsrfProtection } =
  //   doubleCsrf(doubleCsrfOptions)
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  const configService = app.get(ConfigService)

  app.useGlobalPipes(new ValidationPipe())
  // Cấu hình CORS (Cross-Origin Resource Sharing) cho ứng dụng
  app.enableCors()
  app.use(requestIp.mw())
  // app.use(doubleCsrfProtection)

  app.useStaticAssets(join(__dirname, '..', 'public'))
  app.setBaseViewsDir(join(__dirname, '..', 'views'))
  app.setViewEngine('ejs')

  const config = new DocumentBuilder()
    .setTitle('Welcome to Smart API Docs')
    .setDescription('Smart API Docs and Structure')
    .setVersion('1.0')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, config)

  SwaggerModule.setup('docs', app, document)

  app.use(
    '/swagger',
    swaggerUI.serve,
    swaggerUI.setup(document, {
      customSiteTitle: 'Smart API Documentation',
      swaggerOptions: {
        persistAuthorization: true,
      },
    }),
  )

  const port = process.env.NEST_PORT || 3000
  await app.listen(port)

  console.log(`Server is running on port http://localhost:${port}/swagger`)
}

bootstrap()
