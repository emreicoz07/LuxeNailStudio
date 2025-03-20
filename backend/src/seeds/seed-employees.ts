import { Logger } from '@nestjs/common';
import { connect } from 'mongoose';
import { Employee, EmployeeSchema } from '../employees/schemas/employee.schema';
import { config } from 'dotenv';

// Load environment variables
config();

async function seedEmployees() {
  const logger = new Logger('SeedEmployees');
  
  try {
    // Connect to MongoDB
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI is not defined');
    }

    const connection = await connect(uri, {
      dbName: 'nail-studio'
    });

    // Get the Employee model
    const EmployeeModel = connection.model('Employee', EmployeeSchema);

    // Clear existing employees
    await EmployeeModel.deleteMany({});
    logger.log('Cleared existing employees');

    // Create new employees
    const employees = await EmployeeModel.create([
      {
        name: 'Semiha ICOZ',
        email: 'semiha.icoz@example.com',
        expertise: ['MANICURE', 'PEDICURE', 'NAIL_ART'],
        imageUrl: '/images/employees/semiha.jpg',
        bio: 'Expert nail technician with over 10 years of experience specializing in artistic nail designs and professional care.',
        isActive: true
      },
      {
        name: 'Havva AGU',
        email: 'havva.agu@example.com',
        expertise: ['MANICURE', 'PEDICURE', 'SPECIAL'],
        imageUrl: '/images/employees/havva.jpg',
        bio: 'Specialized in luxury spa treatments and nail care with a focus on therapeutic techniques.',
        isActive: true
      },
      {
        name: 'Alexsandra Micholi',
        email: 'alexsandra.micholi@example.com',
        expertise: ['NAIL_ART', 'MANICURE', 'SPECIAL'],
        imageUrl: '/images/employees/alexsandra.jpg',
        bio: 'Creative nail artist with a passion for innovative designs and contemporary nail art techniques.',
        isActive: true
      }
    ]);

    logger.log(`Seeded ${employees.length} employees`);
    logger.debug('Seeded employees:', employees);

    await connection.disconnect();
    logger.log('Database connection closed');

  } catch (error) {
    logger.error('Error seeding employees:', error);
    process.exit(1);
  }
}

seedEmployees(); 