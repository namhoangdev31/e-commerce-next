import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { Roles, RolesDocument } from '../schemas/roles.schema'
import { CustomRoles, CustomRolesDocument } from '../schemas/custom-roles.schema'
import { RolePermissions, RolePermissionsDocument } from '../schemas/role-permissions.schema'
import { Permissions, PermissionDocument } from '../schemas/permissions.schema'
import { CreateRoleDto } from '../../modules/roles/dto/create-role.dto'
import { UpdateRoleDto } from '../../modules/roles/dto/update-role.dto'
import { CreatePermissionDto } from '../../modules/roles/dto/create-permission.dto'

@Injectable()
export class RolesRepository {
  constructor(
    @InjectModel(Roles.name)
    private rolesModel: Model<RolesDocument>,
    @InjectModel(CustomRoles.name)
    private customRolesModel: Model<CustomRolesDocument>,
    @InjectModel(RolePermissions.name)
    private rolePermissionsModel: Model<RolePermissionsDocument>,
    @InjectModel(Permissions.name)
    private permissionsModel: Model<PermissionDocument>,
  ) {}

  async createPermissionByAdmin(
    createPermissionDto: CreatePermissionDto,
  ): Promise<PermissionDocument> {
    const createdPermission = await this.permissionsModel.create({
      ...createPermissionDto,
    })
    return createdPermission
  }

  async createRoleByAdmin(createRoleDto: CreateRoleDto): Promise<RolesDocument> {
    const createdRole = await this.rolesModel.create({
      ...createRoleDto,
    })
    return createdRole
  }
}
