import { Controller, Get } from '@nestjs/common'
import { SyncDataScheduleService } from './sync-data-schedule.service'
import { ApiExcludeEndpoint } from '@nestjs/swagger'
import { Public } from '../auth/decorators/public.decorator'

@Controller('syncDataSchedule')
export class SyncDataScheduleController {
  constructor(private readonly syncDataScheduleService: SyncDataScheduleService) {}

  @Get()
  @ApiExcludeEndpoint()
  @Public()
  syncData() {
    return this.syncDataScheduleService.syncDataURL()
  }
}
