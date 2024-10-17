/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Get } from '@nestjs/common';

@Controller('/global-settings')
export class GlobalController {
  @Get()
  async getAll() {
    return 'âsdasd';
  }
}
