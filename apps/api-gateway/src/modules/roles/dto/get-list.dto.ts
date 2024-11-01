import { IsInt, IsOptional, IsString, IsNumber } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Transform, Type } from 'class-transformer'

export class GetListDto {
  @Type(() => String)
  @ApiProperty({
    example: 'name',
    required: false,
  })
  @IsOptional()
  search?: string

  @Type(() => Number)
  @IsInt()
  @ApiProperty({
    example: 1,
    required: false,
  })
  @IsOptional()
  id?: number

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
