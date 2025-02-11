import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({
  timestamps: true, // Adds createdAt and updatedAt fields
})
export class User {
  @Prop({ required: true, minlength: 2, maxlength: 50 })
  name: string;

  @Prop({
    required: true,
    unique: true,
    index: true
  })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({
    required: false,
    match: /^\+?[1-9]\d{1,14}$/,
  })
  phone?: string;

  @Prop({ default: false })
  subscribe: boolean;

  @Prop({ required: true, default: false })
  agreeToTerms: boolean;

  @Prop({ default: 'user' })
  role: string;

  @Prop({ default: false })
  emailVerified: boolean;

  @Prop()
  verificationToken?: string;

  @Prop()
  resetPasswordToken?: string;

  @Prop()
  resetPasswordExpires?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Add methods if needed
UserSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.verificationToken;
  delete obj.resetPasswordToken;
  delete obj.resetPasswordExpires;
  return obj;
}; 