import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class AddRoleUserDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty({ message: 'roleId is empty' })
  roleId: string | any

  @ApiProperty({ example: 1 })
  @IsNotEmpty({ message: 'userId is empty' })
  userId: string | any
}
