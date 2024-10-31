import { Injectable } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export type NavItemDocument = HydratedDocument<NavItem>;
@Injectable()
@Schema({ timestamps: true })
export class NavItem {
  @Prop({ required: true })
  @IsString()
  @IsNotEmpty()
  label: string;

  @Prop({ required: true })
  @IsString()
  @IsNotEmpty()
  url: string;

  @Prop({ required: true })
  @IsNumber()
  @IsNotEmpty()
  position: number;

  @Prop({ type: Types.ObjectId, ref: 'Header' })
  @IsString()
  @IsNotEmpty()
  headerId: string;
}

export const NavItemSchema = SchemaFactory.createForClass(NavItem);
