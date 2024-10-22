import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { ThrottlerModule } from '@nestjs/throttler'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { DatabaseModule } from '../../database/database.module'
import { SharedModule } from '../../shared/shared.module'
import { Error } from 'mongoose'
import process from 'process'
import { JwtAuthGuard } from './jwt-auth.guard'
import { APP_GUARD } from '@nestjs/core'
import { MailModule } from '../mail/mail.module'

@Module({
  imports: [
    DatabaseModule,
    SharedModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '30d',
        allowInsecureKeySizes: true,
      },
    }),
    MailModule,
  ],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
