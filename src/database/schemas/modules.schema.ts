import { IsEmpty, IsNotEmpty, IsString } from 'class-validator'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Injectable } from '@nestjs/common'
import { HydratedDocument } from 'mongoose'

export type ModulesDocument = HydratedDocument<Modules>

@Injectable()
@Schema({ timestamps: true })
export class Modules {
  @Prop({ required: true, unique: true })
  @IsString()
  @IsNotEmpty()
  moduleID: string

  @Prop({ required: true })
  @IsNotEmpty()
  @IsString()
  moduleName: string

  @Prop()
  @IsString()
  @IsEmpty()
  description: string
}

export const ModuleSchema = SchemaFactory.createForClass(Modules)
