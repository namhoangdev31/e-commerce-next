import { Controller, Get } from '@nestjs/common'
import { SyncDataScheduleService } from './sync-data-schedule.service'
import { ApiExcludeEndpoint } from '@nestjs/swagger'
import { Public } from '../auth/decorators/public.decorator'
import { PROD_ENV } from '../../shared/constants/strings.constants'
import { AuthController } from '../auth/auth.controller'

@Controller('syncDataSchedule')
export class SyncDataScheduleController {
  constructor(private readonly syncDataScheduleService: SyncDataScheduleService) {}

  @Get()
  @Public()
  syncData() {
    return this.syncDataScheduleService.syncDataURL()
  }
}

const isProduction = process.env.NODE_ENV === PROD_ENV

if (isProduction) {
  ApiExcludeEndpoint()(
    SyncDataScheduleController.prototype,
    'syncData',
    Object.getOwnPropertyDescriptor(SyncDataScheduleController.prototype, 'syncData'),
  )
}
