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
import { AddMemberGroupDto, AddMembersGroupDto } from './dto/add-member-group.dto'

@Controller({
  path: 'groups',
  version: '1',
})
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
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

  @Get(':groupCode')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get group by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Retrieved group' })
  findOne(@Param('groupCode') groupCode: string) {
    return this.groupsService.findOne(groupCode)
  }

  @Patch(':groupCode')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update group' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Group updated successfully' })
  update(@Param('groupCode') groupCode: string, @Body() updateGroupDto: UpdateGroupDto) {
    return this.groupsService.update(groupCode, updateGroupDto)
  }

  @Delete(':groupCode')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete group' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Group deleted successfully' })
  remove(@Param('groupCode') groupCode: string) {
    return this.groupsService.remove(groupCode)
  }

  @Get(':groupCode/members')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get group members' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Retrieved group members' })
  getMembers(@Param('groupCode') groupCode: string) {
    return this.groupsService.getMembers(groupCode)
  }

  @Post('add/members')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add member to group' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Member added successfully' })
  addMember(@Body() data: AddMemberGroupDto) {
    return this.groupsService.addMember(data)
  }

  @Delete(':groupCode/members/:userCode')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove member from group' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Member removed successfully' })
  removeMember(@Param('groupCode') groupCode: string, @Param('userCode') userCode: string) {
    return this.groupsService.removeMember(groupCode, userCode)
  }

  @Post(':groupCode/members/bulk')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add multiple members to group' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Members added successfully' })
  addMembers(@Param('groupCode') groupCode: string, @Body() data: AddMembersGroupDto) {
    return this.groupsService.addMembers(groupCode, data.userCodes)
  }
}
