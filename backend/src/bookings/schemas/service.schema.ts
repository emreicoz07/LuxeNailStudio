import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Category } from './category.schema';

export type ServiceDocument = Service & Document;

@Schema({ timestamps: true })
export class Service {
  @Prop({ required: true })
  name: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Category', required: true })
  category: Category;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ required: true, min: 0 })
  duration: number;

  @Prop({ required: true, min: 0, default: 0 })
  deposit: number;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  imageUrl?: string;
}

export const ServiceSchema = SchemaFactory.createForClass(Service); 