import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class NavItemDto {
  @ApiProperty({ example: 'Home' })
  @IsString()
  @IsNotEmpty()
  label: string;

  @ApiProperty({ example: '/home' })
  @IsString()
  @IsNotEmpty()
  url: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  position: number;

  @ApiProperty({ example: 'aadasdasd' })
  headerId: string;
}
