import { IsNotEmpty, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class AddPermissionForRoleDto {
  @IsNotEmpty({
    message: 'Role code is required',
  })
  @IsString()
  @ApiProperty({
    example: 'ADMIN_ROLE',
  })
  roleCode: string

  @IsNotEmpty({
    message: 'Permission code is required',
  })
  @IsString()
  @ApiProperty({
    example: 'ADMIN_PERMISSION',
  })
  permissionCode: string

  @IsNotEmpty({
    message: 'Access level is required',
  })
  @IsString()
  @ApiProperty({
    example: 'All',
  })
  accessLevel: string
}
