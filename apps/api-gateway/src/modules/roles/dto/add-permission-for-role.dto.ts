import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class AddPermissionForRoleDto {
  @ApiProperty({ example: 'ADMIN_ROLE' })
  @IsNotEmpty({ message: 'roleCode is empty' })
  @IsString()
  roleCode: string
  @ApiProperty({ example: 'ADMIN_PERMISSION' })
  @IsNotEmpty({ message: 'permissionCode is empty' })
  @IsString()
  permissionCode: string
  @ApiProperty({ example: 'READ' })
  @IsNotEmpty({ message: 'accessLevel is empty' })
  @IsString()
  accessLevel: string
}
