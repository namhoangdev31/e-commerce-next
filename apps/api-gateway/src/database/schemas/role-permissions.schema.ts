import { Injectable } from '@nestjs/common'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
import { IsNotEmpty, IsString, IsEnum } from 'class-validator'
import { Types } from 'mongoose'
import { Roles } from './roles.schema'

export type RolePermissionsDocument = HydratedDocument<RolePermissions>

export enum AccessLevelEnum {
  READ = 'Read',
  WRITE = 'Write',
  DELETE = 'Delete',
}

@Injectable()
@Schema({ timestamps: true })
export class RolePermissions {
  @Prop({ type: Types.ObjectId, refPath: 'roleModel' })
  @IsNotEmpty()
  roleId: Types.ObjectId // FK to Roles or CustomRolesEntity

  @Prop({ type: String, required: true, enum: ['Roles', 'CustomRoles'] })
  @IsString()
  @IsNotEmpty()
  roleModel: string

  @Prop({ type: Types.ObjectId, ref: 'Permissions' }) // FK to Permissions
  @IsNotEmpty()
  permissionId: Types.ObjectId

  @Prop({ required: true, enum: AccessLevelEnum })
  @IsEnum(AccessLevelEnum)
  accessLevel: AccessLevelEnum
}

export const RolePermissionsSchema = SchemaFactory.createForClass(RolePermissions)
