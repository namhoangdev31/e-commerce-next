import { ApiProperty } from '@nestjs/swagger'

export class CreatePermissionDto {
  @ApiProperty({ example: 'ADMIN' })
  permissionName: string

  @ApiProperty({ example: 'This permission allows full access to all system features' })
  description: string
}
