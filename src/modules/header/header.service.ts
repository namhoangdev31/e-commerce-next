/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { HeaderDto } from './dto/header.dto';
import { HeaderRepository } from '../../database/repositories/header.repository';
import { NavItemDto } from './dto/navItem.dto';

@Injectable()
export class HeaderService {
  constructor(private readonly headerRepository: HeaderRepository) {}
  async createHeader(dto: HeaderDto) {
    return this.headerRepository.create(dto);
  }

  async getHeader() {
    return this.headerRepository.findAll();
  }

  async addNavItems(dto: NavItemDto) {
    return this.headerRepository.addNavItems(dto);
  }
}
