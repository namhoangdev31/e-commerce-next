import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { IsEnum, IsNotEmpty, IsString, Length } from 'class-validator'
import { HydratedDocument } from 'mongoose'
import { Injectable } from '@nestjs/common'

export enum ElementType {
  module = 'Module',
  lesson = 'Lesson',
  activity = 'Activity',
}

@Injectable()
@Schema({ timestamps: true })
export class Courses {
  @Prop({ required: true, unique: true })
  @IsString()
  @IsNotEmpty()
  courseId: string

  @Prop({ required: true, unique: true })
  @IsString()
  @IsNotEmpty()
  elementId: string

  @Prop({ required: true, enum: ElementType })
  @IsEnum(ElementType)
  elementType: ElementType

  @Prop({ required: true })
  parentElementID: string

  @Prop({ required: true })
  @IsString()
  orderIndex: string

  @Prop({ required: true })
  @Length(8, 256, {
    message: 'The title must be between 8 and 256 characters',
  })
  @IsString()
  title: string

  @Prop({ required: true })
  @Length(0, 512, {
    message: 'The description must be between 0 and 512 characters',
  })
  @IsString()
  description: string
}

export const CoursesSchema = SchemaFactory.createForClass(Courses)

export type CourseDocument = HydratedDocument<Courses>
