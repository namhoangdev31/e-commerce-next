import { Injectable } from '@nestjs/common'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'
import { IsDate, IsNotEmpty } from 'class-validator'
import { Users } from './users.schema'
import { UserSkills } from './user-skills.schema'

export type SkillEndorsementsDocument = HydratedDocument<SkillEndorsements>

@Injectable()
@Schema({ timestamps: true })
export class SkillEndorsements {
  @Prop({ required: true, unique: true })
  @IsNotEmpty()
  endorsementId: string

  @Prop({ type: Types.ObjectId, ref: 'UserSkills', required: true })
  userSkillId: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: 'Users', required: true })
  endorserId: Types.ObjectId

  @Prop({ required: true })
  @IsDate()
  endorsementDate: Date
}

export const SkillEndorsementsSchema = SchemaFactory.createForClass(SkillEndorsements)
