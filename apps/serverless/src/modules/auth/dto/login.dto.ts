import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @IsEmail()
  @ApiProperty({ example: 'nguyenhoangnam31082000@gmail.com' }) // Cập nhật ví dụ cho email
  email: string;

  @IsString()
  @ApiProperty({ example: 'Nam310820@' }) // Cập nhật ví dụ cho mật khẩu
  password: string;
}
