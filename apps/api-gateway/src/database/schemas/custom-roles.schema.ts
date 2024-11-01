import { Injectable } from '@nestjs/common'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
import { IsNotEmpty, IsString, IsOptional } from 'class-validator'
import { Types } from 'mongoose'
import { Roles } from './roles.schema' // Assuming Roles schema is in a separate file

export type CustomRolesDocument = HydratedDocument<CustomRoles>

@Injectable()
@Schema({ timestamps: true })
export class CustomRoles {
  @Prop({ required: true })
  @IsString()
  @IsNotEmpty()
  roleName: string

  @Prop()
  @IsString()
  description: string

  @Prop({ type: Types.ObjectId, ref: 'Roles' }) // FK to Roles (ParentRoleID)
  @IsOptional()
  parentRoleId: Types.ObjectId
}

export const CustomRolesSchema = SchemaFactory.createForClass(CustomRoles)
