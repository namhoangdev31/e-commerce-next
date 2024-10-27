import { Injectable } from '@nestjs/common'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
import { IsNotEmpty, IsString } from 'class-validator'

export type RolesDocument = HydratedDocument<Roles>

@Injectable()
@Schema({ timestamps: true })
export class Roles {
  @Prop({ required: true, unique: true })
  @IsString()
  @IsNotEmpty()
  roleName: string

  @Prop()
  @IsString()
  description: string

  @Prop({ default: false })
  isSystem: boolean
}

export const RolesSchema = SchemaFactory.createForClass(Roles)
