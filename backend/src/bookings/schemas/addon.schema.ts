import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type AddOnDocument = AddOn & Document;

@Schema({ timestamps: true })
export class AddOn extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  duration: number;

  @Prop()
  description?: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const AddOnSchema = SchemaFactory.createForClass(AddOn); 