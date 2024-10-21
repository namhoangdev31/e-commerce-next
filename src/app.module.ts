import { GlobalModule } from './modules/global/global.module'
import { HeaderModule } from './modules/header/header.module'
import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { DatabaseModule } from './database/database.module'
import { SharedModule } from './shared/shared.module'
import { AuthModule } from './modules/auth/auth.module'
import { StreamModule } from './modules/stream/stream.module'
import { CallModule } from './modules/call/call.module'
import { ViewsModule } from './modules/views/views.module'
import { ClassModule } from './modules/class/class.module'
import { UsersModule } from './modules/users/users.module'
import { MessagesModule } from './modules/messages/messages.module'
import { RolesModule } from './modules/roles/roles.module'
import { RouterModule } from '@nestjs/core'

export const API_PREFIX = process.env.API_PREFIX || 'api'
export const ADMIN_PREFIX = process.env.ADMIN_PREFIX || 'admin'

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
    CallModule,
    ClassModule,
    GlobalModule,
    HeaderModule,
    MessagesModule,
    RolesModule,
    SharedModule,
    StreamModule,
    UsersModule,
    ViewsModule,
    RouterModule.register([
      { path: ADMIN_PREFIX, module: ViewsModule },
      {
        path: API_PREFIX,
        children: [
          { path: '/', module: HeaderModule },
          { path: '/', module: GlobalModule },
          { path: '/', module: UsersModule },
          { path: '/', module: AuthModule },
          { path: '/', module: SharedModule },
          { path: '/', module: RolesModule },
          { path: '/', module: ClassModule },
        ],
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
