import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class RoleCheckDto {
  @ApiProperty({
    example: '',
  })
  @IsString({
    message: 'UserCode is required!',
  })
  userCode: string
}
