import { IsBoolean, IsNumber, IsString } from 'class-validator'

export class CreateGroupDto {
  @IsString()
  groupName: string

  @IsString()
  groupImage: string

  @IsBoolean()
  isActive: boolean

  @IsString()
  description: string

  @IsNumber()
  maxMembers: number
}
