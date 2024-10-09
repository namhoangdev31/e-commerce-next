import { HydratedDocument, Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty, IsString } from 'class-validator';

export type HeaderDocument = HydratedDocument<Header>;

@Injectable()
@Schema({ timestamps: true })
export class Header {
  @Prop({ type: [{ type: Types.ObjectId, ref: 'NavItem' }] })
  navItems: Types.ObjectId[];

  @Prop({ required: true })
  @IsString()
  @IsNotEmpty()
  logo_url: string;
}

export const HeaderSchema = SchemaFactory.createForClass(Header);
