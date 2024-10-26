import { Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import process from 'process'

@Injectable()
export class SyncDataScheduleService {
  @Cron(CronExpression.EVERY_DAY_AT_1AM, {
    timeZone: process.env.TIMEZONE,
  })
  async syncData() {
    Logger.error('ADD Setting')
  }

  async syncDataURL() {
    Logger.error('ADD Setting')
  }
}
