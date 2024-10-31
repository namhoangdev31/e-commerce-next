import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { Roles, RolesDocument } from '../schemas/roles.schema'
import { CustomRoles, CustomRolesDocument } from '../schemas/custom-roles.schema'
import { RolePermissions, RolePermissionsDocument } from '../schemas/role-permissions.schema'
import { PermissionDocument, Permissions } from '../schemas/permissions.schema'
import { CreateRoleDto } from '../../modules/roles/dto/create-role.dto'
import { CreatePermissionDto } from '../../modules/roles/dto/create-permission.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { RoleEntity } from '../entity/role.entity'
import { In, Repository } from 'typeorm'
import { GetListDto } from '../../modules/roles/dto/get-list.dto'
import { RolesInterface } from '../../interfaces/get-list-roles.interface'
import { AddRoleUserDto } from '../../modules/roles/dto/add-role-user.dto'

import { Users, UsersDocument } from '../schemas/users.schema'
import { UserRoles, UserRolesDocument } from '../schemas/user-roles.schema'
import { UserRolesEntity } from '../entity/user-roles.entity'
import { UsersEntities } from '../entity/user.entity'

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
    @InjectModel(Users.name)
    private userModel: Model<UsersDocument>,
    @InjectModel(UserRoles.name)
    private userRoleModel: Model<UserRolesDocument>,
    @InjectRepository(RoleEntity)
    private roleEntity: Repository<RoleEntity>,
    @InjectRepository(UserRolesEntity)
    private userRolesEntity: Repository<UserRolesEntity>,
    @InjectRepository(UsersEntities)
    private userEntity: Repository<UsersEntities>,
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
      roleCode: { $in: mysqlRoles.map(role => role.roleCode) },
    })

    const existingRoleNames = existingRoles.map(role => role.roleCode)
    const newRoles = mysqlRoles.filter(role => !existingRoleNames.includes(role.roleCode))

    if (newRoles.length > 0) {
      await this.rolesModel.insertMany(
        newRoles.map(role => ({
          roleCode: role.roleCode,
          roleName: role.roleName,
          description: role.description,
          isSystem: role.isSystem,
        })),
      )
    }
  }

  async syncRolesFromMongoDBToMySQL(): Promise<void> {
    const mongoRoles = await this.rolesModel.find()
    const existingRoles = await this.roleEntity.find({
      where: {
        roleCode: In(mongoRoles.map(role => role.roleCode)),
      },
    })

    const existingRoleCodes = existingRoles.map(role => role.roleCode)
    const newRoles = mongoRoles.filter(role => !existingRoleCodes.includes(role.roleCode))

    if (newRoles.length > 0) {
      await this.roleEntity
        .createQueryBuilder()
        .insert()
        .into(RoleEntity)
        .values(
          newRoles.map(role => ({
            roleCode: role.roleCode,
            roleName: role.roleName,
            description: role.description,
            isSystem: role.isSystem,
          })),
        )
        .execute()
    }
  }

  async getList(data: GetListDto): Promise<RolesInterface[]> {
    const { page = 1, limit = 10, id } = data
    const skip = (page - 1) * limit

    if (id) {
      const roles = await this.roleEntity.find({
        skip,
        take: limit,
        where: { id },
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

  async addRoleForUser(data: AddRoleUserDto): Promise<any> {
    try {
      const findRole = await this.rolesModel.findOne({
        roleCode: data.roleCode,
      })

      const findUser = await this.userModel.findOne({
        _id: new Types.ObjectId(data.userId),
      })

      if (!findRole || !findUser) {
        throw new BadRequestException('Error not found')
      }

      const findRoleId = await this.roleEntity
        .createQueryBuilder('roles')
        .where('roles.roleCode = :roleCode', { roleCode: data.roleCode })
        .getOne()

      const findUserId = await this.userEntity
        .createQueryBuilder('users')
        .where('users.username = :username', { username: findUser.username })
        .getOne()

      if (!findRoleId || !findUserId) {
        throw new BadRequestException('Error not found')
      }

      const userRole = await this.userRoleModel.create({
        userId: data.userId,
        roleId: findRole._id,
        assignmentStartDate: new Date(),
      })

      if (!userRole) {
        throw new InternalServerErrorException('Failed to add role for user')
      }

      await this.userRolesEntity
        .createQueryBuilder()
        .insert()
        .into(UserRolesEntity)
        .values({
          userId: findUserId.id,
          roleId: findRoleId.id,
          assignmentStartDate: new Date(),
        })
        .execute()

      return {
        message: 'Add role successful!',
      }
    } catch (error) {
      throw new InternalServerErrorException('Failed to add role for user')
    }
  }
}
