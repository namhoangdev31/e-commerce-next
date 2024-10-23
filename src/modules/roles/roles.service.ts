import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RolesRepository } from '../../database/repositories/roles.repository';
import { CreatePermissionDto } from './dto/create-permission.dto';

@Injectable()
export class RolesService {
  constructor(private readonly rolesRepository: RolesRepository) {}

  // Quản lý Roles cơ bản
  async findAll() {
    return this.rolesRepository.findAll();
  }

  async create(createRoleDto: CreateRoleDto) {
    return this.rolesRepository.create(createRoleDto);
  }

  async findOne(id: string) {
    return this.rolesRepository.findOne(id);
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    return this.rolesRepository.update(id, updateRoleDto);
  }

  async remove(id: string) {
    return this.rolesRepository.remove(id);
  }

  // Quản lý Custom Roles
  async createCustomRole(createCustomRoleDto: CreateRoleDto) {
    return this.rolesRepository.createCustomRole(createCustomRoleDto);
  }

  async getCustomRole(id: string) {
    return this.rolesRepository.getCustomRole(id);
  }

  async updateCustomRole(id: string, updateCustomRoleDto: UpdateRoleDto) {
    return this.rolesRepository.updateCustomRole(id, updateCustomRoleDto);
  }

  async removeCustomRole(id: string) {
    return this.rolesRepository.removeCustomRole(id);
  }

  // Quản lý Role Permissions
  async assignPermissionToRole(roleId: string, permissionDto: any) {
    return this.rolesRepository.assignPermissionToRole(roleId, permissionDto);
  }

  async getRolePermissions(roleId: string) {
    return this.rolesRepository.getRolePermissions(roleId);
  }

  async removePermissionFromRole(roleId: string, permissionId: string) {
    return this.rolesRepository.removePermissionFromRole(roleId, permissionId);
  }

  async createPermissionByAdmin(createPermissionDto: CreatePermissionDto) {
    return this.rolesRepository.createPermissionByAdmin(createPermissionDto);
  }
}
