import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class CreatePermissionDto {
  @ApiProperty({ example: 'admin', required: true })
  @IsNotEmpty({
    message: 'Permission name is required',
  })
  @IsString()
  permissionName: string

  @ApiProperty({ example: 'ADMIN', required: true })
  @IsNotEmpty({
    message: 'Permission code is required',
  })
  permissionCode: string

  @ApiProperty({ example: 'This permission allows full access to all system features' })
  @IsString()
  @IsNotEmpty({
    message: 'Description is required',
  })
  description: string
}
