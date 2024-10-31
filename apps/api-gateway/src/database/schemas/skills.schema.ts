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
  skillName: string // SkillName

  @Prop({ type: String })
  @IsString()
  description?: string // Description (optional)
}

export const SkillsSchema = SchemaFactory.createForClass(Skills)
