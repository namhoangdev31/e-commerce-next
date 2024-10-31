import { IsEmail } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class ChangePassDto {
  @ApiProperty({ example: 'Nam310820@' })
  currentPassWord: string

  @ApiProperty({ example: 'Nam310820@' })
  newPassWord: string
}
