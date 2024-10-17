import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  getHello(): object {
    return { title: 'Title', subtitle: 'Subtitle' };
  }

  @Get('dashboard')
  @Render('dashboard/dashboard')
  getDashboard(): object {
    return { title: 'Dashboard', subtitle: 'Subtitle' };
  }
}
