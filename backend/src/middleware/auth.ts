import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import { AuthGuard } from '@nestjs/passport';

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
export class AuthMiddleware extends AuthGuard('jwt') {
  constructor(private jwtService: JwtService) {
    super();
  }

  async canActivate(context: any): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];
    
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const decoded = this.jwtService.verify(token) as JwtPayload;
      request.user = decoded;
      return true;
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