import { Controller, Get } from '@nestjs/common'
import { SyncDataScheduleService } from './sync-data-schedule.service'
import { ApiExcludeEndpoint } from '@nestjs/swagger'

@Controller('syncDataSchedule')
export class SyncDataScheduleController {
  constructor(private readonly syncDataScheduleService: SyncDataScheduleService) {}

  @Get()
  @ApiExcludeEndpoint()
  syncData() {
    return this.syncDataScheduleService.syncDataURL()
  }
}
