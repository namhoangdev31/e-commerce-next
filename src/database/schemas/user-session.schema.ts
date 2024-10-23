import { Injectable } from '@nestjs/common'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'
import { IsOptional } from 'class-validator'

export type UserSessionDocument = HydratedDocument<UserSession>

@Injectable()
@Schema({ timestamps: true })
export class UserSession {
  @Prop({ type: Types.ObjectId, ref: 'Users', required: true, unique: true })
  userId: Types.ObjectId

  @Prop()
  @IsOptional()
  token: string

  @Prop({ required: true })
  expiresAt: Date

  @Prop({ default: false })
  isRevoked: boolean

  @Prop()
  userAgent: string

  @Prop()
  ipAddress: string

  @Prop({ default: false })
  isOnline: boolean

  @Prop()
  lastActiveAt: Date
}

export const UserSessionSchema = SchemaFactory.createForClass(UserSession)

UserSessionSchema.index({ userId: 1, token: 1 }, { unique: true })

UserSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })
