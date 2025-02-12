import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Category } from './category.schema';
import { ServiceCategory } from '../enums/service-category.enum';

export type ServiceDocument = Service & Document;

@Schema({ timestamps: true })
export class Service {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ required: true, min: 0 })
  duration: number;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Category', required: true })
  category: Category;

  @Prop({ type: String, enum: ServiceCategory, required: true })
  serviceCategory: ServiceCategory;

  @Prop()
  imageUrl?: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ min: 0, default: 0 })
  deposit: number;
}

export const ServiceSchema = SchemaFactory.createForClass(Service);

// Add indexes for common queries
ServiceSchema.index({ category: 1 });
ServiceSchema.index({ serviceCategory: 1 });
ServiceSchema.index({ isActive: 1 }); 