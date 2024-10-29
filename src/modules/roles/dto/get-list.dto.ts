import { IsInt, IsOptional, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Transform, Type } from 'class-transformer'

export class GetListDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'admin',
  })
  name?: string

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @ApiProperty({
    example: 1,
  })
  page?: number

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @ApiProperty({
    example: 10,
  })
  limit?: number
}
