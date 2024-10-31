import { IsInt, IsOptional, IsString, IsNumber } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Transform, Type } from 'class-transformer'

export class GetListDto {
  @IsOptional()
  @Type(() => String)
  @ApiProperty({
    example: 'name',
  })
  search?: string

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @ApiProperty({
    example: 1,
  })
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
