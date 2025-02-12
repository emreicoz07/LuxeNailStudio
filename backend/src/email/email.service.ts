import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(EmailService.name);

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: this.configService.get<string>('GMAIL_USER'),
        pass: this.configService.get<string>('GMAIL_APP_PASSWORD'),
      },
    });

    // Verify connection
    this.transporter.verify((error) => {
      if (error) {
        this.logger.error('Error connecting to email server:', error);
      } else {
        this.logger.log('Ready to send emails');
      }
    });
  }

  private async loadTemplate(templateName: string): Promise<HandlebarsTemplateDelegate> {
    const templatePath = path.join(process.cwd(), 'src', 'templates', `${templateName}.hbs`);
    
    try {
      const template = await fs.promises.readFile(templatePath, 'utf-8');
      return handlebars.compile(template);
    } catch (error) {
      this.logger.error(`Failed to load email template '${templateName}':`, error);
      throw error;
    }
  }

  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    try {
      const template = await this.loadTemplate('welcome');
      const html = template({
        name,
        websiteName: this.configService.get<string>('WEBSITE_NAME', 'Nail Studio'),
        bookingUrl: `${this.configService.get<string>('FRONTEND_URL')}/appointments`,
        phoneNumber: this.configService.get<string>('BUSINESS_PHONE'),
        businessAddress: this.configService.get<string>('BUSINESS_ADDRESS'),
        instagramUrl: this.configService.get<string>('INSTAGRAM_URL'),
        facebookUrl: this.configService.get<string>('FACEBOOK_URL'),
        pinterestUrl: this.configService.get<string>('PINTEREST_URL'),
        unsubscribeUrl: `${this.configService.get<string>('FRONTEND_URL')}/unsubscribe?email=${email}`,
      });

      await this.transporter.sendMail({
        from: `"${this.configService.get<string>('WEBSITE_NAME', 'Nail Studio')}" <${this.configService.get('GMAIL_USER')}>`,
        to: email,
        subject: `Welcome to ${this.configService.get<string>('WEBSITE_NAME', 'Nail Studio')}! 🎉`,
        html,
      });

      this.logger.log(`Welcome email sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send welcome email to ${email}:`, error);
      throw error;
    }
  }
} 