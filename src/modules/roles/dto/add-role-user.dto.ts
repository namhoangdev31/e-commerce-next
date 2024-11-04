import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class AddRoleUserDto {
  @ApiProperty({ example: '_id' })
  @IsNotEmpty({ message: 'roleCode is empty' })
  roleCode: string

  @ApiProperty({ example: 'hoangnam' })
  @IsNotEmpty({ message: 'username is empty' })
  userCode: string
}
