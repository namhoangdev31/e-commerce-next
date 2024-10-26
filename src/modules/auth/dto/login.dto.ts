import { IsEmail, IsNotEmpty, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class LoginDto {
  @IsEmail()
  @IsNotEmpty({ message: 'Email is required' })
  @ApiProperty({ example: 'nguyenhoangnam31082000@gmail.com' })
  email: string

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @ApiProperty({ example: 'Nam310820@' })
  password: string
}
