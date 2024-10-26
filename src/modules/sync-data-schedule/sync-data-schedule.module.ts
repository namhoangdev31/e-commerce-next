import { Module } from '@nestjs/common'
import { SyncDataScheduleController } from './sync-data-schedule.controller'
import { SyncDataScheduleService } from './sync-data-schedule.service'

@Module({
  imports: [],
  controllers: [SyncDataScheduleController],
  providers: [SyncDataScheduleService],
  exports: [],
})
export class SyncDataScheduleModule {}
