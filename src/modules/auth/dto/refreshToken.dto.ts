import { IsNotEmpty, IsString } from 'class-validator'

export class RefreshTokenDto {
  @IsNotEmpty({ message: 'refreshToken is emtpy' })
  @IsString()
  refreshToken: string

  @IsNotEmpty({ message: 'userCode is emtpy' })
  @IsString()
  userCode: string
}
