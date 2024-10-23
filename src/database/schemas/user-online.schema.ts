import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { IsNotEmpty } from 'class-validator'

export type UserOnlineDocument = UserOnline & Document

export enum UserStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
}

@Schema({ timestamps: true })
export class UserOnline {
  @Prop({ type: Types.ObjectId, ref: 'Users', required: true, unique: true })
  @IsNotEmpty()
  userId: Types.ObjectId

  @Prop({ required: true })
  lastActiveAt: Date

  @Prop({
    required: true,
    default: UserStatus.ONLINE,
    enum: UserStatus,
  })
  status: UserStatus

  @Prop()
  deviceInfo: string

  @Prop()
  ipAddress: string
}

export const UserOnlineSchema = SchemaFactory.createForClass(UserOnline)

UserOnlineSchema.pre('find', function () {
  const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
  this.where({
    $or: [
      { lastActiveAt: { $gt: twoMinutesAgo } },
      { status: UserStatus.ONLINE }
    ]
  });
  this.updateMany(
    { lastActiveAt: { $lte: twoMinutesAgo }, status: UserStatus.ONLINE },
    { $set: { status: UserStatus.OFFLINE } }
  );
})

UserOnlineSchema.pre('findOne', function () {
  const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
  this.where({
    $or: [
      { lastActiveAt: { $gt: twoMinutesAgo } },
      { status: UserStatus.ONLINE }
    ]
  });
  this.updateOne(
    { lastActiveAt: { $lte: twoMinutesAgo }, status: UserStatus.ONLINE },
    { $set: { status: UserStatus.OFFLINE } }
  );
})
