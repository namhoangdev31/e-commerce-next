import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsArray, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { NavItemDto } from './navItem.dto';

export class HeaderDto {
  @ApiProperty({ type: [NavItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NavItemDto)
  navItems: NavItemDto[];

  @ApiProperty({ example: 'https://example.com/logo.png' })
  @IsString()
  @IsNotEmpty()
  logo_url: string;
}
