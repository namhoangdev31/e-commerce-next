import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import process from 'process'
import { RolesRepository } from '../../database/repositories/roles.repository'
import { UsersRepository } from '../../database/repositories/users.repository'

@Injectable()
export class SyncDataScheduleService {
  constructor(
    private readonly rolesRepository: RolesRepository,
    private readonly userRepository: UsersRepository,
  ) {}
  @Cron(CronExpression.EVERY_DAY_AT_1PM, {
    timeZone: process.env.TIMEZONE,
  })
  async syncData() {
    Logger.error('ADD Setting')
  }

  async syncDataURL() {
    try {
      await this.rolesRepository.syncRolesFromMySQLToMongoDB()
      await this.userRepository.syncUsersFromMySQLToMongoDB()
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
