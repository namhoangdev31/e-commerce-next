import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class CreateNonUserDto {
  deviceId: string

  deviceType: string

  deviceModel?: string

  deviceManufacturer?: string

  osName?: string

  osVersion?: string

  browserName?: string

  browserVersion?: string

  ipAddress?: string
}

export class GuestDto {
  @ApiProperty({
    description: 'JWT token',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  })
  @IsString()
  jwtToken: string
}
