import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class AddRoleUserDto {
  @ApiProperty({ example: 'ADMIN_ROLE' })
  @IsNotEmpty({ message: 'roleCode is empty' })
  roleCode: string

  @ApiProperty({ example: 1 })
  @IsNotEmpty({ message: 'userId is empty' })
  userId: string | any
}
