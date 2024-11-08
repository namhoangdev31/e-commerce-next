import { Module } from '@nestjs/common'
import { ModuleService } from './module.service'
import { ModuleController } from './module.controller'
import { DatabaseModule } from '../../database/database.module'

@Module({
  imports: [DatabaseModule],
  controllers: [ModuleController],
  providers: [ModuleService],
})
export class ModuleModule {}
