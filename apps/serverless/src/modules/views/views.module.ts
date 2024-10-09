import { ViewsController } from './views.controller';
import { ViewsService } from './views.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [ViewsController],
  providers: [ViewsService],
})
export class ViewsModule {}
