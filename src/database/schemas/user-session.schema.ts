import { Injectable } from '@nestjs/common'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'
import { IsBoolean, IsDate, IsOptional, IsString } from 'class-validator'

export type UserSessionDocument = HydratedDocument<UserSession>

@Injectable()
@Schema({ timestamps: true })
export class UserSession {
  @Prop({ type: String, required: true })
  @IsString()
  userCode: string

  @Prop()
  @IsOptional()
  @IsString()
  token: string

  @Prop({ required: true })
  @IsDate()
  expiresAt: Date

  @Prop({ default: false })
  @IsBoolean()
  isRevoked: boolean

  @Prop()
  @IsOptional()
  @IsString()
  userAgent: string

  @Prop()
  @IsOptional()
  @IsString()
  ipAddress: string

  @Prop({ default: false })
  @IsBoolean()
  isOnline: boolean

  @Prop()
  @IsDate()
  lastActiveAt: Date
}

export const UserSessionSchema = SchemaFactory.createForClass(UserSession)

UserSessionSchema.index({ userCode: 1, token: 1 }, { unique: true })

UserSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })
