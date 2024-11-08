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
} from '@nestjs/common'
import { ModuleService } from './module.service'
import { CreateModuleDto } from './dto/create-module.dto'
import { UpdateModuleDto } from './dto/update-module.dto'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'

import { PageSizeInterface } from '../../interfaces/page-size.interface'
import { GetListDto } from '../users/dto/get-list.dto'

@Controller('modules')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Modules')
export class ModuleController {
  constructor(private readonly moduleService: ModuleService) {}

  @Post()
  @ApiOperation({ summary: 'Create new module' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Module created successfully' })
  create(@Body() createModuleDto: CreateModuleDto) {
    return this.moduleService.create(createModuleDto)
  }

  @Get()
  @ApiOperation({ summary: 'Get all modules' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return list of modules' })
  findAll(@Query() data: GetListDto): Promise<PageSizeInterface> {
    return this.moduleService.findAll(data)
  }

  @Get(':moduleCode')
  @ApiOperation({ summary: 'Get module by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return module details' })
  @ApiParam({
    name: 'moduleCode',
    description: 'ID of module to retrieve',
    example: '67287228e9647d06a5097ff6',
  })
  findOne(@Param('moduleCode') moduleCode: string) {
    return this.moduleService.findOne(moduleCode)
  }

  @Patch(':moduleCode')
  @ApiOperation({ summary: 'Update module' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Module updated successfully' })
  @ApiParam({
    name: 'moduleCode',
    description: 'ID of module to update',
    example: '67287228e9647d06a5097ff6',
  })
  update(@Param('moduleCode') moduleCode: string, @Body() updateModuleDto: UpdateModuleDto) {
    return this.moduleService.update(moduleCode, updateModuleDto)
  }

  @Delete(':moduleCode')
  @ApiOperation({ summary: 'Delete module' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Module deleted successfully' })
  @ApiParam({
    name: 'moduleCode',
    description: 'ID of module to delete',
    example: '67287228e9647d06a5097ff6',
  })
  remove(@Param('moduleCode') moduleCode: string) {
    return this.moduleService.remove(moduleCode)
  }

  @Get(':moduleCode/activity')
  @ApiOperation({ summary: 'Get module activity history' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return module activity history' })
  @ApiParam({
    name: 'moduleCode',
    description: 'ID of module to get activity',
    example: '67287228e9647d06a5097ff6',
  })
  getActivity(@Param('moduleCode') moduleCode: string) {
    return this.moduleService.getActivity(moduleCode)
  }

  @Get(':moduleCode/changes')
  @ApiOperation({ summary: 'Get module change history' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return module change history' })
  @ApiParam({
    name: 'moduleCode',
    description: 'ID of module to get changes',
    example: '67287228e9647d06a5097ff6',
  })
  getChanges(@Param('moduleCode') moduleCode: string) {
    return this.moduleService.getChanges(moduleCode)
  }

  @Post('access/check')
  @ApiOperation({ summary: 'Check module access' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return access check result' })
  checkAccess(@Body() data: any) {
    return this.moduleService.checkAccess(data)
  }
}
