import { Module } from '@nestjs/common'
import { SyncDataScheduleController } from './sync-data-schedule.controller'
import { SyncDataScheduleService } from './sync-data-schedule.service'
import { DatabaseModule } from '../../database/database.module'

@Module({
  imports: [DatabaseModule],
  controllers: [SyncDataScheduleController],
  providers: [SyncDataScheduleService],
  exports: [],
})
export class SyncDataScheduleModule {}
