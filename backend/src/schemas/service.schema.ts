import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ServiceDocument = Service & Document;

@Schema({
  timestamps: true,
})
export class Service {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  duration: number;

  @Prop({ required: true })
  deposit: number;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  image?: string;

  @Prop({ type: String, required: true })
  category: string;

  @Prop({ type: String, required: true })
  serviceCategory: string;
}

export const ServiceSchema = SchemaFactory.createForClass(Service); 