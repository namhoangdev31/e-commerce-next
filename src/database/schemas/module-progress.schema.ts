import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'

export type ModuleProgressDocument = HydratedDocument<ModuleProgress>

@Schema({ timestamps: true })
export class ModuleProgress {
  @Prop({ type: Types.ObjectId, ref: 'Module', required: true })
  moduleCode: Types.ObjectId

  @Prop({ default: false })
  completed: boolean

  @Prop({ type: Number, min: 0, max: 100, default: 0 })
  progressPercentage: number

  @Prop({ default: Date.now })
  lastAccessDate: Date
}

export const ModuleProgressSchema = SchemaFactory.createForClass(ModuleProgress)
