import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import {
  INVALID_PASSWORD_FORMAT,
  INVALID_PASSWORD_LENGTH,
} from '../../../shared/constants/strings.constants'

export class RegisterDto {
  @IsString()
  @MinLength(2)
  @MaxLength(25)
  @ApiProperty({ example: 'hoangnam' })
  username: string

  @IsEmail()
  @ApiProperty({ example: 'nguyenhoangnam31082000@gmail.com' })
  email: string

  @IsString()
  @MinLength(8, { message: INVALID_PASSWORD_LENGTH })
  @Matches(/(?=.*[A-Za-z])(?=.*\d)(?=.*[$@!%*^#?&])/, {
    message: INVALID_PASSWORD_FORMAT,
  })
  @ApiProperty({ example: 'Nam310820@' })
  password: string

  @IsString()
  @ApiProperty({ example: 'Hoang' })
  firstName: string

  @IsString()
  @ApiProperty({ example: 'Nam' })
  lastName: string
}
