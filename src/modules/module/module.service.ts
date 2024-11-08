import { Injectable } from '@nestjs/common'
import { CreateModuleDto } from './dto/create-module.dto'
import { UpdateModuleDto } from './dto/update-module.dto'
import { GetListDto } from '../users/dto/get-list.dto'
import { PageSizeInterface } from '../../interfaces/page-size.interface'

@Injectable()
export class ModuleService {
  create(createModuleDto: CreateModuleDto) {
    return 'This action adds a new module'
  }
  findAll(data: GetListDto): Promise<PageSizeInterface> {
    return Promise.resolve({
      data: [],
      total: 0,
      page: 1,
      limit: 10,
      pageSize: 10,
    })
  }

  findOne(moduleCode: string) {
    return `This action returns module ${moduleCode}`
  }

  update(moduleCode: string, updateModuleDto: UpdateModuleDto) {
    return `This action updates module ${moduleCode}`
  }

  remove(moduleCode: string) {
    return `This action removes module ${moduleCode}`
  }

  getActivity(moduleCode: string) {
    return `This action returns activity for module ${moduleCode}`
  }

  getChanges(moduleCode: string) {
    return `This action returns changes for module ${moduleCode}`
  }

  checkAccess(data: any) {
    return `This action checks module access`
  }
}
