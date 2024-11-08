import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator'

export class UserGroup {
  @Prop({ required: true })
  @IsString()
  @IsNotEmpty()
  userCode: string

  @Prop({ required: true })
  @IsString()
  @IsNotEmpty()
  groupCode: string

  @Prop({ required: true, default: false })
  @IsBoolean()
  isAdmin: boolean

  @Prop({ required: true })
  createdAt: Date

  @Prop({ required: true })
  updatedAt: Date
}

export const UserGroupSchema = SchemaFactory.createForClass(UserGroup)

export type UserGroupDocument = HydratedDocument<UserGroup>
