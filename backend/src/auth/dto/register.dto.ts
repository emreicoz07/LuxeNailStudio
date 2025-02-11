import { IsString, IsEmail, MinLength, MaxLength, Matches, IsOptional, IsBoolean } from 'class-validator';

export class RegisterDto {
  @IsString()
  @MinLength(2, { message: 'Full name must be at least 2 characters long' })
  @MaxLength(50, { message: 'Full name must not exceed 50 characters' })
  @Matches(/^[A-Za-z\s]+$/, { message: 'Full name can only contain letters and spaces' })
  name: string;

  @IsEmail({}, { message: 'Please enter a valid email address' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
  @Matches(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
  @Matches(/[!@#$%^&*(),.?":{}|<>]/, { message: 'Password must contain at least one special character' })
  password: string;

  @IsString()
  confirmPassword: string;

  @IsOptional()
  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/, { message: 'Please enter a valid phone number' })
  phone?: string;

  @IsOptional()
  @IsBoolean()
  subscribe?: boolean;

  @IsBoolean()
  agreeToTerms: boolean;
} 