import { IsOptional, IsString, IsEmail, IsBoolean } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'

export class FilterUserDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  username?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  firstName?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  lastName?: string
}
