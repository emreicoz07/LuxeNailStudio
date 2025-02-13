import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';
import { format } from 'date-fns';
import { BookingDocument, BookingStatus } from '../bookings/schemas/booking.schema';
import { addDays, subHours } from 'date-fns';
import { Booking, Service, AddOn, UserFromRequest } from '../bookings/interfaces';
import { BookingConfirmationEmailData } from './interfaces/email.interface';

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
      serviceName: string;
      notes?: string;
    };
  }): Promise<void> {
    const { email, name, bookingDetails } = params;
    try {
      const template = await this.loadTemplate('booking-confirmation');
      const formattedDate = format(bookingDetails.dateTime, 'EEEE, MMMM do, yyyy');
      const formattedTime = format(bookingDetails.dateTime, 'h:mm a');

      const html = template({
        name,
        service: bookingDetails.serviceName,
        date: formattedDate,
        time: formattedTime,
        price: bookingDetails.totalAmount.toFixed(2),
        depositAmount: bookingDetails.depositAmount.toFixed(2),
        remainingBalance: (bookingDetails.totalAmount - bookingDetails.depositAmount).toFixed(2),
        paymentStatus: bookingDetails.paymentStatus,
        notes: bookingDetails.notes,
        businessAddress: this.configService.get<string>('BUSINESS_ADDRESS'),
        phoneNumber: this.configService.get<string>('BUSINESS_PHONE'),
        managementUrl: `${this.configService.get<string>('FRONTEND_URL')}/appointments/${bookingDetails.id}`,
      });

      await this.transporter.sendMail({
        from: `"${this.configService.get<string>('WEBSITE_NAME')}" <${this.configService.get('GMAIL_USER')}>`,
        to: email,
        subject: 'Your Booking is Confirmed! 💅',
        html,
      });

      this.logger.log(`Booking confirmation email sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send booking confirmation email to ${email}:`, error);
      throw error;
    }
  }

  async sendBookingReminderEmail(booking: BookingDocument): Promise<void> {
    try {
      const template = await this.loadTemplate('booking-reminder');
      const formattedDate = format(booking.dateTime, 'EEEE, MMMM do, yyyy');
      const formattedTime = format(booking.dateTime, 'h:mm a');

      const html = template({
        name: booking.userId.name,
        service: booking.serviceId.name,
        date: formattedDate,
        time: formattedTime,
        businessAddress: this.configService.get<string>('BUSINESS_ADDRESS'),
        phoneNumber: this.configService.get<string>('BUSINESS_PHONE'),
        googleMapsUrl: this.configService.get<string>('GOOGLE_MAPS_URL'),
        managementUrl: `${this.configService.get<string>('FRONTEND_URL')}/appointments/${booking._id}`,
      });

      await this.transporter.sendMail({
        from: `"${this.configService.get<string>('WEBSITE_NAME')}" <${this.configService.get('GMAIL_USER')}>`,
        to: booking.userId.email,
        subject: 'Reminder: Your Appointment Tomorrow! 🗓️',
        html,
      });

      this.logger.log(`Reminder email sent to ${booking.userId.email}`);
    } catch (error) {
      this.logger.error(`Failed to send reminder email:`, error);
      throw error;
    }
  }

  async sendBookingCancellationEmail(booking: BookingDocument): Promise<void> {
    try {
      const template = await this.loadTemplate('booking-cancellation');
      const formattedDate = format(booking.dateTime, 'EEEE, MMMM do, yyyy');
      const formattedTime = format(booking.dateTime, 'h:mm a');

      const html = template({
        name: booking.userId.name,
        service: booking.serviceId.name,
        date: formattedDate,
        time: formattedTime,
        cancelReason: booking.cancelReason || 'No reason provided',
        bookingUrl: `${this.configService.get<string>('FRONTEND_URL')}/booking`,
        businessPhone: this.configService.get<string>('BUSINESS_PHONE'),
      });

      await this.transporter.sendMail({
        from: `"${this.configService.get<string>('WEBSITE_NAME')}" <${this.configService.get('GMAIL_USER')}>`,
        to: booking.userId.email,
        subject: 'Your Booking Has Been Cancelled',
        html,
      });

      this.logger.log(`Cancellation email sent to ${booking.userId.email}`);
    } catch (error) {
      this.logger.error(`Failed to send cancellation email:`, error);
      throw error;
    }
  }

  private async sendMail(options: { to: string; subject: string; html: string }): Promise<void> {
    await this.transporter.sendMail({
      from: `"${this.configService.get<string>('WEBSITE_NAME')}" <${this.configService.get('GMAIL_USER')}>`,
      ...options
    });
  }

  async sendBookingConfirmation(params: BookingConfirmationEmailData): Promise<void> {
    const { email, name, bookingDetails } = params;
    try {
      const template = await this.loadTemplate('booking-confirmation');
      const formattedDate = format(bookingDetails.dateTime, 'EEEE, MMMM do, yyyy');
      const formattedTime = format(bookingDetails.dateTime, 'h:mm a');

      const html = template({
        name,
        websiteName: this.configService.get<string>('WEBSITE_NAME', 'Nail Studio'),
        bookingId: bookingDetails.id,
        date: formattedDate,
        time: formattedTime,
        service: bookingDetails.serviceName,
        totalAmount: bookingDetails.totalAmount.toFixed(2),
        depositAmount: bookingDetails.depositAmount?.toFixed(2),
        remainingAmount: bookingDetails.depositAmount ? 
          (bookingDetails.totalAmount - bookingDetails.depositAmount).toFixed(2) : null,
        status: bookingDetails.status,
        paymentStatus: bookingDetails.paymentStatus,
        businessAddress: this.configService.get<string>('BUSINESS_ADDRESS'),
        businessPhone: this.configService.get<string>('BUSINESS_PHONE'),
        googleMapsUrl: this.configService.get<string>('GOOGLE_MAPS_URL'),
        managementUrl: `${this.configService.get<string>('FRONTEND_URL')}/bookings/${bookingDetails.id}`,
        cancelUrl: `${this.configService.get<string>('FRONTEND_URL')}/bookings/${bookingDetails.id}/cancel`,
      });

      await this.transporter.sendMail({
        from: `"${this.configService.get<string>('WEBSITE_NAME')}" <${this.configService.get('GMAIL_USER')}>`,
        to: email,
        subject: 'Your Booking is Confirmed! 💅',
        html,
      });

      this.logger.log(`Booking confirmation email sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send booking confirmation email to ${email}:`, error);
      throw error;
    }
  }
} 