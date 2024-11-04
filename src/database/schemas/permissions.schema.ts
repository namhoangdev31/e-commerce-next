import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { IsEmpty, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { HydratedDocument, Types } from 'mongoose'
import { Injectable } from '@nestjs/common'

@Injectable()
@Schema({ timestamps: true })
export class Permissions {
  @Prop({ required: true, unique: true, type: String })
  @IsString()
  @IsNotEmpty({
    message: 'Permission name is required',
  })
  permissionName: string

  @Prop()
  @IsString()
  @IsEmpty()
  description: string

  @Prop({ type: Types.ObjectId, ref: 'Modules' })
  @IsEmpty()
  @IsOptional()
  moduleId: Types.ObjectId
}

export type PermissionDocument = HydratedDocument<Permissions>

export const PermissionsSchema = SchemaFactory.createForClass(Permissions)
