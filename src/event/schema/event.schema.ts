import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'
import { EventType } from '../enums/event-type.enum'

export type EventDocument = HydratedDocument<Event>;

@Schema({ timestamps: true })
export class Event {

  @Prop({ required: true })
  title: string

  @Prop({
    enum: EventType,
    required: true
  })
  type: EventType

  @Prop({ required: true })
  date: Date

  @Prop({required:true})
  time: string

  @Prop({required:true})
  location: string

  @Prop({ type: String, trim: true })
  createdBy: string


  @Prop({ type: String, trim: true ,required:true})
  client: string

  @Prop({ type: Types.ObjectId, ref: 'User' ,required:true})
  assignedTo
}

export const EventSchema = SchemaFactory.createForClass(Event)