import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { GroupsService } from './groups.service'
import { CreateGroupDto } from './dto/create-group.dto'
import { UpdateGroupDto } from './dto/update-group.dto'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'

@Controller('groups')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('Groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create new group' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Group created successfully' })
  create(@Body() createGroupDto: CreateGroupDto) {
    return this.groupsService.create(createGroupDto)
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all groups' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Retrieved all groups' })
  findAll() {
    return this.groupsService.findAll()
  }

  @Get(':groupId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get group by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Retrieved group' })
  findOne(@Param('groupId') groupId: string) {
    return this.groupsService.findOne(groupId)
  }

  @Patch(':groupId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update group' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Group updated successfully' })
  update(@Param('groupId') groupId: string, @Body() updateGroupDto: UpdateGroupDto) {
    return this.groupsService.update(groupId, updateGroupDto)
  }

  @Delete(':groupId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete group' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Group deleted successfully' })
  remove(@Param('groupId') groupId: string) {
    return this.groupsService.remove(groupId)
  }

  @Get(':groupId/members')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get group members' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Retrieved group members' })
  getMembers(@Param('groupId') groupId: string) {
    return this.groupsService.getMembers(groupId)
  }

  @Post(':groupId/members')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add member to group' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Member added successfully' })
  addMember(@Param('groupId') groupId: string, @Body() data: { userCode: string }) {
    return this.groupsService.addMember(groupId, data.userCode)
  }

  @Delete(':groupId/members/:userCode')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove member from group' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Member removed successfully' })
  removeMember(@Param('groupId') groupId: string, @Param('userCode') userCode: string) {
    return this.groupsService.removeMember(groupId, userCode)
  }

  @Post(':groupId/members/bulk')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add multiple members to group' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Members added successfully' })
  addMembers(@Param('groupId') groupId: string, @Body() data: { userCodes: string[] }) {
    return this.groupsService.addMembers(groupId, data.userCodes)
  }
}
