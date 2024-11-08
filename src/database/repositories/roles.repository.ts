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
import { PermissionsEntity } from '../entity/permissions.entity'
import { AddPermissionForRoleDto } from '../../modules/roles/dto/add-permission-for-role.dto'
import { RolePermissionsEntity } from '../entity/role-permissions.entity'
import { GetPermissionDto } from '../../interfaces/get-permission.dto'
import { UpdateRoleDto } from 'src/modules/roles/dto/update-role.dto'

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
    @InjectRepository(PermissionsEntity)
    private permissionsEntity: Repository<PermissionsEntity>,
    @InjectRepository(RolePermissionsEntity)
    private rolePermissionsEntity: Repository<RolePermissionsEntity>,
  ) {}

  async createPermissionByAdmin(
    createPermissionDto: CreatePermissionDto,
  ): Promise<PermissionDocument> {
    const permission = await this.permissionsModel.findOne({
      permissionName: createPermissionDto.permissionName,
    })
    if (permission) {
      throw new BadRequestException('Permission already exists')
    }

    const result = await this.permissionsModel.create(createPermissionDto)

    if (!result) {
      throw new InternalServerErrorException('Failed to create permission')
    }

    await this.permissionsEntity
      .createQueryBuilder()
      .insert()
      .into(PermissionsEntity)
      .values({
        permissionName: createPermissionDto.permissionName,
        description: createPermissionDto.description,
        permissionCode: result._id.toString(),
      })
      .execute()

    return result
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
          roleCode: String(result._id),
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

    const existingRoleCodes = existingRoles.map(role => role.roleName)
    const newRoles = mysqlRoles.filter(role => !existingRoleCodes.includes(role.roleName))

    if (newRoles.length > 0) {
      await this.rolesModel.insertMany(
        newRoles.map(role => ({
          _id: role.roleCode,
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
        roleCode: In(mongoRoles.map(role => role._id.toString())),
      },
    })

    const existingRoleCodes = existingRoles.map(role => role.roleCode)
    const newRoles = mongoRoles.filter(role => !existingRoleCodes.includes(role._id.toString()))

    if (newRoles.length > 0) {
      await this.roleEntity
        .createQueryBuilder()
        .insert()
        .into(RoleEntity)
        .values(
          newRoles.map(role => ({
            roleCode: role._id.toString(),
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
      roleCode: role._id.toString(),
      roleName: role.roleName,
      description: role.description,
      isSystem: role.isSystem,
    }))
  }

  async getPermissions(data: GetListDto): Promise<GetPermissionDto[]> {
    const { page = 1, limit = 10, id } = data
    const skip = (page - 1) * limit

    if (id) {
      const permissions = await this.permissionsEntity.find({
        skip,
        take: limit,
        where: { id },
      })
      return permissions.map(permission => ({
        permissionCode: permission.permissionCode,
        permissionName: permission.permissionName,
        description: permission.description,
      }))
    }

    const permissions = await this.permissionsModel.find().skip(skip).limit(limit)
    return permissions.map(permission => ({
      permissionCode: String(permission._id),
      permissionName: permission.permissionName,
      description: permission.description,
    }))
  }

  async addRoleForUser(data: AddRoleUserDto): Promise<any> {
    try {
      const findRole = await this.rolesModel.findOne({
        _id: new Types.ObjectId(data.roleCode),
      })

      const findUser = await this.userModel.findOne({
        _id: new Types.ObjectId(data.userCode),
      })

      if (!findRole || !findUser) {
        throw new BadRequestException('Error not found')
      }

      const findroleCode = await this.roleEntity
        .createQueryBuilder('roles')
        .where('roles.role_code = :roleCode', { roleCode: data.roleCode })
        .getOne()

      const finduserCode = await this.userEntity
        .createQueryBuilder('users')
        .where('users.user_code = :userCode', { userCode: data.userCode })
        .getOne()

      if (!findroleCode || !finduserCode) {
        throw new BadRequestException('Error not found')
      }

      const userRole = await this.userRoleModel.create({
        username: data.userCode,
        roleCode: data.roleCode,
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
          userCode: finduserCode.userCode,
          roleCode: findroleCode.roleCode,
          assignmentStartDate: new Date(),
        })
        .execute()

      return {
        message: 'Add role successful!',
        status: 200,
      }
    } catch (error) {
      throw new InternalServerErrorException('Failed to add role for user')
    }
  }

  async addPermissionForRole(data: AddPermissionForRoleDto): Promise<any> {
    try {
      const findRole = await this.rolesModel.findOne({
        roleCode: data.roleCode,
      })

      const findPermission = await this.permissionsModel.findOne({
        permissionCode: data.permissionCode,
      })

      if (!findRole || !findPermission) {
        throw new BadRequestException('Error not found')
      }

      await this.rolePermissionsModel.create({
        roleCode: data.roleCode,
        permissionCode: data.permissionCode,
        accessLevel: data.accessLevel,
      })

      await this.rolePermissionsEntity
        .createQueryBuilder()
        .insert()
        .into(RolePermissionsEntity)
        .values({
          roleCode: data.roleCode,
          permissionCode: data.permissionCode,
          accessLevel: data.accessLevel,
        })
        .execute()

      return {
        message: 'Add permission successful!',
        statusCode: 200,
      }
    } catch (e) {
      throw new InternalServerErrorException('Failed to add permission for role')
    }
  }

  async findRoleByCode(roleCode: string): Promise<RolesDocument> {
    return this.rolesModel.findOne({ _id: new Types.ObjectId(roleCode) })
  }


  async findById(roleCode: string) {
    try {
      return await this.rolesModel.findById(roleCode)
    } catch (error) {
      throw new InternalServerErrorException('Failed to find role')
    }
  }

  async update(roleCode: string, updateRoleDto: UpdateRoleDto) {
    try {
      return await this.rolesModel.findByIdAndUpdate(roleCode, updateRoleDto, { new: true })
    } catch (error) {
      throw new InternalServerErrorException('Failed to update role')
    }
  }

  async delete(roleCode: string) {
    try {
      return await this.rolesModel.findByIdAndDelete(roleCode)
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete role')
    }
  }

  async getModules(roleCode: string) {
    try {
      const role = await this.rolesModel.findById(new Types.ObjectId(roleCode)).populate('modules')
      return role?.modules || []
    } catch (error) {
      throw new InternalServerErrorException('Failed to get role modules')
    }
  }

  async assignModule(roleCode: string, moduleCode: string) {
    try {
      return await this.rolesModel.findByIdAndUpdate(
        roleCode,
        { $addToSet: { modules: moduleCode } },
        { new: true }
      )
    } catch (error) {
      throw new InternalServerErrorException('Failed to assign module')
    }
  }

  async removeModule(roleCode: string, moduleCode: string) {
    try {
      return await this.rolesModel.findByIdAndUpdate(
        roleCode,
        { $pull: { modules: moduleCode } },
        { new: true }
      )
    } catch (error) {
      throw new InternalServerErrorException('Failed to remove module')
    }
  }

  async bulkAssignModules(roleCode: string, moduleCodes: string[]) {
    try {
      return await this.rolesModel.findByIdAndUpdate(
        roleCode,
        { $addToSet: { modules: { $each: moduleCodes } } },
        { new: true }
      )
    } catch (error) {
      throw new InternalServerErrorException('Failed to bulk assign modules')
    }
  }
}
