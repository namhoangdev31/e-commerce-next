import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import { RolesService } from './roles.service'
import { CreateRoleDto } from './dto/create-role.dto'
import { UpdateRoleDto } from './dto/update-role.dto'

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}
  @Get()
  findAll() {
    return this.rolesService.findAll()
  }

  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(id, updateRoleDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rolesService.remove(id)
  }

  // Quản lý Custom Roles
  @Post('custom')
  createCustomRole(@Body() createCustomRoleDto: CreateRoleDto) {
    return this.rolesService.createCustomRole(createCustomRoleDto)
  }

  @Get('custom/:id')
  getCustomRole(@Param('id') id: string) {
    return this.rolesService.getCustomRole(id)
  }

  @Patch('custom/:id')
  updateCustomRole(@Param('id') id: string, @Body() updateCustomRoleDto: UpdateRoleDto) {
    return this.rolesService.updateCustomRole(id, updateCustomRoleDto)
  }

  @Delete('custom/:id')
  removeCustomRole(@Param('id') id: string) {
    return this.rolesService.removeCustomRole(id)
  }

  // Quản lý Role Permissions
  @Post(':roleId/permissions')
  assignPermissionToRole(@Param('roleId') roleId: string, @Body() permissionDto: any) {
    return this.rolesService.assignPermissionToRole(roleId, permissionDto)
  }

  @Get(':roleId/permissions')
  getRolePermissions(@Param('roleId') roleId: string) {
    return this.rolesService.getRolePermissions(roleId)
  }

  @Delete(':roleId/permissions/:permissionId')
  removePermissionFromRole(
    @Param('roleId') roleId: string,
    @Param('permissionId') permissionId: string,
  ) {
    return this.rolesService.removePermissionFromRole(roleId, permissionId)
  }
}
