import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ClientDocument = HydratedDocument<Client>;



@Schema({ timestamps: true })
export class Client {
  @Prop({ required: true, trim: true ,index: true})
  fullName: string;

  @Prop({ required: true, trim: true })
  phone: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ trim: true })
  city: string;

  @Prop({ trim: true })
  country: string;

 

  @Prop({ trim: true })
  notes: string;

  @Prop({ type: Date, default: Date.now })
  clientSince: Date;
}

export const ClientSchema = SchemaFactory.createForClass(Client);



