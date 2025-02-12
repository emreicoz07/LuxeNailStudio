import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';
import { format } from 'date-fns';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(EmailService.name);

  constructor(private configService: ConfigService) {
    // Log email configuration on startup
    this.logger.log('Initializing email service...');
    const emailUser = this.configService.get<string>('GMAIL_USER');
    this.logger.log(`Email configured for: ${emailUser}`);

    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: emailUser,
        pass: this.configService.get<string>('GMAIL_APP_PASSWORD'),
      },
    });

    // Verify connection immediately
    this.verifyConnection();
  }

  private async verifyConnection() {
    try {
      await this.transporter.verify();
      this.logger.log('Email service connected successfully');
    } catch (error) {
      this.logger.error('Email service connection failed:', error);
      // Throw error to prevent app from starting with broken email
      throw error;
    }
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

  async sendPasswordResetEmail(email: string, name: string, resetToken: string): Promise<void> {
    try {
      this.logger.log('Loading reset password template...');
      const template = await this.loadTemplate('reset-password');
      
      const resetUrl = `${this.configService.get<string>('FRONTEND_URL')}/reset-password?token=${resetToken}`;
      this.logger.log(`Reset URL generated: ${resetUrl}`);
      
      const html = template({
        name,
        resetUrl,
        websiteName: this.configService.get<string>('WEBSITE_NAME', 'Nail Studio'),
        phoneNumber: this.configService.get<string>('BUSINESS_PHONE'),
        businessAddress: this.configService.get<string>('BUSINESS_ADDRESS'),
      });

      const mailOptions = {
        from: `"${this.configService.get<string>('WEBSITE_NAME', 'Nail Studio')}" <${this.configService.get('GMAIL_USER')}>`,
        to: email,
        subject: 'Reset Your Password',
        html,
      };

      this.logger.log('Preparing to send password reset email...');
      this.logger.debug('Mail options:', { ...mailOptions, html: 'HTML content hidden' });
      
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Password reset email sent successfully to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send password reset email to ${email}:`, error);
      if (error.code) {
        this.logger.error(`Error code: ${error.code}`);
      }
      throw new Error('Failed to send password reset email. Please try again later.');
    }
  }

  async sendBookingConfirmationEmail(params: {
    email: string;
    name: string;
    bookingDetails: {
      id: string;
      dateTime: Date;
      totalAmount: number;
      depositAmount: number;
      status: string;
      paymentStatus: string;
    };
  }): Promise<void> {
    const { email, name, bookingDetails } = params;
    try {
      const template = await this.loadTemplate('booking-confirmation');

      const formattedDate = format(bookingDetails.dateTime, 'EEEE, MMMM do, yyyy');
      const formattedTime = format(bookingDetails.dateTime, 'h:mm a');

      const html = template({
        name,
        bookingId: bookingDetails.id,
        date: formattedDate,
        time: formattedTime,
        totalAmount: bookingDetails.totalAmount.toFixed(2),
        depositAmount: bookingDetails.depositAmount.toFixed(2),
        remainingAmount: (bookingDetails.totalAmount - bookingDetails.depositAmount).toFixed(2),
        status: bookingDetails.status,
        paymentStatus: bookingDetails.paymentStatus,
        websiteName: this.configService.get<string>('WEBSITE_NAME', 'Nail Studio'),
        businessAddress: this.configService.get<string>('BUSINESS_ADDRESS'),
        businessPhone: this.configService.get<string>('BUSINESS_PHONE'),
        googleMapsUrl: this.configService.get<string>('GOOGLE_MAPS_URL'),
        managementUrl: `${this.configService.get<string>('FRONTEND_URL')}/appointments/${bookingDetails.id}`,
        cancelUrl: `${this.configService.get<string>('FRONTEND_URL')}/appointments/${bookingDetails.id}/cancel`,
      });

      await this.transporter.sendMail({
        from: `"${this.configService.get<string>('WEBSITE_NAME', 'Nail Studio')}" <${this.configService.get('GMAIL_USER')}>`,
        to: email,
        subject: 'Your Booking Confirmation 💅',
        html,
      });

      this.logger.log(`Booking confirmation email sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send booking confirmation email to ${email}:`, error);
      throw error;
    }
  }
} 