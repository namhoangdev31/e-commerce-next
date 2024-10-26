import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { CreateRoleDto } from './dto/create-role.dto'
import { UpdateRoleDto } from './dto/update-role.dto'
import { RolesRepository } from '../../database/repositories/roles.repository'
import { CreatePermissionDto } from './dto/create-permission.dto'

@Injectable()
export class RolesService {
  constructor(private readonly rolesRepository: RolesRepository) {}

  async createPermissionByAdmin(createPermissionDto: CreatePermissionDto) {
    const createdPermission = await this.rolesRepository.createPermissionByAdmin(
      createPermissionDto,
    )
    if (!createdPermission) {
      throw new InternalServerErrorException('Failed to create permission')
    }
    return createdPermission
  }

  async create(createRoleDto: CreateRoleDto) {
    const createdRole = await this.rolesRepository.createRoleByAdmin(createRoleDto)
    if (!createdRole) {
      throw new InternalServerErrorException('Failed to create role')
    }
    return {
      message: 'Create successful!',
    }
  }
}
