import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpStatus,
  Put,
} from '@nestjs/common'
import { RolesService } from './roles.service'
import { CreateRoleDto } from './dto/create-role.dto'
import { UpdateRoleDto } from './dto/update-role.dto'
import { CreatePermissionDto } from './dto/create-permission.dto'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import { AddRoleUserDto } from './dto/add-role-user.dto'
import { GetListDto } from './dto/get-list.dto'
import { PageSizeInterface } from '../../interfaces/page-size.interface'
import { Users, UsersDocument } from '../../database/schemas/users.schema'
import { User } from '../../shared/decorators'
import { AddPermissionForRoleDto } from './dto/add-permission-for-role.dto'
import { PostMessageInterface } from '../../interfaces/post-message.interface'
import { RoleCheckDto } from './dto/role-check.dto'

@Controller('roles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post('createPermissionByAdmin')
  createPermissionByAdmin(
    @Body() createPermissionDto: CreatePermissionDto,
    @User() user: UsersDocument,
  ) {
    return this.rolesService.createPermissionByAdmin(createPermissionDto, user)
  }

  @Post('createRoleBySuperAdmin')
  createRoleBySuperAdmin(
    @Body() createRoleDto: CreateRoleDto,
    @User() user: UsersDocument,
  ): Promise<any> {
    return this.rolesService.createRoles(createRoleDto, user)
  }

  // @Post('addRoleForUser')
  // addRoleForUser(@Body() data: AddRoleUserDto): Promise<any> {
  //   return this.rolesService.addRoleForUser(data)
  // }

  @Get('getList')
  getList(@Query() data: GetListDto): Promise<PageSizeInterface> {
    return this.rolesService.getList(data)
  }

  @Post('addPermissionForRole')
  addPermissionForRole(@Body() data: AddPermissionForRoleDto): Promise<PostMessageInterface> {
    return this.rolesService.addPermissionForRole(data)
  }

  @Get('getPermissions')
  getPermissions(@Query() data: GetListDto): Promise<PageSizeInterface> {
    return this.rolesService.getPermissions(data)
  }

  @Post('roleCheck')
  roleCheck(@Body() data: RoleCheckDto): Promise<PostMessageInterface> {
    return this.rolesService.roleCheck(data)
  }

  @Get(':roleCode')
  @ApiOperation({ summary: 'Get role by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return role details' })
  @ApiParam({
    name: 'roleCode',
    description: 'ID of role to retrieve',
    example: '67287228e9647d06a5097ff6',
  })
  async getRoleById(@Param('roleCode') roleCode: string) {
    return this.rolesService.findById(roleCode)
  }

  @Put(':roleCode')
  @ApiOperation({ summary: 'Update role' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Role updated successfully' })
  @ApiParam({
    name: 'roleCode',
    description: 'ID of role to update',
    example: '67287228e9647d06a5097ff6',
  })
  async updateRole(@Param('roleCode') roleCode: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(roleCode, updateRoleDto)
  }

  @Delete(':roleCode')
  @ApiOperation({ summary: 'Delete role' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Role deleted successfully' })
  @ApiParam({
    name: 'roleCode',
    description: 'ID of role to delete',
    example: '67287228e9647d06a5097ff6',
  })
  async deleteRole(@Param('roleCode') roleCode: string) {
    return this.rolesService.delete(roleCode)
  }

  @Get(':roleCode/modules')
  @ApiOperation({ summary: 'Get modules assigned to role' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return list of modules' })
  @ApiParam({
    name: 'roleCode',
    description: 'ID of role to get modules',
    example: '67287228e9647d06a5097ff6',
  })
  async getRoleModules(@Param('roleCode') roleCode: string) {
    return this.rolesService.getModules(roleCode)
  }

  @Post(':roleCode/modules/:moduleCode')
  @ApiOperation({ summary: 'Assign module to role' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Module assigned successfully' })
  @ApiParam({
    name: 'roleCode',
    description: 'ID of role',
    example: '67287228e9647d06a5097ff6',
  })
  @ApiParam({
    name: 'moduleCode',
    description: 'ID of module to assign',
    example: '67287228e9647d06a5097ff7',
  })
  async assignModuleToRole(
    @Param('roleCode') roleCode: string,
    @Param('moduleCode') moduleCode: string,
  ) {
    return this.rolesService.assignModule(roleCode, moduleCode)
  }

  @Delete(':roleCode/modules/:moduleCode')
  @ApiOperation({ summary: 'Remove module from role' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Module removed successfully' })
  @ApiParam({
    name: 'roleCode',
    description: 'ID of role',
    example: '67287228e9647d06a5097ff6',
  })
  @ApiParam({
    name: 'moduleCode',
    description: 'ID of module to remove',
    example: '67287228e9647d06a5097ff7',
  })
  async removeModuleFromRole(
    @Param('roleCode') roleCode: string,
    @Param('moduleCode') moduleCode: string,
  ) {
    return this.rolesService.removeModule(roleCode, moduleCode)
  }

  @Post(':roleCode/modules/bulk')
  @ApiOperation({ summary: 'Bulk assign modules to role' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Modules assigned successfully' })
  @ApiParam({
    name: 'roleCode',
    description: 'ID of role',
    example: '67287228e9647d06a5097ff6',
  })
  async bulkAssignModules(@Param('roleCode') roleCode: string, @Body() moduleCodes: string[]) {
    return this.rolesService.bulkAssignModules(roleCode, moduleCodes)
  }
}
