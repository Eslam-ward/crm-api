import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Developer } from '../../developers/schema/developer.schema';

export type UnitDocument = HydratedDocument<Unit>;

export enum UnitStatus {
  AVAILABLE = 'available',
  RESERVED = 'reserved',
  SOLD = 'sold',
}

export enum UnitType {
  APARTMENT = 'apartment',
  VILLA = 'villa',
  STUDIO = 'studio',
}

@Schema({ timestamps: true })
export class Unit {

  @Prop({ required: true, unique: true })
  unitCode: string;

  @Prop({ required: true, enum: UnitType })
  type: string;

  @Prop({ required: true })
  purpose: string;

  @Prop({ required: true })
  area: string;

  @Prop()
  phase: string;

  @Prop()
  floor: number;

  @Prop()
  apartmentNumber: string;

  @Prop({
    type: Types.ObjectId,
    ref: Developer.name,
    required: true,
    
  })
  developer: Types.ObjectId;

  @Prop({ required: true })
  price: number;

  @Prop({
    type: String,
    enum: UnitStatus,
    default: UnitStatus.AVAILABLE,
  })
  status: string;

  @Prop()
  properties: {
    size: number;
  };

  @Prop()
  bedrooms: number;

  @Prop()
  bathroom: number;

  @Prop({ type: [String] })
  images: string[];
}

export const UnitSchema = SchemaFactory.createForClass(Unit);