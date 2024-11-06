import { IsOptional, IsString } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'

export class SearchUserDto {
  @ApiPropertyOptional({
    description: 'Search term to match against email, firstName, or lastName',
    example: 'john',
  })
  @IsOptional()
  @IsString()
  username?: string
}
