import { HeaderService } from './header.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { HeaderController } from './header.controller';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [HeaderController],
  providers: [HeaderService],
  exports: [HeaderService],
})
export class HeaderModule {}
