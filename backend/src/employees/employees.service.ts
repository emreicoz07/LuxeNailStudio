import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Employee, EmployeeDocument } from './schemas/employee.schema';
import { Service, ServiceDocument } from '../bookings/schemas/service.schema';

@Injectable()
export class EmployeesService {
  private readonly logger = new Logger(EmployeesService.name);

  constructor(
    @InjectModel(Employee.name)
    private readonly employeeModel: Model<EmployeeDocument>,
    @InjectModel(Service.name)
    private readonly serviceModel: Model<ServiceDocument>,
  ) {}

  async findByService(serviceId: string) {
    this.logger.debug(`Searching for employees with serviceId: ${serviceId}`);
    
    // First get the service to find its category
    const service = await this.serviceModel.findById(serviceId);
    if (!service) {
      this.logger.warn(`Service not found with ID: ${serviceId}`);
      return [];
    }

    this.logger.debug(`Service category: ${service.category}`);

    // Normalize the category to uppercase for comparison
    const normalizedCategory = service.category.toUpperCase();
    
    // Then find employees with matching category in their expertise (case-insensitive)
    const employees = await this.employeeModel.find({
      isActive: true,
      expertise: { 
        $regex: new RegExp(`^${normalizedCategory}$`, 'i') // Case-insensitive exact match
      }
    }).exec();

    this.logger.debug(`Found ${employees.length} employees for service category ${service.category}`);
    this.logger.debug('Employee expertise:', employees.map(e => ({ 
      name: e.name, 
      expertise: e.expertise 
    })));

    return employees;
  }
}
