import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ServiceDocument = Service & Document;

@Schema({ timestamps: true })
export class Service {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  duration: number;

  @Prop({ required: true })
  price: number;

  @Prop()
  imageUrl?: string;

  @Prop({ required: true })
  category: string;

  @Prop({ default: 0 })
  deposit: number;
}

export const ServiceSchema = SchemaFactory.createForClass(Service); 