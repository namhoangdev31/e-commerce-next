import { HydratedDocument, Types } from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Injectable } from '@nestjs/common'

export type UserBadgesDocument = HydratedDocument<UserBadge>

@Injectable()
@Schema({ timestamps: true })
export class UserBadge {
  @Prop({ type: String, required: true })
  userCode: string

  @Prop({ type: String, required: true })
  badgeCode: string

  @Prop({ required: true })
  dateEarned: Date
}

export const UserBadgesSchema = SchemaFactory.createForClass(UserBadge)
