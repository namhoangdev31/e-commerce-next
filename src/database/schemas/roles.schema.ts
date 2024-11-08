import { Injectable } from '@nestjs/common'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export type RolesDocument = HydratedDocument<Roles>

@Injectable()
@Schema({ timestamps: true })
export class Roles {
  @Prop({ required: true, unique: true, type: String })
  @IsString()
  @IsNotEmpty({ message: 'Role name is required' })
  roleName: string

  @Prop({ type: String })
  @IsString()
  @IsOptional()
  description: string

  @Prop({ default: false, type: Boolean })
  @IsBoolean()
  @IsOptional()
  isSystem: boolean

  @Prop({ type: [Types.ObjectId], ref: 'Modules' })
  modules: Types.ObjectId[]
}

export const RolesSchema = SchemaFactory.createForClass(Roles)
