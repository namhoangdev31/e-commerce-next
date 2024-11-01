import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'
import { Prop } from '@nestjs/mongoose'

export class OtpDto {
  @ApiProperty({ example: '234232' })
  @IsString()
  @IsNotEmpty({ message: 'otpContent is empty' })
  @Prop({ required: true })
  otpContent: string
}
