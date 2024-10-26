import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
import { IsNotEmpty, IsString, IsUrl } from 'class-validator'
import { Injectable } from '@nestjs/common'

export type BadgesDocument = HydratedDocument<Badges>

@Injectable()
@Schema({ timestamps: true })
export class Badges {
  @Prop({ required: true })
  @IsNotEmpty()
  @IsString()
  badgeName: string

  @Prop()
  @IsString()
  description: string

  @Prop()
  @IsUrl()
  imageUrl: string
}

export const BadgesSchema = SchemaFactory.createForClass(Badges)
