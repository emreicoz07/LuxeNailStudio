import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AddOnDocument = AddOn & Document & { _id: Types.ObjectId };

@Schema({ timestamps: true })
export class AddOn {
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

  @Prop({ required: true, default: 'general' })
  category: string;
}

export const AddOnSchema = SchemaFactory.createForClass(AddOn);

AddOnSchema.index({ category: 1 });
AddOnSchema.index({ isActive: 1 }); 