import { Injectable } from '@nestjs/common'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'
import { IsString, IsBoolean, IsEnum } from 'class-validator'

export type UserSkillsDocument = HydratedDocument<UserSkills>

enum ProficiencyLevel {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  EXPERT = 'Expert',
}

@Injectable()
@Schema({ timestamps: true })
export class UserSkills {
  @Prop({ type: String, required: true })
  userCode: string

  @Prop({ type: String, required: true })
  skillCode: string

  @Prop({ required: true, enum: ProficiencyLevel })
  @IsEnum(ProficiencyLevel)
  proficiencyLevel: ProficiencyLevel

  @Prop({ required: true })
  @IsBoolean()
  selfAssessed: boolean
}

export const UserSkillsSchema = SchemaFactory.createForClass(UserSkills)
