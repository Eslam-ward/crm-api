import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';


export type DeveloperDocument = HydratedDocument<Developer>;


@Schema({ timestamps: true })
export class Developer {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;


   @Prop({ type: String, trim: true ,required: true })
    description: string;



  @Prop({ required: true, trim: true })
  phone: string;

  @Prop({ type: String, trim: true })
   location: string;

    @Prop({ type: [String] , trim: true })
    area: string[];



   

}

export const DeveloperSchema = SchemaFactory.createForClass(Developer);


