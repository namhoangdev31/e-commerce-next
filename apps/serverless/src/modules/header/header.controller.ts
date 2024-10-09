/*
https://docs.nestjs.com/controllers#controllers
*/

import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { HeaderDto } from './dto/header.dto';
import { HeaderService } from './header.service';
import { NavItemDto } from './dto/navItem.dto';

@Controller('/header')
export class HeaderController {
  constructor(private headerService: HeaderService) {}

  @Post('create-header')
  @HttpCode(HttpStatus.OK)
  // @UseGuards(JwtAuthGuard)
  async createHeader(@Body() dto: HeaderDto) {
    return this.headerService.createHeader(dto);
  }

  @Post('add-nav-items')
  @HttpCode(HttpStatus.OK)
  async addNavItems(@Body() dto: NavItemDto) {
    return this.headerService.addNavItems(dto);
  }

  @Get()
  async getAll() {
    return this.headerService.getHeader();
  }
}
