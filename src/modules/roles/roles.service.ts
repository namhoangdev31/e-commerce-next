import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common'
import { CreateRoleDto } from './dto/create-role.dto'
import { UpdateRoleDto } from './dto/update-role.dto'
import { RolesRepository } from '../../database/repositories/roles.repository'
import { CreatePermissionDto } from './dto/create-permission.dto'
import { AddRoleUserDto } from './dto/add-role-user.dto'
import { GetListDto } from './dto/get-list.dto'
import { PageSizeInterface } from '../../interfaces/page-size.interface'
import { UsersDocument } from '../../database/schemas/users.schema'
import { PermissionDocument } from '../../database/schemas/permissions.schema'

@Injectable()
export class RolesService {
  constructor(private readonly rolesRepository: RolesRepository) {}

  async createPermissionByAdmin(
    createPermissionDto: CreatePermissionDto,
  ): Promise<PermissionDocument> {
    try {
      const createdPermission = await this.rolesRepository.createPermissionByAdmin(
        createPermissionDto,
      )
      if (!createdPermission) {
        throw new InternalServerErrorException('Failed to create permission')
      }
      return createdPermission
    } catch (error) {
      throw new InternalServerErrorException('Error creating permission: ' + error.message)
    }
  }

  async create(createRoleDto: CreateRoleDto, user: UsersDocument) {
    if (user.roleCode !== 'SUPER_ADMIN') {
      throw new UnauthorizedException('You do not have permission to create role')
    }
    try {
      const createdRole = await this.rolesRepository.createRoleByAdmin(createRoleDto)
      if (!createdRole) {
        throw new InternalServerErrorException('Failed to create role')
      }
      return {
        message: 'Create successful!',
        statusCode: 200,
      }
    } catch (error) {
      throw new InternalServerErrorException('Error creating role: ' + error.message)
    }
  }

  async addRoleForUser(data: AddRoleUserDto) {
    await this.rolesRepository.addRoleForUser(data)
    return {
      message: 'Create successful!',
      statusCode: 200,
    }
  }

  async getList(data: GetListDto): Promise<PageSizeInterface> {
    const roles = await this.rolesRepository.getList(data)
    return {
      data: roles,
      page: data.page,
      pageSize: data.limit,
    }
  }
}
