import { Injectable } from '@nestjs/common'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
import { IsEmail, IsNotEmpty, IsString, IsOptional } from 'class-validator'

export type UsersDocument = HydratedDocument<Users>

@Injectable()
@Schema({ timestamps: true })
export class Users {
  @Prop({ required: true, unique: true })
  @IsString()
  @IsNotEmpty()
  username: string

  @Prop({ required: true, unique: true })
  @IsEmail()
  @IsNotEmpty()
  email: string

  @Prop({ required: true })
  @IsString()
  @IsNotEmpty()
  passwordHash: string

  @Prop({ required: true })
  @IsString()
  @IsNotEmpty()
  firstName: string

  @Prop({ required: true })
  @IsString()
  @IsNotEmpty()
  lastName: string

  @Prop()
  @IsOptional()
  @IsString()
  profilePictureUrl?: string

  @Prop()
  @IsOptional()
  @IsString()
  refreshToken: string
}

export const UsersSchema = SchemaFactory.createForClass(Users)
