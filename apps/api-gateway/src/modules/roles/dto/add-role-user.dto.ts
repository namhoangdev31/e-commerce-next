import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class AddRoleUserDto {
  @ApiProperty({ example: 'ADMIN_ROLE' })
  @IsNotEmpty({ message: 'roleCode is empty' })
  roleCode: string

  @ApiProperty({ example: 'hoangnam' })
  @IsNotEmpty({ message: 'username is empty' })
  username: string
}
