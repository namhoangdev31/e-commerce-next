import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return 'Hello World!';
  }

  @Get('index')
  @Render('index')
  getIndex(): object {
    return { title: 'Title', subtitle: 'Subtitle' };
  }

  @Get('dashboard')
  @Render('dashboard/dashboard')
  getDashboard(): object {
    return { title: 'Dashboard', subtitle: 'Subtitle' };
  }
}
