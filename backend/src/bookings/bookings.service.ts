import { Injectable, Logger, NotFoundException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Appointment } from './schemas/appointment.schema';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Booking, BookingDocument, BookingStatus, PaymentStatus } from './schemas/booking.schema';
import { EmailService } from '../email/email.service';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import { addDays } from 'date-fns';
import { Service } from './schemas/service.schema';
import { AddOn } from './schemas/addon.schema';
import { UserFromRequest } from '../auth/interfaces/auth.interface';
import { BookingConfirmationEmailData } from '../email/interfaces/email.interface';

@Injectable()
export class BookingsService {
  private readonly logger = new Logger(BookingsService.name);

  constructor(
    @InjectModel(Appointment.name) private appointmentModel: Model<Appointment>,
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
    @InjectModel(Service.name) private serviceModel: Model<Service>,
    @InjectModel(AddOn.name) private addOnModel: Model<AddOn>,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {}

  async create(createBookingDto: CreateBookingDto, user: UserFromRequest): Promise<Booking> {
    // Validate main service
    const service = await this.serviceModel.findById(createBookingDto.serviceId);
    if (!service) {
      throw new NotFoundException('Service not found');
    }

    // Validate and get add-ons if any are selected
    let addOns: AddOn[] = [];
    let totalDuration = service.duration;
    let totalPrice = service.price;

    if (createBookingDto.addOnIds && createBookingDto.addOnIds.length > 0) {
      addOns = await this.addOnModel.find({
        _id: { $in: createBookingDto.addOnIds },
        isActive: true,
      });

      if (addOns.length !== createBookingDto.addOnIds.length) {
        throw new BadRequestException('One or more add-ons not found or inactive');
      }

      // Calculate total duration and price including add-ons
      addOns.forEach(addOn => {
        totalDuration += addOn.duration;
        totalPrice += addOn.price;
      });
    }

    // Validate total amount matches calculated price
    if (createBookingDto.amount !== totalPrice) {
      throw new BadRequestException('Invalid total amount');
    }

    // Create the booking
    const booking = new this.bookingModel({
      userId: user._id,
      serviceId: service._id,
      addOnIds: addOns.map(addOn => addOn._id),
      dateTime: createBookingDto.appointmentDate,
      duration: totalDuration,
      totalAmount: totalPrice,
      depositAmount: createBookingDto.depositAmount,
      status: BookingStatus.PENDING,
      notes: createBookingDto.notes,
      paymentStatus: createBookingDto.paymentStatus || PaymentStatus.UNPAID,
      paymentId: createBookingDto.paymentId
    });

    const savedBooking = await booking.save();

    // Populate service details for the email
    const populatedBooking = await this.bookingModel
      .findById(savedBooking._id)
      .populate('serviceId')
      .populate('userId')
      .populate('addOnIds')
      .exec();

    if (!populatedBooking) {
      this.logger.error('Failed to populate booking details after save');
      throw new Error('Failed to create booking');
    }

    // Type assertions to ensure type safety
    const userId = populatedBooking.userId as any;
    const serviceId = populatedBooking.serviceId as any;

    // Format the email data according to the interface
    const emailData: BookingConfirmationEmailData = {
      email: userId.email,
      firstName: userId.firstName,
      lastName: userId.lastName,
      name: `${userId.firstName} ${userId.lastName}`,
      bookingDetails: {
        id: populatedBooking._id.toString(),
        dateTime: populatedBooking.dateTime,
        totalAmount: populatedBooking.totalAmount,
        depositAmount: populatedBooking.depositAmount || 0,
        status: populatedBooking.status,
        paymentStatus: populatedBooking.paymentStatus,
        serviceName: serviceId.name,
        addOnServices: (populatedBooking.addOnIds as any[]).map(addon => ({
          name: addon.name,
          price: addon.price
        }))
      }
    };

    // Send confirmation email
    await this.emailService.sendBookingConfirmationEmail(emailData);

    return savedBooking;
  }

  private async validateAppointmentSlot(date: Date, duration: number): Promise<void> {
    // Add your appointment slot validation logic here
    // Check for overlapping bookings, business hours, etc.
  }

  async findOne(id: string, userId: string): Promise<BookingDocument> {
    const booking = await this.bookingModel.findById(id)
      .populate('userId')
      .populate('serviceId');
      
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    
    if (booking.userId.toString() !== userId) {
      throw new UnauthorizedException();
    }
    
    return booking;
  }

  async cancel(id: string, userId: string, reason?: string): Promise<BookingDocument> {
    const booking = await this.findOne(id, userId);
    if (booking.status === BookingStatus.CANCELED) {
      throw new Error('Booking is already cancelled');
    }
    
    booking.status = BookingStatus.CANCELED;
    booking.cancelReason = reason;
    const updatedBooking = await booking.save();
    
    // Send cancellation email
    await this.emailService.sendBookingCancellationEmail(updatedBooking);
    
    return updatedBooking;
  }

  // Cron job to send reminder emails
  @Cron('0 12 * * *') // Run at 12:00 PM every day
  async sendReminderEmails() {
    try {
      const tomorrow = addDays(new Date(), 1);
      const bookings = await this.bookingModel
        .find({
          dateTime: {
            $gte: tomorrow,
            $lt: addDays(tomorrow, 1)
          },
          status: BookingStatus.CONFIRMED,
          reminderSent: false
        })
        .populate('userId')
        .populate('serviceId');

      this.logger.log(`Found ${bookings.length} bookings for tomorrow's reminders`);

      for (const booking of bookings) {
        await this.emailService.sendBookingReminderEmail(booking);
        booking.reminderSent = true;
        await booking.save();
      }
    } catch (error) {
      this.logger.error('Failed to send reminder emails:', error);
    }
  }

  async updatePaymentStatus(bookingId: string, status: PaymentStatus): Promise<void> {
    await this.bookingModel.findByIdAndUpdate(bookingId, {
      paymentStatus: status,
    });
  }
} 