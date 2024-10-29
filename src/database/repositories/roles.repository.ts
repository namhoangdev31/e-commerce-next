import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Roles, RolesDocument } from '../schemas/roles.schema'
import { CustomRoles, CustomRolesDocument } from '../schemas/custom-roles.schema'
import { RolePermissions, RolePermissionsDocument } from '../schemas/role-permissions.schema'
import { PermissionDocument, Permissions } from '../schemas/permissions.schema'
import { CreateRoleDto } from '../../modules/roles/dto/create-role.dto'
import { CreatePermissionDto } from '../../modules/roles/dto/create-permission.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { RoleEntity } from '../entity/role.entity'
import { Repository } from 'typeorm'

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
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
  ) {}

  async createPermissionByAdmin(
    createPermissionDto: CreatePermissionDto,
  ): Promise<PermissionDocument> {
    return await this.permissionsModel.create({
      ...createPermissionDto,
    })
  }

  async createRoleByAdmin(createRoleDto: CreateRoleDto): Promise<RolesDocument> {
    try {
      const result = await this.rolesModel.create({
        ...createRoleDto,
      })
      if (!result) {
        throw new InternalServerErrorException('Failed to create role')
      }
      await this.roleRepository
        .createQueryBuilder()
        .insert()
        .into(RoleEntity)
        .values({
          roleName: result.roleName,
          description: result.description,
          isSystem: result.isSystem,
        })
        .execute()
      return result
    } catch (error) {
      throw new InternalServerErrorException('Failed to create role')
    }
  }

  async syncRolesFromMySQLToMongoDB(): Promise<void> {
    const mysqlRoles = await this.roleRepository.find()
    const existingRoles = await this.rolesModel.find({
      roleName: { $in: mysqlRoles.map(role => role.roleName) },
    })

    const existingRoleNames = existingRoles.map(role => role.roleName)
    const newRoles = mysqlRoles.filter(role => !existingRoleNames.includes(role.roleName))

    if (newRoles.length > 0) {
      await this.rolesModel.insertMany(
        newRoles.map(role => ({
          roleName: role.roleName,
          description: role.description,
          isSystem: role.isSystem,
        })),
      )
    }
  }
}
