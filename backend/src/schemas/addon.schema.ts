import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AddOnDocument = AddOn & Document;

@Schema({
  timestamps: true,
})
export class AddOn {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true, min: 0 })
  duration: number;

  @Prop()
  description?: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const AddOnSchema = SchemaFactory.createForClass(AddOn); 