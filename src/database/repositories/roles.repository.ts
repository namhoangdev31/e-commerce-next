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
import { GetListDto } from '../../modules/roles/dto/get-list.dto'
import { RolesInterface } from '../../interfaces/get-list-roles.interface'

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
    private roleEntity: Repository<RoleEntity>,
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
      const result = await this.rolesModel.create(createRoleDto)
      if (!result) {
        throw new InternalServerErrorException('Failed to create role')
      }
      await this.roleEntity
        .createQueryBuilder()
        .insert()
        .into(RoleEntity)
        .values({
          roleName: result.roleName,
          roleCode: result.roleCode,
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
    const mysqlRoles = await this.roleEntity.find()
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

  async getList(data: GetListDto): Promise<RolesInterface[]> {
    const { page = 1, limit = 10, id } = data
    const skip = (page - 1) * limit

    if (id) {
      const roles = await this.roleEntity.find({
        skip,
        take: limit,
        where: { id }
      })
      return roles.map(role => ({
        roleCode: role.roleCode,
        roleName: role.roleName,
        description: role.description,
        isSystem: role.isSystem,
      }))
    }

    const roles = await this.rolesModel.find().skip(skip).limit(limit)
    return roles.map(role => ({
      roleCode: role.roleCode,
      roleName: role.roleName,
      description: role.description,
      isSystem: role.isSystem,
    }))
  }
}
