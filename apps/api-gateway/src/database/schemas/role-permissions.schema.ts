import { Injectable } from '@nestjs/common'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
import { IsNotEmpty, IsString, IsEnum } from 'class-validator'

import { Roles } from './roles.schema'

export type RolePermissionsDocument = HydratedDocument<RolePermissions>

export enum AccessLevelEnum {
  READ = 'Read',
  WRITE = 'Write',
  DELETE = 'Delete',
  ALL = 'All',
}

@Injectable()
@Schema({ timestamps: true })
export class RolePermissions {
  @Prop({ type: String, refPath: 'Roles' })
  @IsNotEmpty()
  roleCode: string

  @Prop({ type: String, ref: 'Permissions' })
  @IsNotEmpty()
  permissionCode: string

  @Prop({ required: true, enum: AccessLevelEnum })
  @IsEnum(AccessLevelEnum)
  accessLevel: AccessLevelEnum
}

export const RolePermissionsSchema = SchemaFactory.createForClass(RolePermissions)
