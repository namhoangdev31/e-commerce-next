import { Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import process from 'process'

@Injectable()
export class SyncDataScheduleService {
  @Cron(CronExpression.EVERY_10_SECONDS, {
    timeZone: process.env.TIMEZONE,
  })
  async syncData() {
    Logger.error('ADD Setting')
  }
}
