import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type GuestDocument = HydratedDocument<Guest>

@Schema({ timestamps: true })
export class Guest {
  @Prop({ required: true })
  deviceId: string

  @Prop({ required: true })
  deviceType: string // 'mobile' | 'web' | 'tablet'

  @Prop()
  deviceModel?: string

  @Prop()
  deviceManufacturer?: string

  @Prop()
  osName?: string

  @Prop()
  osVersion?: string

  @Prop()
  browserName?: string

  @Prop()
  browserVersion?: string

  @Prop()
  ipAddress?: string
}

export const GuestSchema = SchemaFactory.createForClass(Guest)

