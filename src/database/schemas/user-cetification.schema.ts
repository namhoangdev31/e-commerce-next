import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'
import { IsDate } from 'class-validator'
import { Users } from './users.schema'
import { Certification } from './cetifications.schema'

@Schema()
export class UserCertification {
  @Prop({ type: String, ref: 'Users', required: true })
  userCode: string

  @Prop({ type: String, ref: 'Certification', required: true })
  certificationId: string

  @Prop({ required: true })
  @IsDate()
  dateEarned: Date

  @Prop()
  @IsDate()
  expiryDate: Date
}

export type UserCertificationDocument = HydratedDocument<UserCertification>
export const UserCertificationSchema = SchemaFactory.createForClass(UserCertification)
