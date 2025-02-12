import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';

// Define the JWT payload interface
interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

// Update the RequestWithUser interface
export interface RequestWithUser extends Request {
  user?: JwtPayload;
}

@Injectable()
export class AuthMiddleware {
  constructor(private jwtService: JwtService) {}

  async use(req: RequestWithUser, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const decoded = this.jwtService.verify(token) as JwtPayload;
      // Properly set the user object with the decoded token data
      req.user = {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role
      };
      next();
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}

export function isAdmin(req: RequestWithUser, res: Response, next: NextFunction) {
  const user = req.user;
  if (user?.role !== 'admin') {
    throw new UnauthorizedException('Admin access required');
  }
  next();
} 