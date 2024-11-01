import { HydratedDocument, Types } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ModuleProgress } from './module-progress.schema'

enum CourseStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  ARCHIVED = 'archived',
}

export type UserCourseProgressDocument = HydratedDocument<UserCourseProgress>

@Injectable()
@Schema({ timestamps: true })
export class UserCourseProgress {
  @Prop({ type: Types.ObjectId, ref: 'Users', required: true })
  userId: Types.ObjectId

  @Prop({ required: true })
  courseId: string

  @Prop({ type: Number, min: 0, max: 100, default: 0 })
  progressPercentage: number

  @Prop({ default: Date.now })
  lastAccessDate: Date

  @Prop({ default: Date.now })
  startDate: Date

  @Prop()
  completionDate: Date

  @Prop([{ type: Types.ObjectId, ref: 'ModuleProgress' }])
  moduleProgress: ModuleProgress[]

  @Prop({ default: 0 })
  timeSpent: number

  @Prop({
    type: String,
    enum: CourseStatus,
    default: CourseStatus.NOT_STARTED,
  })
  status: CourseStatus
}

export const UserCourseProgressSchema = SchemaFactory.createForClass(UserCourseProgress)
UserCourseProgressSchema.index({ userId: 1, courseId: 1 }, { unique: true })
