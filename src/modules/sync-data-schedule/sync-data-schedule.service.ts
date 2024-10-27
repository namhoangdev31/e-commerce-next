import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import process from 'process'
import { RolesRepository } from '../../database/repositories/roles.repository'

@Injectable()
export class SyncDataScheduleService {
  constructor(private readonly rolesRepository: RolesRepository) {}
  @Cron(CronExpression.EVERY_DAY_AT_1PM, {
    timeZone: process.env.TIMEZONE,
  })
  async syncData() {
    Logger.error('ADD Setting')
  }

  async syncDataURL() {
    try {
      await this.rolesRepository.syncRolesFromMySQLToMongoDB()
      Logger.warn('Successfully synced data')
      return {
        message: 'Successfully synced data',
      }
    } catch (error) {
      Logger.error('Error syncing data', error)
      throw new InternalServerErrorException(error)
    }
  }
}
