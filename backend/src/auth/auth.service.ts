import { Injectable, ConflictException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { User, UserDocument } from './schemas/user.schema';
import { Logger } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { EmailService } from '../email/email.service';
import { randomBytes } from 'crypto';
import { UserRole } from './enums/user-role.enum';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private emailService: EmailService
  ) {}

  async register(registerDto: RegisterDto) {
    const { 
      email, 
      password, 
      confirmPassword, 
      firstName, 
      lastName, 
      phone, 
      subscribe, 
      agreeToTerms 
    } = registerDto;

    if (!agreeToTerms) {
      throw new BadRequestException('You must agree to the Terms & Conditions');
    }

    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    try {
      const existingUser = await this.userModel.findOne({ email });
      if (existingUser) {
        throw new ConflictException('Email already registered');
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await this.userModel.create({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
        subscribe: subscribe || false,
        agreeToTerms,
        role: UserRole.CLIENT,
        emailVerified: false
      });

      const token = this.jwtService.sign({
        userId: user._id,
        email: user.email,
        role: user.role
      });

      // Send welcome email but don't wait for it
      this.emailService.sendWelcomeEmail(email, `${firstName} ${lastName}`)
        .catch(error => {
          this.logger.error('Failed to send welcome email:', error);
        });

      this.logger.log(`User registered successfully: ${email}`);

      return {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          role: user.role
        },
        token
      };
    } catch (error) {
      // Improved error logging
      this.logger.error(`Registration failed for email ${email}:`, {
        error: error.message,
        stack: error.stack,
        code: error.code
      });

      // Handle MongoDB duplicate key error
      if (error.code === 11000) {
        throw new ConflictException('Email already registered');
      }

      // Handle validation errors
      if (error.name === 'ValidationError') {
        throw new BadRequestException(Object.values(error.errors).map(err => err.message).join(', '));
      }

      // Handle other errors
      throw new BadRequestException(error.message || 'Could not create user');
    }
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    
    // Find user by email
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Generate JWT token
    const token = this.jwtService.sign({
      userId: user._id,
      email: user.email,
      role: user.role
    });

    return {
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      token
    };
  }

  async forgotPassword(email: string): Promise<void> {
    try {
      const user = await this.userModel.findOne({ email });
      
      // Always return success even if email doesn't exist (security best practice)
      if (!user) {
        this.logger.warn(`Password reset requested for non-existent email: ${email}`);
        return;
      }

      // Generate reset token
      const resetToken = randomBytes(32).toString('hex');
      const resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour from now

      // Save reset token and expiry to user
      await this.userModel.updateOne(
        { _id: user._id },
        {
          resetPasswordToken: resetToken,
          resetPasswordExpires,
        }
      );

      this.logger.log(`Reset token generated for user: ${email}`);

      // Send reset email
      await this.emailService.sendPasswordResetEmail(
        user.email,
        user.name,
        resetToken
      );

      this.logger.log(`Password reset process completed for user: ${email}`);
    } catch (error) {
      this.logger.error(`Failed to process forgot password for ${email}:`, error);
      throw new Error('Failed to process password reset request. Please try again later.');
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await this.userModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired password reset token');
    }

    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await this.userModel.updateOne(
        { _id: user._id },
        {
          password: hashedPassword,
          resetPasswordToken: undefined,
          resetPasswordExpires: undefined,
        }
      );

      this.logger.log(`Password reset successful for user: ${user.email}`);
    } catch (error) {
      this.logger.error(`Failed to reset password for user ${user.email}:`, error);
      throw new Error('Failed to reset password');
    }
  }

  async logout(userId?: string): Promise<void> {
    if (!userId) {
      throw new UnauthorizedException('User ID is required');
    }

    try {
      await this.userModel.updateOne(
        { _id: userId },
        { 
          $set: { 
            lastLogout: new Date(),
            resetPasswordToken: null,
            resetPasswordExpires: null
          }
        }
      );
    } catch (error) {
      this.logger.error(`Failed to logout user ${userId}:`, error);
      throw new Error('Failed to process logout request');
    }
  }

  async logoutAll(userId?: string): Promise<void> {
    if (!userId) {
      throw new UnauthorizedException('User ID is required');
    }

    try {
      await this.userModel.updateOne(
        { _id: userId },
        { 
          $set: { 
            tokenVersion: (Math.random() * 1000000).toString(),
            lastLogout: new Date(),
            resetPasswordToken: null,
            resetPasswordExpires: null
          }
        }
      );
    } catch (error) {
      this.logger.error(`Failed to logout user ${userId} from all devices:`, error);
      throw new Error('Failed to process logout from all devices request');
    }
  }
} 