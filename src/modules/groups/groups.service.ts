import { Injectable } from '@nestjs/common'
import { CreateGroupDto } from './dto/create-group.dto'
import { UpdateGroupDto } from './dto/update-group.dto'
import { AddMemberGroupDto } from './dto/add-member-group.dto'

@Injectable()
export class GroupsService {
  create(createGroupDto: CreateGroupDto) {
    return 'This action adds a new group'
  }

  findAll() {
    return `This action returns all groups`
  }

  findOne(groupCode: string) {
    return `This action returns a #${groupCode} group`
  }

  update(groupCode: string, updateGroupDto: UpdateGroupDto) {
    return `This action updates a #${groupCode} group`
  }

  remove(groupCode: string) {
    return `This action removes a #${groupCode} group`
  }

  getMembers(groupCode: string) {
    return `This action returns members of group #${groupCode}`
  }

  addMember(data: AddMemberGroupDto) {
    return `This action adds user #${data.userCode} to group #${data.groupCode}`
  }

  removeMember(groupCode: string, userCode: string) {
    return `This action removes user #${userCode} from group #${groupCode}`
  }

  addMembers(groupCode: string, userCodes: string[]) {
    return `This action adds users ${userCodes.join(', ')} to group #${groupCode}`
  }
}
