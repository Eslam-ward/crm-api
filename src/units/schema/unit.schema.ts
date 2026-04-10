import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { UnitStatus } from '../enums/unit-status.enum';
import { UnitType } from '../enums/unit-type.enum';
import { UnitPurpose } from '../enums/unit-purpose.enum';

export type UnitDocument = Unit & Document;

@Schema({ timestamps: true })
export class Unit {
  @Prop({ type: Types.ObjectId, ref: 'Project', required: true, index: true })
  project: Types.ObjectId;

  @Prop({ required: true, trim: true, unique: true, index: true })
  unitCode: string;

  @Prop({
    type: String,
    enum: UnitType,
    required: true,
    index: true,
  })
  type: UnitType;

  @Prop({
    type: String,
    enum: UnitPurpose,
    required: true,
  })
  purpose: UnitPurpose;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({
    type: Types.ObjectId,
    ref: 'Area',
    required: true,
    index: true,
  })
  area: Types.ObjectId;

  @Prop({ min: 0 })
  floor: number;

  @Prop({ trim: true })
  location: string;

  @Prop({ min: 0 })
  apartmentNumber: number;

  @Prop({ required: true, min: 0 })
  bedrooms: number;

  @Prop({ required: true, min: 0 })
  bathrooms: number;

  @Prop({
    type: String,
    enum: UnitStatus,
    default: UnitStatus.AVAILABLE,
    required: true,
    index: true,
  })
  status: UnitStatus;

  @Prop({
    type: String,
  })
  paymentType: string;
  @Prop({
    type: String,
  })
 createdBy: string;

  @Prop({ required: true, min: 0 })
  size: number;
  @Prop({ type: [String], required: true })
  images: string[];

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop()
  group: string;

  @Prop()
  building: string;

  @Prop()
  block: string;

  @Prop()
  villaNumber: string;

  @Prop()
  notes: string;
}

export const UnitSchema = SchemaFactory.createForClass(Unit);
