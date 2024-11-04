import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
import { IsNotEmpty, IsString, IsUrl } from 'class-validator'
import { Injectable } from '@nestjs/common'
import { Unique } from 'typeorm'

export type BadgesDocument = HydratedDocument<Badges>

@Injectable()
@Schema({ timestamps: true })
@Unique(['badgeName', 'badgeCode'])
export class Badges {
  @Prop({ required: true })
  @IsNotEmpty()
  @IsString()
  badgeName: string

  @Prop({ required: true })
  @IsNotEmpty()
  @IsString()
  badgeCode: string

  @Prop()
  @IsString()
  description: string

  @Prop()
  @IsUrl()
  imageUrl: string
}

export const BadgesSchema = SchemaFactory.createForClass(Badges)
