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
import { ADMIN_ROLE, SUPER_ADMIN } from '../../shared/constants/strings.constants'
import { AddPermissionForRoleDto } from './dto/add-permission-for-role.dto'

@Injectable()
export class RolesService {
  constructor(private readonly rolesRepository: RolesRepository) {}

  async createPermissionByAdmin(
    createPermissionDto: CreatePermissionDto,
    user: UsersDocument,
  ): Promise<any> {
    if (!user?.roleCode || (user.roleCode !== ADMIN_ROLE && user.roleCode !== SUPER_ADMIN)) {
      throw new UnauthorizedException('You do not have permission to create permission')
    }

    try {
      const createdPermission = await this.rolesRepository.createPermissionByAdmin(
        createPermissionDto,
      )
      if (!createdPermission) {
        throw new InternalServerErrorException('Failed to create permission')
      }
      return {
        message: 'Create permission successful!',
        statusCode: 200,
      }
    } catch (error) {
      throw new InternalServerErrorException(
        `Error creating permission: ${error instanceof Error ? error.message : 'Unknown error'}`,
      )
    }
  }

  async create(createRoleDto: CreateRoleDto, user: UsersDocument) {
    if (user.roleCode !== SUPER_ADMIN) {
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

  async addPermissionForRole(data: AddPermissionForRoleDto): Promise<any> {
    await this.rolesRepository.addPermissionForRole(data)
    return {
      message: 'Create successful!',
      statusCode: 200,
    }
  }

  async getPermissions(data: GetListDto): Promise<PageSizeInterface> {
    const permissions = await this.rolesRepository.getPermissions(data)
    return {
      data: permissions,
      page: data.page,
      pageSize: data.limit,
    }
  }
}
