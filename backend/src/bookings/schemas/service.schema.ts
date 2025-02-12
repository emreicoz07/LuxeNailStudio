import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Category } from './category.schema';

export enum ServiceCategory {
  MANICURE = 'MANICURE',
  PEDICURE = 'PEDICURE',
  NAIL_ART = 'NAIL_ART',
  SPECIAL = 'SPECIAL'
}

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

  @Prop({ required: true, enum: ServiceCategory, default: ServiceCategory.MANICURE })
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