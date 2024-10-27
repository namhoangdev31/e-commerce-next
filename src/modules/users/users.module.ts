import { Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { JwtModule } from '@nestjs/jwt'
import process from 'process'
import { DatabaseModule } from '../../database/database.module'
import { MailModule } from '../mail/mail.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersEntities } from '../../database/entity/user.entity'

@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '30d',
        allowInsecureKeySizes: true,
      },
    }),
    MailModule,
    TypeOrmModule.forFeature([UsersEntities]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
