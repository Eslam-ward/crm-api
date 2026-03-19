import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type AreaDocument = HydratedDocument<Area>;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Area {
  @Prop({
    required: true,
    trim: true,
  })
  name: string; // B1, B2, B7

  @Prop({
    type: Types.ObjectId,
    ref: 'Project',
    required: true,
  })
  project: Types.ObjectId;

  @Prop({
    trim: true,
  })
  description?: string;

  @Prop({ required: true, trim: true })
  location: string;
 @Prop({ default:true})
  isActive?: boolean;



}

export const AreaSchema = SchemaFactory.createForClass(Area);
AreaSchema.index({ name: 1, project: 1 });
