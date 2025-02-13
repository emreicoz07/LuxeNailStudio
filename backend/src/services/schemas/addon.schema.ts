import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ServiceCategory } from '../../bookings/enums/service-category.enum';

export type AddonDocument = Addon & Document;

@Schema({ timestamps: true })
export class Addon {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  duration: number;

  @Prop()
  imageUrl?: string;

  @Prop({ 
    type: String,
    required: true,
    enum: [...Object.values(ServiceCategory), 'both'],
    index: true
  })
  category: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const AddonSchema = SchemaFactory.createForClass(Addon);
AddonSchema.index({ category: 1 });
AddonSchema.index({ isActive: 1 }); 