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
import { Employee, EmployeeDocument } from './schemas/employee.schema';
import { StripeService } from '../stripe/stripe.service';
import { WorkingHours, WorkingHoursDocument } from './schemas/working-hours.schema';

@Injectable()
export class BookingsService {
  private readonly logger = new Logger(BookingsService.name);

  constructor(
    @InjectModel(Appointment.name) private appointmentModel: Model<Appointment>,
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
    @InjectModel(Service.name) private serviceModel: Model<ServiceDocument>,
    @InjectModel(AddOn.name) private addOnModel: Model<AddOn>,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
    @InjectModel(Employee.name) private employeeModel: Model<EmployeeDocument>,
    private readonly stripeService: StripeService,
    @InjectModel(WorkingHours.name) private workingHoursModel: Model<WorkingHoursDocument>,
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

  private async validateService(serviceId: string): Promise<ServiceDocument> {
    const service = await this.serviceModel.findOne({ 
      _id: new Types.ObjectId(serviceId),
      isActive: true
    }).exec();
    
    if (!service) {
      throw new NotFoundException('Service not found or inactive');
    }
    
    return service;
  }

  private calculateDepositAmount(service: ServiceDocument): number {
    if (service.price >= 50) {
      return Math.round(service.price * 0.2);
    }
    return 0;
  }

  async create(createBookingDto: CreateBookingDto, user: UserFromRequest): Promise<BookingDocument> {
    try {
      if (!user || !user.userId) {
        throw new UnauthorizedException('User not authenticated');
      }

      this.logger.debug(`Creating booking for user: ${user.userId}, service: ${createBookingDto.serviceId}`);
      
      const service = await this.validateService(createBookingDto.serviceId);
      const addOns = await this.validateAddOns(createBookingDto.addOnIds || []);
      
      const booking = new this.bookingModel({
        userId: new Types.ObjectId(user.userId),
        serviceId: service._id,
        addOnIds: addOns.map(addOn => addOn._id),
        dateTime: createBookingDto.appointmentDate,
        duration: this.calculateTotalDuration(service, addOns),
        totalAmount: createBookingDto.amount,
        status: BookingStatus.PENDING,
        notes: createBookingDto.notes,
        paymentStatus: PaymentStatus.UNPAID
      });

      const savedBooking = await booking.save();
      const populatedBooking = await this.populateBookingDetails(savedBooking._id);
      
      if (!populatedBooking) {
        throw new NotFoundException('Booking not found after creation');
      }

      // Send confirmation email
      await this.emailService.sendBookingConfirmation({
        email: user.email,
        name: user.name || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        bookingDetails: {
          id: populatedBooking._id.toString(),
          dateTime: populatedBooking.dateTime,
          totalAmount: populatedBooking.totalAmount,
          depositAmount: populatedBooking.depositAmount || 0,
          status: populatedBooking.status,
          paymentStatus: populatedBooking.paymentStatus,
          serviceName: service.name,
          addOnServices: addOns.map(addon => ({
            name: addon.name,
            price: addon.price
          })),
          notes: populatedBooking.notes
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

  async getAvailableTimeSlots(date: string, employeeId: string, serviceId: string) {
    try {
      // Get employee's work schedule from MongoDB
      const workSchedule = await this.employeeModel.findOne({
        _id: new Types.ObjectId(employeeId),
        'workSchedule.dayOfWeek': new Date(date).getDay()
      }).select('workSchedule.$');

      if (!workSchedule || !workSchedule.workSchedule?.[0]) {
        this.logger.warn(`No work schedule found for employee ${employeeId} on ${date}`);
        return [];
      }

      // Get service details
      const service = await this.serviceModel.findById(serviceId);
      if (!service) {
        throw new NotFoundException('Service not found');
      }

      // Get existing bookings for that day
      const startOfDay = new Date(`${date}T00:00:00`);
      const endOfDay = new Date(`${date}T23:59:59`);

      const existingBookings = await this.bookingModel.find({
        employeeId: new Types.ObjectId(employeeId),
        dateTime: {
          $gte: startOfDay,
          $lt: endOfDay
        },
        status: {
          $in: ['CONFIRMED', 'PENDING']
        }
      }).sort({ dateTime: 1 });

      // Calculate available time slots
      const { startTime, endTime } = workSchedule.workSchedule[0];
      const slots = this.generateTimeSlots(
        startTime,
        endTime,
        service.duration,
        existingBookings,
        date
      );

      return slots;
    } catch (error) {
      this.logger.error(`Error getting available time slots: ${error.message}`);
      throw new InternalServerErrorException('Failed to get available time slots');
    }
  }

  // Helper method to generate time slots
  private generateTimeSlots(
    startTime: string,
    endTime: string,
    serviceDuration: number,
    existingBookings: BookingDocument[],
    date: string
  ): string[] {
    const slots: string[] = [];
    const start = new Date(`${date}T${startTime}`);
    const end = new Date(`${date}T${endTime}`);
    
    let currentSlot = new Date(start);
    
    while (currentSlot <= end) {
      const slotEnd = new Date(currentSlot.getTime() + serviceDuration * 60000);
      
      // Check if slot conflicts with existing bookings
      const isSlotAvailable = !existingBookings.some(booking => {
        const bookingStart = new Date(booking.dateTime);
        const bookingEnd = new Date(bookingStart.getTime() + booking.duration * 60000);
        return (
          (currentSlot >= bookingStart && currentSlot < bookingEnd) ||
          (slotEnd > bookingStart && slotEnd <= bookingEnd)
        );
      });

      if (isSlotAvailable && slotEnd <= end) {
        slots.push(currentSlot.toISOString());
      }

      // Move to next slot (15-minute intervals)
      currentSlot = new Date(currentSlot.getTime() + 15 * 60000);
    }

    return slots;
  }

  async getWorkingHours() {
    try {
      const workingHours = await this.workingHoursModel.find().exec();
      
      // Günleri key-value formatına dönüştür
      return workingHours.reduce((acc: Record<string, any>, day) => {
        acc[day.dayOfWeek] = {
          isOpen: day.isOpen,
          openTime: day.openTime,
          closeTime: day.closeTime
        };
        return acc;
      }, {} as Record<string, any>);
    } catch (error) {
      this.logger.error('Failed to fetch working hours:', error);
      throw new InternalServerErrorException('Could not retrieve working hours');
    }
  }
} 