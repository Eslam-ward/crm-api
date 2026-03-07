import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { EventType } from '../enums/event-type.enum'

export type EventDocument = Event & Document

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

  @Prop({ type: Types.ObjectId, ref: 'Client' ,required:true})
  client

  @Prop({ type: Types.ObjectId, ref: 'User' ,required:true})
  assignedTo
}

export const EventSchema = SchemaFactory.createForClass(Event)