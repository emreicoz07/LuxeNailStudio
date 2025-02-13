import { Injectable, UnauthorizedException, CanActivate, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import { ConfigService } from '@nestjs/config';
import { ExecutionContext } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { UserRole } from '../auth/enums/user-role.enum';

// Define the JWT payload interface
interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

// Define the RequestWithUser interface
export interface RequestWithUser extends Request {
  user?: {
    userId: string;
    email: string;
    role: UserRole;
  };
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly configService: ConfigService, private readonly jwtService: JwtService) {}

  async use(req: RequestWithUser, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        const decoded = await this.jwtService.verify(token);
        req.user = decoded;
      } catch (error) {
        // Token verification failed, but we'll let the guard handle the error
      }
    }
    next();
  }
}

// Helper function to check admin role
export function isAdmin(req: Request, res: Response, next: NextFunction) {
  const user = req.user as JwtPayload;
  if (user?.role !== 'admin') {
    throw new UnauthorizedException('Admin access required');
  }
  next();
} 