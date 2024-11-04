import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'
import { IsDate, IsNotEmpty } from 'class-validator'
import { Users } from './users.schema'
import { Injectable } from '@nestjs/common'

export type UserAchievementsDocument = HydratedDocument<UserAchievements>

@Injectable()
@Schema({ timestamps: true })
export class UserAchievements {
  @Prop({ type: String, ref: 'Users', required: true })
  userCode: string

  @Prop({ required: true })
  achievementId: string

  @Prop({ required: true })
  @IsDate()
  dateEarned: Date
}

export const UserAchievementsSchema = SchemaFactory.createForClass(UserAchievements)
