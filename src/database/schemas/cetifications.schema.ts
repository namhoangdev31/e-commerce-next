import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export class Certification {
  @Prop({ required: true })
  certificationName: string

  @Prop()
  description: string

  @Prop({ required: true })
  validityPeriod: string
}

export const CertificationSchema = SchemaFactory.createForClass(Certification)

export type CertificationDocument = HydratedDocument<Certification>
