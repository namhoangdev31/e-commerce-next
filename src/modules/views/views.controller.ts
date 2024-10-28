import { Controller, Get, Render } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { ViewsService } from './views.service'
import { CreateViewDto } from './dto/create-view.dto'
import { UpdateViewDto } from './dto/update-view.dto'
import { Public } from '../auth/decorators/public.decorator'
import { ApiTags } from '@nestjs/swagger'

@Controller()
@Public()
@ApiTags('Views')
export class ViewsController {
  constructor(private readonly viewsService: ViewsService) {}

  @Get()
  @Render('index')
  async index() {
    return {}
  }

  @Get('dashboard')
  @Render('src/dashboard')
  getDashboard(): object {
    return { title: 'Dashboard', subtitle: 'Subtitle' }
  }

  @Get('login')
  @Render('src/login')
  getLogin(): object {
    return { title: 'Login', subtitle: 'Subtitle' }
  }

  @Get('register')
  @Render('src/register')
  getRegister(): object {
    return { title: 'Register', subtitle: 'Subtitle' }
  }

  @Get('profile')
  @Render('src/profile')
  getProfile(): object {
    return { title: 'Profile', subtitle: 'Subtitle' }
  }

  @Get('content')
  @Render('src/content')
  getContent(): object {
    return { title: 'Content', subtitle: 'Subtitle' }
  }
}
