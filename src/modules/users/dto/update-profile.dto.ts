import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsOptional, IsEmail, Length } from 'class-validator'

export class UpdateProfileDto {
  @ApiProperty({
    description: 'First name of the user',
    example: 'John',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Length(2, 50)
  firstName?: string

  @ApiProperty({
    description: 'Last name of the user',
    example: 'Doe',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Length(2, 50)
  lastName?: string

  @ApiProperty({
    description: 'Email address of the user',
    example: 'john.doe@example.com',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  email?: string

  @ApiProperty({
    description: 'Phone number of the user',
    example: '+1234567890',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Length(10, 15)
  phone?: string

  @ApiProperty({
    description: 'Address of the user',
    example: '123 Main St, City, Country',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Length(5, 200)
  address?: string
}
