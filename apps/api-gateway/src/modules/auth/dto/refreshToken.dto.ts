import { IsNotEmpty, IsString } from 'class-validator'

export class RefreshTokenDto {
  @IsNotEmpty({ message: 'refreshToken is emtpy' })
  @IsString()
  refreshToken: string

  @IsNotEmpty({ message: 'userId is emtpy' })
  @IsString()
  userId: string
}
