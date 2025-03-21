import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ServiceCategory } from '../enums/service-category.enum';

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

  @Prop({ 
    required: true,
    set: (category: string) => category.toUpperCase(), // Always store as uppercase
    get: (category: string) => category // Return as stored
  })
  category: string;

  @Prop({ default: 0 })
  deposit: number;

  @Prop({ default: true })
  isActive: boolean;
}

export const ServiceSchema = SchemaFactory.createForClass(Service);

// Add indexes for common queries
ServiceSchema.index({ category: 1 });
ServiceSchema.index({ isActive: 1 }); 