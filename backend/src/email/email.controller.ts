import { Controller, Post, Body } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('test')
  async testEmail(@Body() body: { email: string }) {
    try {
      await this.emailService.sendPasswordResetEmail(
        body.email,
        'Test User',
        'test-token-123'
      );
      return { message: 'Test email sent successfully' };
    } catch (error) {
      return { error: error.message };
    }
  }
} 