import { Injectable } from '@nestjs/common'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'
import { IsDate, IsOptional, IsString, IsEnum } from 'class-validator'

export type UserRolesDocument = HydratedDocument<UserRoles>

enum RoleModelEnum {
  Roles = 'Roles',
  CustomRoles = 'CustomRoles',
}

@Injectable()
@Schema({ timestamps: true })
export class UserRoles {
  @Prop({ type: String, required: true })
  userCode: string

  @Prop({ type: String, required: true })
  roleCode: string

  @Prop({ type: Date, required: true })
  @IsDate()
  assignmentStartDate: Date

  @Prop({ type: Date })
  @IsOptional()
  @IsDate()
  assignmentEndDate?: Date

  @IsOptional()
  courseId?: string
}

export const UserRolesSchema = SchemaFactory.createForClass(UserRoles)
