import { GlobalService } from './global.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { GlobalController } from './global.controller';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [GlobalController],
  providers: [GlobalService],
  exports: [GlobalService],
})
export class GlobalModule {}
