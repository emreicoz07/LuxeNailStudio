import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type CategoryDocument = Category & Document;

@Schema({ timestamps: true })
export class Category extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({ required: true })
  order: number;

  @Prop()
  imageUrl?: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

// Add indexes
CategorySchema.index({ slug: 1 }, { unique: true });
CategorySchema.index({ order: 1 });
CategorySchema.index({ isActive: 1 }); 