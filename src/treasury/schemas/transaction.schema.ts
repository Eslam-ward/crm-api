import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { TransactionType } from '../enums/transaction-type.enum';

@Schema({ timestamps: true })
export class Transaction {

  @Prop({
    type: String,
    enum: TransactionType,
    required: true,
  })
  type: TransactionType;

  @Prop({
    type: Number,
    required: true,
    min: 0,
  })
  amount: number;

  @Prop({
    required: true,
  })
  category: string;

  @Prop({
      type: String,
  })
  source: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'Deal',
  })
  linkedDeal?: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
  })
  salesAgent?: Types.ObjectId;

  @Prop({
    required: true,
  })
  date: Date;

  @Prop()
  notes?: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  createdBy: Types.ObjectId;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);

TransactionSchema.index({ type: 1 });
TransactionSchema.index({ date: -1 });
TransactionSchema.index({ category: 1 });
TransactionSchema.index({ salesAgent: 1 });