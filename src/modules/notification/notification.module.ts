import { Module } from '@nestjs/common'

import { FirebaseModule } from 'nestjs-firebase'
import { NotificationService } from './notification.service'

@Module({
  imports: [FirebaseModule],
  providers: [NotificationService],
})
export class NotificationModule {}
