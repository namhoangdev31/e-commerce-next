import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'
import { IsOptional, IsString, IsBoolean, IsNotEmpty } from 'class-validator'

export class Group {
  _id: Types.ObjectId

  @Prop({ required: true })
  @IsString()
  @IsNotEmpty()
  groupName: string

  @Prop({ required: true })
  @IsString()
  description: string

  @Prop({ type: Types.ObjectId, ref: 'Groups', required: false })
  @IsOptional()
  parentGroupId?: Types.ObjectId

  @Prop({ required: true, default: false })
  @IsBoolean()
  isDynamic: boolean
}

export const GroupSchema = SchemaFactory.createForClass(Group)

export type GroupDocument = HydratedDocument<Group>
