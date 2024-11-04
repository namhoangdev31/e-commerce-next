import { IsNotEmpty, IsString, IsBoolean, IsOptional } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Message } from '../../messages/entities/message.entity'
import { MESSAGE_REQUIRED } from '../../../shared/constants/strings.constants'

export class CreateRoleDto {
  @ApiProperty({
    example: 'Administrator',
    description: 'Name of the role',
    required: true,
  })
  @IsString()
  @IsNotEmpty({
    message: MESSAGE_REQUIRED,
  })
  roleName: string

  @ApiProperty({
    example: 'Administrator role with full access',
    description: 'Description of the role',
  })
  @IsString()
  @IsOptional()
  description: string

  @ApiProperty({
    example: false,
    description: 'Whether the role is a system role',
    default: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isSystem: boolean
}
