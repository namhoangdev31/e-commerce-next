import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './auth.jwt.strategy';
import { DatabaseModule } from '../../database/database.module';
import { SharedModule } from '../../shared/shared.module';

@Module({
  imports: [
    DatabaseModule,
    SharedModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        const expiresIn = configService.get('ACCESS_TOKEN_EXPIRES_IN');
        if (typeof expiresIn !== 'string' && typeof expiresIn !== 'number') {
          throw new Error('ACCESS_TOKEN_EXPIRES_IN must be a number or string');
        }
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: {
            expiresIn: expiresIn,
          },
        };
      },
      inject: [ConfigService],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 3,
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
