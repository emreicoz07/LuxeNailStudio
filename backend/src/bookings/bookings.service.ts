import { Injectable, Logger, NotFoundException, UnauthorizedException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Appointment } from './schemas/appointment.schema';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Booking, BookingDocument, BookingStatus, PaymentStatus } from './schemas/booking.schema';
import { EmailService } from '../email/email.service';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import { addDays } from 'date-fns';
import { Service, ServiceDocument } from './schemas/service.schema';
import { AddOn, AddOnDocument } from './schemas/addon.schema';
import { UserFromRequest } from '../auth/interfaces/auth.interface';
import { BookingConfirmationEmailData } from '../email/interfaces/email.interface';
import { Document } from 'mongoose';

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

  private async validateAddOns(addOnIds: string[]): Promise<AddOnDocument[]> {
    if (!addOnIds?.length) return [];
    
    const addOns = await this.addOnModel.find({ 
      _id: { $in: addOnIds.map(id => new Types.ObjectId(id)) },
      isActive: true 
    });
    
    if (addOns.length !== addOnIds.length) {
      throw new BadRequestException('One or more add-ons not found or inactive');
    }
    
    return addOns;
  }

  private calculateTotalPrice(service: ServiceDocument, addOns: AddOnDocument[]): number {
    const addOnsTotal = addOns.reduce((sum: number, addOn: AddOnDocument) => sum + addOn.price, 0);
    return service.price + addOnsTotal;
  }

  private calculateTotalDuration(service: ServiceDocument, addOns: AddOnDocument[]): number {
    const addOnsDuration = addOns.reduce((sum: number, addOn: AddOnDocument) => sum + (addOn.duration || 0), 0);
    return service.duration + addOnsDuration;
  }

  async create(createBookingDto: CreateBookingDto, user: UserFromRequest): Promise<BookingDocument> {
    try {
      this.logger.debug(`Creating booking for user: ${user._id}, service: ${createBookingDto.serviceId}`);
      
      // Log the current state of collections
      const servicesCount = await this.serviceModel.countDocuments();
      const addOnsCount = await this.addOnModel.countDocuments();
      this.logger.debug(`Current counts - Services: ${servicesCount}, AddOns: ${addOnsCount}`);

      this.logger.debug(`Attempting to find service with ID: ${createBookingDto.serviceId}`);
      
      let service;
      try {
        service = await this.serviceModel.findOne({ 
          _id: new Types.ObjectId(createBookingDto.serviceId),
          isActive: true
        }).exec();
        
        this.logger.debug(`Service search result: ${JSON.stringify(service)}`);
        
      } catch (error) {
        this.logger.error(`Error finding service: ${error.message}`, error.stack);
        if (error.name === 'BSONTypeError') {
          throw new BadRequestException('Invalid service ID format');
        }
        throw error;
      }

      if (!service) {
        // Check if service exists but is inactive
        const inactiveService = await this.serviceModel.findById(createBookingDto.serviceId).exec();
        if (inactiveService) {
          throw new BadRequestException('This service is currently inactive');
        }
        throw new NotFoundException('Service not found');
      }

      const addOns = await this.validateAddOns(createBookingDto.addOnIds || []);
      const totalPrice = this.calculateTotalPrice(service, addOns);
      const totalDuration = this.calculateTotalDuration(service, addOns);

      if (createBookingDto.amount !== totalPrice) {
        throw new BadRequestException(`Invalid total amount. Expected: ${totalPrice}`);
      }

      const booking = new this.bookingModel({
        userId: user._id,
        serviceId: service._id,
        addOnIds: addOns.map((addOn: AddOnDocument) => addOn._id),
        dateTime: createBookingDto.appointmentDate,
        duration: totalDuration,
        totalAmount: totalPrice,
        depositAmount: createBookingDto.depositAmount || 0,
        status: BookingStatus.PENDING,
        notes: createBookingDto.notes,
        paymentStatus: createBookingDto.paymentStatus || PaymentStatus.UNPAID
      });

      const savedBooking = await booking.save();
      const populatedBooking = await this.populateBookingDetails(savedBooking._id);

      if (!populatedBooking) {
        throw new NotFoundException('Booking not found after creation');
      }

      // Send confirmation email
      await this.emailService.sendBookingConfirmation({
        email: user.email,
        firstName: user.name.split(' ')[0],
        lastName: user.name.split(' ').slice(1).join(' '),
        name: user.name,
        bookingDetails: {
          id: populatedBooking._id.toString(),
          dateTime: populatedBooking.dateTime,
          totalAmount: populatedBooking.totalAmount,
          depositAmount: populatedBooking.depositAmount,
          status: populatedBooking.status,
          paymentStatus: populatedBooking.paymentStatus,
          serviceName: service.name,
          notes: populatedBooking.notes,
          addOnServices: addOns.map(addOn => ({
            name: addOn.name,
            price: addOn.price
          }))
        }
      });

      return populatedBooking;
    } catch (error) {
      this.logger.error(`Failed to create booking: ${error.message}`, error.stack);
      throw error;
    }
  }

  private handleBookingError(error: any, dto: CreateBookingDto, user: UserFromRequest) {
    if (error instanceof NotFoundException || error instanceof BadRequestException) {
      throw error;
    }
    
    this.logger.error('Failed to create booking:', {
      error: error.message,
      stack: error.stack,
      bookingDto: dto,
      userId: user._id
    });
    
    throw new InternalServerErrorException('Failed to create booking. Please try again later.');
  }

  private async populateBookingDetails(bookingId: Types.ObjectId): Promise<BookingDocument | null> {
    return this.bookingModel
      .findById(bookingId)
      .populate('serviceId')
      .populate('addOnIds')
      .populate('userId', 'name email')
      .exec();
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