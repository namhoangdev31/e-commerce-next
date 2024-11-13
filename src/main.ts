import { NestFactory } from '@nestjs/core'
import { ValidationPipe, VersioningType } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AppModule } from './app.module'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { NestExpressApplication } from '@nestjs/platform-express'
import { join } from 'path'
import process from 'process'
import compression from 'compression' // Changed from * as compression to default import
import requestIp from 'request-ip'

async function bootstrap() {
  // const { invalidCsrfTokenError, generateToken, validateRequest, doubleCsrfProtection } =
  //   doubleCsrf(doubleCsrfOptions)
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  const configService = app.get(ConfigService)

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  )
  app.enableCors()
  app.use(compression()) // Corrected the usage of compression
  app.use(requestIp.mw())
  // app.use(doubleCsrfProtection)
  app.enableVersioning({
    type: VersioningType.URI,
  })
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

//update the .env file with the following values:
