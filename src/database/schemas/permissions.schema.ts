import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { IsEmpty, IsNotEmpty, IsString } from 'class-validator'
import { HydratedDocument, Types } from 'mongoose'
import { Injectable } from '@nestjs/common'

@Injectable()
@Schema({ timestamps: true })
export class Permissions {
  @Prop({ required: true, unique: true })
  @IsString()
  @IsNotEmpty()
  permissionId: string

  @Prop({ required: true })
  @IsString()
  @IsNotEmpty()
  permissionName: string

  @Prop()
  @IsString()
  @IsEmpty()
  description: string

  @Prop({ type: Types.ObjectId, ref: 'Modules' }) // FK to Permissions
  @IsNotEmpty()
  moduleId: Types.ObjectId
}

export type PermissionDocument = HydratedDocument<Permissions>

export const PermissionsSchema = SchemaFactory.createForClass(Permissions)
