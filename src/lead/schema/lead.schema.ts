import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { LeadSource } from '../enums/LeadSource.enum';
import { LeadStatus } from '../enums/LeadStatus.enum';

export type LeadDocument = HydratedDocument<Lead>;

@Schema({ timestamps: true })
export class Lead {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  email: string;

  @Prop({
    type: String,
    enum: LeadSource,
    required: true,
  })
  source: LeadSource;

  @Prop({
    type: String,
    enum: LeadStatus,
    default: LeadStatus.NEW,
  })
  status: LeadStatus;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  assignedTo: Types.ObjectId;

  @Prop()
  interestedIn: string;

  @Prop()
  notes: string;
}

export const LeadSchema = SchemaFactory.createForClass(Lead);