import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'

export enum DynamicGroupRuleOperator {
  EQUAL = 'Equal',
  NOT_EQUAL = 'Not Equal',
  CONTAINS = 'Contains',
  NOT_CONTAINS = 'Not Contains',
  STARTS_WITH = 'Starts With',
  ENDS_WITH = 'Ends With',
}

export class DynamicGroupRule {
  @Prop({ type: Types.ObjectId, ref: 'Groups', required: true })
  groupCode: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: 'CustomFields', required: true })
  fieldID: Types.ObjectId

  @Prop({
    type: String,
    enum: DynamicGroupRuleOperator,
    required: true,
  })
  operator: DynamicGroupRuleOperator

  @Prop({ type: String, required: true })
  value: string
}

export const DynamicGroupRulesSchema = SchemaFactory.createForClass(DynamicGroupRule)

export type DynamicGroupRulesDocument = HydratedDocument<DynamicGroupRule>
