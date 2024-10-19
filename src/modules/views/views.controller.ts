import {Controller, Get, Render} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ViewsService } from './views.service';
import { CreateViewDto } from './dto/create-view.dto';
import { UpdateViewDto } from './dto/update-view.dto';

@Controller('admin')
export class ViewsController {
  constructor(private readonly viewsService: ViewsService) {}

  @MessagePattern('createView')
  create(@Payload() createViewDto: CreateViewDto) {
    return this.viewsService.create(createViewDto);
  }

  @MessagePattern('findAllViews')
  findAll() {
    return this.viewsService.findAll();
  }

  @MessagePattern('findOneView')
  findOne(@Payload() id: number) {
    return this.viewsService.findOne(id);
  }

  @MessagePattern('updateView')
  update(@Payload() updateViewDto: UpdateViewDto) {
    return this.viewsService.update(updateViewDto.id, updateViewDto);
  }

  @MessagePattern('removeView')
  remove(@Payload() id: number) {
    return this.viewsService.remove(id);
  }


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
