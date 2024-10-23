import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { Roles, RolesDocument } from '../schemas/roles.schema'
import { CustomRoles, CustomRolesDocument } from '../schemas/custom-roles.schema'
import { RolePermissions, RolePermissionsDocument } from '../schemas/role-permissions.schema'
import { Permissions, PermissionDocument } from '../schemas/permissions.schema'
import { CreateRoleDto } from '../../modules/roles/dto/create-role.dto'
import { UpdateRoleDto } from '../../modules/roles/dto/update-role.dto'

@Injectable()
export class RolesRepository {
  constructor(
    @InjectModel(Roles.name) private rolesModel: Model<RolesDocument>,
    @InjectModel(CustomRoles.name) private customRolesModel: Model<CustomRolesDocument>,
    @InjectModel(RolePermissions.name) private rolePermissionsModel: Model<RolePermissionsDocument>,
    @InjectModel(Permissions.name) private permissionsModel: Model<PermissionDocument>,
  ) {}

  async findAll(): Promise<RolesDocument[]> {
    return this.rolesModel.find().exec()
  }

  async create(createRoleDto: CreateRoleDto): Promise<RolesDocument> {
    const createdRole = new this.rolesModel(createRoleDto)
    return createdRole.save()
  }

  async findOne(id: string): Promise<RolesDocument> {
    return this.rolesModel.findById(id).exec()
  }

  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<RolesDocument> {
    return this.rolesModel.findByIdAndUpdate(id, updateRoleDto, { new: true }).exec()
  }

  async remove(id: string): Promise<RolesDocument> {
    return this.rolesModel.findByIdAndDelete(id).exec()
  }

  // Quản lý Custom Roles
  async createCustomRole(createCustomRoleDto: CreateRoleDto): Promise<CustomRolesDocument> {
    const createdCustomRole = new this.customRolesModel(createCustomRoleDto)
    return createdCustomRole.save()
  }

  async getCustomRole(id: string): Promise<CustomRolesDocument> {
    return this.customRolesModel.findById(id).exec()
  }

  async updateCustomRole(
    id: string,
    updateCustomRoleDto: UpdateRoleDto,
  ): Promise<CustomRolesDocument> {
    return this.customRolesModel.findByIdAndUpdate(id, updateCustomRoleDto, { new: true }).exec()
  }

  async removeCustomRole(id: string): Promise<CustomRolesDocument> {
    return this.customRolesModel.findByIdAndDelete(id).exec()
  }

  // Quản lý Role Permissions
  async assignPermissionToRole(
    roleId: string,
    permissionDto: any,
  ): Promise<RolePermissionsDocument> {
    const newRolePermission = new this.rolePermissionsModel({
      roleId: new Types.ObjectId(roleId),
      ...permissionDto,
    })
    return newRolePermission.save()
  }

  async getRolePermissions(roleId: string): Promise<RolePermissionsDocument[]> {
    return this.rolePermissionsModel.find({ roleId: new Types.ObjectId(roleId) }).exec()
  }

  async removePermissionFromRole(roleId: string, permissionId: string): Promise<any> {
    return this.rolePermissionsModel
      .deleteOne({
        roleId: new Types.ObjectId(roleId),
        permissionId: new Types.ObjectId(permissionId),
      })
      .exec()
  }
}
