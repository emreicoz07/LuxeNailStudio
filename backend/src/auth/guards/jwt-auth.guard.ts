import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Logger } from '@nestjs/common';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const result = (await super.canActivate(context)) as boolean;
      return result;
    } catch (error) {
      this.logger.error('JWT Authentication failed:', error);
      throw new UnauthorizedException('Authentication failed');
    }
  }

  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      this.logger.error('JWT validation failed:', { error: err, info });
      throw new UnauthorizedException(
        'Please login to access this resource. ' + (info?.message || err?.message)
      );
    }
    return user;
  }
} 