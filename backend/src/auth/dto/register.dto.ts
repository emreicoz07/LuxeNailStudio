import { IsString, IsEmail, MinLength, MaxLength, Matches, IsOptional, IsBoolean, IsNotEmpty, IsEnum } from 'class-validator';
import { UserRole } from '../enums/user-role.enum'; // You'll need to create this

export class RegisterDto {
  @IsNotEmpty({ message: 'First name is required' })
  @IsString({ message: 'First name must be a string' })
  @MinLength(2, { message: 'First name must be at least 2 characters long' })
  @MaxLength(50, { message: 'First name must not exceed 50 characters' })
  @Matches(/^[A-Za-z\s]+$/, { message: 'First name can only contain letters and spaces' })
  firstName: string;

  @IsNotEmpty({ message: 'Last name is required' })
  @IsString({ message: 'Last name must be a string' })
  @MinLength(2, { message: 'Last name must be at least 2 characters long' })
  @MaxLength(50, { message: 'Last name must not exceed 50 characters' })
  @Matches(/^[A-Za-z\s]+$/, { message: 'Last name can only contain letters and spaces' })
  lastName: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Please enter a valid email address' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
  @Matches(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
  @Matches(/[!@#$%^&*(),.?":{}|<>]/, { message: 'Password must contain at least one special character' })
  password: string;

  @IsNotEmpty({ message: 'Password confirmation is required' })
  @IsString({ message: 'Password confirmation must be a string' })
  confirmPassword: string;

  @IsOptional()
  @IsString({ message: 'Phone number must be a string' })
  @Matches(/^\+?[1-9]\d{1,14}$/, { message: 'Please enter a valid phone number' })
  phone?: string;

  @IsOptional()
  @IsBoolean({ message: 'Subscribe must be a boolean value' })
  subscribe?: boolean;

  @IsNotEmpty({ message: 'You must agree to the Terms & Conditions' })
  @IsBoolean({ message: 'Terms agreement must be a boolean value' })
  agreeToTerms: boolean;
} 