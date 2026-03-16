import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Area } from 'src/areas/schema/area.schema';
import { Developer } from 'src/developers/schema/developer.schema';

export type ProjectDocument = Project & Document;

export enum ProjectStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  SOLD_OUT = 'Sold Out',
}

@Schema({ timestamps: true })
export class Project {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true })
  description: string;

  @Prop({ required: true, trim: true })
  location: string; 


  @Prop({
    type: Types.ObjectId,
    ref: Developer.name,
    required: true,
  })
  developer: Types.ObjectId; 


  @Prop({ required: true })
  startDate: Date;

  @Prop({
    enum: ProjectStatus,
    default: ProjectStatus.ACTIVE,
  })
  status: ProjectStatus;


   @Prop({ type: [String], required: true })
  images: string[]; 
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
ProjectSchema.index({ developer: 1 });
ProjectSchema.index({ area: 1 });
ProjectSchema.index({ status: 1 });
