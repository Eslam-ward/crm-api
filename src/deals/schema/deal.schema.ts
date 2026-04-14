import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { DealStatus } from '../enums/deal-status.enums';
import { PaymentType } from '../enums/payment-type.enums';

export type DealDocument = Deal & HydratedDocument<Deal>;



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
   
  })
  client: Types.ObjectId;

  @Prop({ trim: true })
  notes: string;
  @Prop({default:Date.now})
  createdAt:Date

  @Prop({
    type: String,
    enum: PaymentType,
  })
  paymentType: PaymentType;
   @Prop({
    type: Number,
    min: 0,
  })
  paidAmount: number;

   @Prop({
    type: Number,
    min: 0,
  })
  commissionAmount: number;

  @Prop({ type: String, trim: true })
   createdBy: string;
  

  @Prop({
    type: Number,
    min: 0,
  })
  remainingAmount: number;
  @Prop({
    type: Number,
    min: 0,
  })
  requiredAmount:number
}


export const DealSchema = SchemaFactory.createForClass(Deal);

/**
 * Performance Indexes
 */
DealSchema.index({ status: 1 });
DealSchema.index({ salesAgent: 1 });
DealSchema.index({ createdAt: -1 });
DealSchema.index({ client: 1 })