import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type DealDocument = Deal & HydratedDocument<Deal>;

export enum DealStatus {
  NEW = 'NEW',
  NEGOTIATION = 'NEGOTIATION',
  RESERVATION = 'RESERVATION',
  CLOSED_WON = 'CLOSED_WON',
  CLOSED_LOST = 'CLOSED_LOST',
}

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Deal {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true })
  value: number;

  @Prop({
    type: String,
    enum: DealStatus,
    default: DealStatus.NEW,
   
  })
  status: DealStatus;

  @Prop({
    type: Types.ObjectId,
    ref: 'Unit',
    required: true,
    index: true,
  })
  unit: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
   
  })
  salesAgent: Types.ObjectId;
  
  @Prop({
    type: Types.ObjectId,
    ref: 'Client',
    required: true,
   
  })
  client: Types.ObjectId;

  @Prop({ trim: true })
  notes: string;
}

export const DealSchema = SchemaFactory.createForClass(Deal);

/**
 * Performance Indexes
 */
DealSchema.index({ status: 1 });
DealSchema.index({ salesAgent: 1 });
DealSchema.index({ createdAt: -1 });