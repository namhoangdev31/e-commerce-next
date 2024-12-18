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
import { MailerModule } from '@nestjs-modules/mailer'
import { MailModule } from './modules/mail/mail.module'
import { ThrottlerModule } from '@nestjs/throttler'
import { join } from 'path'
import process from 'process'
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ScheduleModule } from '@nestjs/schedule'
import { SyncDataScheduleModule } from './modules/sync-data-schedule/sync-data-schedule.module'
import { UsersEntities } from './database/entity/user.entity'
import { UserRolesEntity } from './database/entity/user-roles.entity'
import { RoleEntity } from './database/entity/role.entity'
import { BadgesEntity } from './database/entity/badges.entity'
import { PermissionsEntity } from './database/entity/permissions.entity'
import { ModulesEntity } from './database/entity/modules.entity'
import { UserSkillEntity } from './database/entity/user-skill.entity'
import { UserSessionEntity } from './database/entity/user-session.entity'
import { RolePermissionsEntity } from './database/entity/role-permissions.entity'
import { SkillsEntity } from './database/entity/skills.entity'
import { DEV_ENV } from './shared/constants/strings.constants'
import { FirebaseModule } from 'nestjs-firebase'
import { NotificationModule } from './modules/notification/notification.module'
import { CdnServiceModule } from './modules/cdn-service/cdn-service.module'
import { ModuleModule } from './modules/module/module.module'
import { GroupsModule } from './modules/groups/groups.module'
import { NonUserModule } from './modules/non-user/non-user.module'

export const API_PREFIX = process.env.API_PREFIX || 'api'
export const ADMIN_PREFIX = process.env.ADMIN_PREFIX || 'admin'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DB_URL'),
      }),
      inject: [ConfigService],
    }),
    // process.env.NODE_ENV === DEV_ENV
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as any,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      synchronize: true,
      retryAttempts: 3,
      timezone: '+07:00',
      entities: [
        UsersEntities,
        PermissionsEntity,
        RoleEntity,
        ModulesEntity,
        UserRolesEntity,
        BadgesEntity,
        UserSkillEntity,
        UserSessionEntity,
        RolePermissionsEntity,
        SkillsEntity,
      ],
      retryDelay: 3000,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 300,
        limit: 10,
      },
    ]),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.APP_MAIL,
          pass: process.env.APP_PASSWORD,
        },
      },
      defaults: {
        from: '"No Reply" <no-reply@example.com>',
      },
      template: {
        dir: join(__dirname, '..', 'views'),
        adapter: new EjsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    FirebaseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        googleApplicationCredential: {
          type: process.env.FIREBASE_TYPE,
          projectId: process.env.FIREBASE_PROJECT_ID,
          privateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID,
          privateKey: process.env.FIREBASE_PRIVATE_KEY,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          clientId: process.env.FIREBASE_CLIENT_ID,
          authUri: process.env.FIREBASE_AUTH_URI,
          tokenUri: process.env.FIREBASE_TOKEN_URI,
          authProviderX509CertUrl: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
          clientX509CertUrl: process.env.FIREBASE_CLIENT_X509_CERT_URL,
          universeDomain: process.env.FIREBASE_UNIVERSE_DOMAIN,
        },
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
    ModuleModule,
    RouterModule.register([
      { path: ADMIN_PREFIX, module: ViewsModule },
      {
        path: '/',
        children: [
          { path: '/', module: HeaderModule },
          { path: '/', module: GlobalModule },
          { path: '/', module: UsersModule },
          { path: '/', module: AuthModule },
          { path: '/', module: SharedModule },
          { path: '/', module: RolesModule },
          { path: '/', module: ClassModule },
          { path: '/db', module: SyncDataScheduleModule },
          { path: '/', module: ModuleModule },
          {
            path: '/',
            module: NonUserModule,
          },
        ],
      },
    ]),
    MailModule,
    SyncDataScheduleModule,
    NotificationModule,
    CdnServiceModule,
    GroupsModule,
    NonUserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [FirebaseModule],
})
export class AppModule {}
