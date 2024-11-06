import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
import { IsDate, IsString, IsOptional, IsEnum } from 'class-validator'

export enum ActivityType {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  UPDATE_PROFILE = 'UPDATE_PROFILE',
  CHANGE_PASSWORD = 'CHANGE_PASSWORD',
  CREATE_USER = 'CREATE_USER',
  DELETE_USER = 'DELETE_USER'
}

@Schema({ timestamps: true })
export class UserLog {
  @Prop({ type: String, required: true, ref: 'Users' })
  @IsString()
  userCode: string

  @Prop({
    type: String,
    enum: ActivityType,
    required: true
  })
  @IsEnum(ActivityType)
  activityType: ActivityType

  @Prop({ required: true })
  @IsDate()
  logDate: Date

  @Prop({ required: true })
  @IsString()
  details: string

  @Prop()
  @IsString()
  @IsOptional()
  ipAddress?: string

  @Prop()
  @IsString()
  @IsOptional()
  browser?: string

  @Prop()
  @IsString()
  @IsOptional()
  device?: string

  @Prop()
  @IsString()
  @IsOptional()
  location?: string

  @Prop({ type: String, ref: 'Users' })
  @IsString()
  @IsOptional()
  modifiedBy?: string
}

export type UserLogDocument = HydratedDocument<UserLog>
export const UserLogSchema = SchemaFactory.createForClass(UserLog)

UserLogSchema.index({ userCode: 1, logDate: -1 })
UserLogSchema.index({ activityType: 1 })
