import { HydratedDocument, Types } from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Injectable } from '@nestjs/common'

export type UserBadgesDocument = HydratedDocument<UserBadge>

@Injectable()
@Schema({ timestamps: true })
export class UserBadge {
  @Prop({ type: Types.ObjectId, ref: 'Users', required: true, unique: true })
  userId: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: 'Badges', required: true })
  badgeId: Types.ObjectId

  @Prop({ required: true })
  dateEarned: Date
}

export const UserBadgesSchema = SchemaFactory.createForClass(UserBadge)
