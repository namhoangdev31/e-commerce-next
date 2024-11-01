import { Module } from '@nestjs/common'
import { DatabaseModule } from '../../database/database.module'
import { SyncDataScheduleService } from './sync-data-schedule.service'
import { SyncDataScheduleController } from './sync-data-schedule.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RoleEntity } from '../../database/entity/role.entity'

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([RoleEntity])],
  controllers: [SyncDataScheduleController],
  providers: [SyncDataScheduleService],
  exports: [],
})
export class SyncDataScheduleModule {}
