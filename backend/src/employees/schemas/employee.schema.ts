import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EmployeeDocument = Employee & Document;

@Schema({ timestamps: true })
export class Employee {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ type: [String], required: true })
  expertise: string[];

  @Prop()
  imageUrl?: string;

  @Prop()
  bio?: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee); 