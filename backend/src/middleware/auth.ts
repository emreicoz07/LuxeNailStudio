import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';

// Add interface to extend Request
interface RequestWithUser extends Request {
  user?: any; // Replace 'any' with your actual User interface type
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
      const decoded = this.jwtService.verify(token);
      req.user = decoded;
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