import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { User, UserDocument } from './schemas/user.schema';
import { Logger } from '@nestjs/common';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, confirmPassword, name, phone, subscribe, agreeToTerms } = registerDto;

    if (!agreeToTerms) {
      throw new BadRequestException('You must agree to the Terms & Conditions');
    }

    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await this.userModel.create({
        email,
        password: hashedPassword,
        name,
        phone,
        subscribe: subscribe || false,
        agreeToTerms,
        role: 'user',
        emailVerified: false
      });

      const token = this.jwtService.sign({
        userId: user._id,
        email: user.email,
        role: user.role
      });

      this.logger.log(`User registered successfully: ${email}`);

      return {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          phone: user.phone,
          role: user.role
        },
        token
      };
    } catch (error) {
      this.logger.error(`Registration failed for email ${email}:`, error);
      throw new BadRequestException('Could not create user');
    }
  }
} 