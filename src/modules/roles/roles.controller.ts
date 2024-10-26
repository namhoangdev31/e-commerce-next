import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common'
import { RolesService } from './roles.service'
import { CreateRoleDto } from './dto/create-role.dto'
import { UpdateRoleDto } from './dto/update-role.dto'
import { CreatePermissionDto } from './dto/create-permission.dto'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AddRoleUserDto } from './dto/add-role-user.dto'
@Controller('roles')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('Roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post('createPermissionByAdmin')
  createPermissionByAdmin(@Body() createPermissionDto: CreatePermissionDto) {
    return this.rolesService.createPermissionByAdmin(createPermissionDto)
  }

  @Post('createRoleBySuperAdmin')
  createRoleBySuperAdmin(@Body() createRoleDto: CreateRoleDto): Promise<any> {
    return this.rolesService.create(createRoleDto)
  }

  @Post('addRoleForUser')
  addRoleForUser(@Body() data: AddRoleUserDto): Promise<any> {
    return this.rolesService.addRoleForUser(data)
  }
}
