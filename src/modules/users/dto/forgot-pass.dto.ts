import { IsEmail } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class ForgotPassDto {
  @IsEmail()
  @ApiProperty({ example: 'nguyenhoangnam31082000@gmail.com' })
  email: string

  @ApiProperty({ example: 'Nam310820@' })
  currentPassWord: string

  @ApiProperty({ example: 'Nam310820@' })
  newPassWord: string
}

export class ResetPassDto {
  @IsEmail()
  @ApiProperty({ example: 'nguyenhoangnam31082000@gmail.com' })
  email: string
}
