import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ServiceCategory } from '../../bookings/enums/service-category.enum';

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
    type: String, 
    enum: ServiceCategory,
    required: true,
    index: true 
  })
  category: ServiceCategory;

  @Prop({ default: 0 })
  deposit: number;
}

export const ServiceSchema = SchemaFactory.createForClass(Service);
ServiceSchema.index({ category: 1 });
ServiceSchema.index({ isActive: 1 }); 