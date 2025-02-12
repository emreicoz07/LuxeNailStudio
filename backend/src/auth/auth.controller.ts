import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { AuthMiddleware } from '../middleware/auth';
import { RequestWithUser } from '../middleware/auth';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    await this.authService.forgotPassword(forgotPasswordDto.email);
    return { message: 'If an account exists with this email, you will receive password reset instructions.' };
  }

  @Post('reset-password')
  async resetPassword(
    @Body('token') token: string,
    @Body('newPassword') newPassword: string,
  ) {
    await this.authService.resetPassword(token, newPassword);
    return { message: 'Password has been reset successfully' };
  }

  @Post('logout')
  @UseGuards(AuthMiddleware)
  async logout(@Request() req: RequestWithUser) {
    await this.authService.logout(req.user?.userId);
    return { message: 'Logged out successfully' };
  }

  @Post('logout/all')
  @UseGuards(AuthMiddleware)
  async logoutAll(@Request() req: RequestWithUser) {
    await this.authService.logoutAll(req.user?.userId);
    return { message: 'Logged out from all devices successfully' };
  }
} 