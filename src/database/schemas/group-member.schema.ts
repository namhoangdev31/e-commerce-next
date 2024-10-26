import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'

export class GroupMembership {
  @Prop({ type: Types.ObjectId, ref: 'Group', required: true })
  groupId: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId
}

export const GroupMembershipSchema = SchemaFactory.createForClass(GroupMembership)

export type GroupMembershipDocument = HydratedDocument<GroupMembership>