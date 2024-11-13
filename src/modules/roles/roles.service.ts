import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
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
import { PostMessageInterface } from '../../interfaces/post-message.interface'
import { RoleCheckDto } from './dto/role-check.dto'

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
      const createdPermission =
        await this.rolesRepository.createPermissionByAdmin(createPermissionDto)
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

  async createRoles(createRoleDto: CreateRoleDto, user: UsersDocument) {
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

  async addRoleForUser(data: AddRoleUserDto): Promise<PostMessageInterface> {
    try {
      await this.rolesRepository.addRoleForUser(data)
      return {
        message: 'Create successful!',
        statusCode: 200,
      }
    } catch (error) {
      throw new InternalServerErrorException('Error adding role to user: ' + error.message)
    }
  }

  async getList(data: GetListDto): Promise<PageSizeInterface> {
    try {
      const roles = await this.rolesRepository.getList(data)
      return {
        data: roles,
        page: data.page,
        pageSize: data.limit,
      }
    } catch (error) {
      throw new InternalServerErrorException('Error getting roles list: ' + error.message)
    }
  }

  async addPermissionForRole(data: AddPermissionForRoleDto): Promise<PostMessageInterface> {
    try {
      await this.rolesRepository.addPermissionForRole(data)
      return {
        statusCode: 200,
        message: 'Create successful!',
      }
    } catch (error) {
      throw new InternalServerErrorException('Error adding permission to role: ' + error.message)
    }
  }

  async getPermissions(data: GetListDto): Promise<PageSizeInterface> {
    try {
      const permissions = await this.rolesRepository.getPermissions(data)
      return {
        data: permissions,
        page: data.page,
        pageSize: data.limit,
      }
    } catch (error) {
      throw new InternalServerErrorException('Error getting permissions list: ' + error.message)
    }
  }

  async roleCheck(data: RoleCheckDto): Promise<PostMessageInterface> {
    return {
      message: 'Check done!',
      statusCode: 200,
      data: true,
    }
  }
  async findById(roleCode: string) {
    try {
      const role = await this.rolesRepository.findById(roleCode)
      if (!role) {
        throw new NotFoundException(`Role with ID ${roleCode} not found`)
      }
      return role
    } catch (error) {
      throw new InternalServerErrorException('Error finding role: ' + error.message)
    }
  }

  async update(roleCode: string, updateRoleDto: UpdateRoleDto) {
    try {
      const updatedRole = await this.rolesRepository.update(roleCode, updateRoleDto)
      if (!updatedRole) {
        throw new NotFoundException(`Role with ID ${roleCode} not found`)
      }
      return updatedRole
    } catch (error) {
      throw new InternalServerErrorException('Error updating role: ' + error.message)
    }
  }

  async delete(roleCode: string) {
    try {
      const deletedRole = await this.rolesRepository.delete(roleCode)
      if (!deletedRole) {
        throw new NotFoundException(`Role with ID ${roleCode} not found`)
      }
      return deletedRole
    } catch (error) {
      throw new InternalServerErrorException('Error deleting role: ' + error.message)
    }
  }

  async getModules(roleCode: string) {
    try {
      const modules = await this.rolesRepository.getModules(roleCode)
      return modules
    } catch (error) {
      throw new InternalServerErrorException('Error getting role modules: ' + error.message)
    }
  }

  async assignModule(roleCode: string, moduleCode: string) {
    try {
      const result = await this.rolesRepository.assignModule(roleCode, moduleCode)
      return result
    } catch (error) {
      throw new InternalServerErrorException('Error assigning module to role: ' + error.message)
    }
  }

  async removeModule(roleCode: string, moduleCode: string) {
    try {
      const result = await this.rolesRepository.removeModule(roleCode, moduleCode)
      return result
    } catch (error) {
      throw new InternalServerErrorException('Error removing module from role: ' + error.message)
    }
  }

  async bulkAssignModules(roleCode: string, moduleCodes: string[]) {
    try {
      const result = await this.rolesRepository.bulkAssignModules(roleCode, moduleCodes)
      return result
    } catch (error) {
      throw new InternalServerErrorException('Error bulk assigning modules: ' + error.message)
    }
  }
}
