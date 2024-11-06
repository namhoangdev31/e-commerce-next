import { IsEmail, IsNotEmpty, IsString, IsOptional, IsBoolean, IsDate } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class UpdateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  _id: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  username?: string

  @ApiPropertyOptional()
  @IsEmail()
  @IsOptional()
  email?: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  passwordHash?: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  firstName?: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  lastName?: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  profilePictureUrl?: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  refreshToken?: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  otpConfirm?: string

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isValidateEmail?: boolean

  @ApiPropertyOptional()
  @IsDate()
  @IsOptional()
  timeUpdateOtp?: Date

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  termPassword?: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  roleCode?: string
}
