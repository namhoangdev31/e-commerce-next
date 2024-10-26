import { Injectable } from '@nestjs/common'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
import { IsBoolean, IsString } from 'class-validator'

export type CustomFieldsDocument = HydratedDocument<CustomFields>

@Injectable()
@Schema({ timestamps: true })
export class CustomFields {
  @Prop({ required: true })
  @IsString()
  fieldName: string // FieldName

  @Prop({ required: true })
  @IsString()
  fieldType: string // FieldType (e.g., Text, Date, Number)

  @Prop({ required: true })
  @IsBoolean()
  isUserDefined: boolean // IsUserDefined (Boolean)

  @Prop({ required: true })
  @IsString()
  privacySetting: string // PrivacySetting (e.g., Public, Private)
}

export const CustomFieldsSchema = SchemaFactory.createForClass(CustomFields)
