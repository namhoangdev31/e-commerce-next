import { Injectable } from '@nestjs/common'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'
import { IsString, IsOptional } from 'class-validator'
import { Users } from './users.schema' // Assuming Users schema exists
import { CustomFields } from './custom-fields.schema' // Assuming CustomFieldsEntity schema exists

export type UserCustomFieldValuesDocument = HydratedDocument<UserCustomFieldValues>

@Injectable()
@Schema({ timestamps: true })
export class UserCustomFieldValues {
  @Prop({ type: Types.ObjectId, ref: 'Users', required: true }) // FK to Users
  userId: Types.ObjectId // Foreign Key to Users

  @Prop({ type: Types.ObjectId, ref: 'CustomFields', required: true }) // FK to CustomFieldsEntity
  customFieldId: Types.ObjectId // Foreign Key to CustomFieldsEntity

  @Prop({ required: true })
  @IsString()
  fieldValue: string // FieldValue
}

export const UserCustomFieldValuesSchema = SchemaFactory.createForClass(UserCustomFieldValues)
