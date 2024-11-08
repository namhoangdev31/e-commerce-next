import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'
import { IsOptional, IsString, IsBoolean, IsNotEmpty, IsNumber } from 'class-validator'

export class Group {

  @Prop({ required: true })
  @IsString()
  @IsNotEmpty()
  groupName: string

  @Prop({ required: true })
  @IsString()
  description: string

  @Prop({ type: String, required: false })
  @IsOptional()
  parentGroupId?: string

  @Prop({ required: true, default: false })
  @IsBoolean()
  isActive: boolean

  @Prop({ required: true, default: 'chat', type: 'varchar' })
  @IsString()
  type: string

  @Prop({ required: true, default: 10 })
  @IsNumber()
  maxMembers: number
}

export const GroupSchema = SchemaFactory.createForClass(Group)

export type GroupDocument = HydratedDocument<Group>
