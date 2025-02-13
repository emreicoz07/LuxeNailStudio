import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserRole } from '../enums/user-role.enum';

export type UserDocument = User & Document;

@Schema({
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      delete ret.password;
      return ret;
    },
  },
})
export class User {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  phone?: string;

  @Prop({ type: String, enum: UserRole, required: true })
  role: UserRole;

  @Prop({ default: false })
  emailVerified: boolean;

  @Prop({ default: false })
  subscribe: boolean;

  @Prop({ required: true })
  agreeToTerms: boolean;

  @Prop()
  resetPasswordToken?: string;

  @Prop()
  resetPasswordExpires?: Date;

  @Prop()
  lastLogout?: Date;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: Object, virtual: true })
  get name(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

// Add indexes for common queries
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ role: 1 });
UserSchema.index({ isActive: 1 });

// Add methods if needed
UserSchema.methods.toJSON = function() {
  const obj = this.toObject({ 
    virtuals: true,
    transform: (doc: any, ret: Record<string, any>) => {
      delete ret.password;
      delete ret.verificationToken;
      delete ret.resetPasswordToken;
      delete ret.resetPasswordExpires;
      return ret;
    }
  });
  return obj;
}; 