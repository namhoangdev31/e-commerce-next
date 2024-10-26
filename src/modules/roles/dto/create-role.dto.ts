import { IsNotEmpty, IsString, IsBoolean, IsOptional } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateRoleDto {
  @ApiProperty({ example: 'superAdmin', description: 'Name of the role' })
  @IsString()
  @IsNotEmpty()
  roleName: string

  @ApiProperty({
    example: 'Administrator role with full access',
    description: 'Description of the role',
  })
  @IsString()
  @IsOptional()
  description: string

  @ApiProperty({ example: false, description: 'Whether the role is a system role' })
  @IsBoolean()
  @IsOptional()
  isSystem: boolean
}
