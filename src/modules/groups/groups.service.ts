import { Injectable } from '@nestjs/common'
import { CreateGroupDto } from './dto/create-group.dto'
import { UpdateGroupDto } from './dto/update-group.dto'

@Injectable()
export class GroupsService {
  create(createGroupDto: CreateGroupDto) {
    return 'This action adds a new group'
  }

  findAll() {
    return `This action returns all groups`
  }

  findOne(groupId: string) {
    return `This action returns a #${groupId} group`
  }

  update(groupId: string, updateGroupDto: UpdateGroupDto) {
    return `This action updates a #${groupId} group`
  }

  remove(groupId: string) {
    return `This action removes a #${groupId} group`
  }

  getMembers(groupId: string) {
    return `This action returns members of group #${groupId}`
  }

  addMember(groupId: string, userCode: string) {
    return `This action adds user #${userCode} to group #${groupId}`
  }

  removeMember(groupId: string, userCode: string) {
    return `This action removes user #${userCode} from group #${groupId}`
  }

  addMembers(groupId: string, userCodes: string[]) {
    return `This action adds users ${userCodes.join(', ')} to group #${groupId}`
  }
}
