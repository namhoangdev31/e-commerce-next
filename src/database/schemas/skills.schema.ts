import { Injectable } from '@nestjs/common'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
import { IsString, IsNotEmpty } from 'class-validator'

export type SkillsDocument = HydratedDocument<Skills>

@Injectable()
@Schema({ timestamps: true })
export class Skills {
  @Prop({ required: true })
  @IsString()
  @IsNotEmpty()
  skillName: string

  @Prop({ type: String })
  @IsString()
  description?: string
}

export const SkillsSchema = SchemaFactory.createForClass(Skills)
