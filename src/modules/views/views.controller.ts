/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Get, Render } from '@nestjs/common';
import { ViewsService } from './views.service';

@Controller('admin')
export class ViewsController {
  constructor(private readonly viewsService: ViewsService) {}

  @Get('dashboard')
  @Render('src/dashboard')
  getDashboard(): object {
    return { title: 'Dashboard', subtitle: 'Subtitle' };
  }

  @Get('login')
  @Render('src/login')
  getLogin(): object {
    return { title: 'Login', subtitle: 'Subtitle' };
  }

  @Get('register')
  @Render('src/register')
  getRegister(): object {
    return { title: 'Register', subtitle: 'Subtitle' };
  }

  @Get('profile')
  @Render('src/profile')
  getProfile(): object {
    return { title: 'Profile', subtitle: 'Subtitle' };
  }
}
