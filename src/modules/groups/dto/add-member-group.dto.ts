import { ArrayNotEmpty, IsArray, IsString } from 'class-validator'

export class AddMemberGroupDto {
  @IsString({
    message: 'groupCode must be a string',
  })
  groupCode: string

  @IsString({
    message: 'userCode must be a string',
  })
  userCode: string
}

export class AddMembersGroupDto {
  @IsArray({ message: 'userCodes must be an array' })
  @ArrayNotEmpty({ message: 'userCodes array must not be empty' })
  @IsString({ each: true, message: 'Each item in userCodes must be a string' })
  userCodes: string[]

  @IsString({ message: 'roleCode must be a string' })
  roleCode: string
}
