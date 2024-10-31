import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'
import { IsDate } from 'class-validator'
import { Users } from './users.schema'
import { Certification } from './cetifications.schema'

@Schema()
export class UserCertification {
  @Prop({ type: Types.ObjectId, ref: 'Users', required: true })
  userId: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: 'Certification', required: true })
  certificationId: Types.ObjectId

  @Prop({ required: true })
  @IsDate()
  dateEarned: Date

  @Prop()
  @IsDate()
  expiryDate: Date
}

export type UserCertificationDocument = HydratedDocument<UserCertification>
export const UserCertificationSchema = SchemaFactory.createForClass(UserCertification)
