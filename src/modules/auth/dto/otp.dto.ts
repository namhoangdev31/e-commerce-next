import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'
import { Prop } from '@nestjs/mongoose'

export class OtpDto {
  @ApiProperty({ example: '234232' })
  @IsString()
  @Prop({ required: true })
  otpContent: string
}
