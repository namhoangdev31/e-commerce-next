import { GlobalModule } from './modules/global/global.module';
import { HeaderModule } from './modules/header/header.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseModule } from './database/database.module';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './modules/auth/auth.module';
import { StreamModule } from './modules/stream/stream.module';
import { CallModule } from './modules/call/call.module';
import { ViewsModule } from './modules/views/views.module';
import { ClassModule } from './modules/class/class.module';
import { UsersModule } from './modules/users/users.module';
import { MessagesModule } from './modules/messages/messages.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DB_URL'),
      }),
      inject: [ConfigService],
    }),
    DatabaseModule,
    AuthModule,
    SharedModule,
    HeaderModule,
    GlobalModule,
    ViewsModule,
    StreamModule,
    CallModule,
    ClassModule,
    UsersModule,
    MessagesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
