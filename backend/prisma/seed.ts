import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // First, clean up existing employees
  await prisma.employee.deleteMany({});

  // Create employees
  const employees = await Promise.all([
    prisma.employee.create({
      data: {
        name: 'Semiha ICOZ',
        email: 'semiha.icoz@example.com',
        expertise: ['MANICURE', 'PEDICURE', 'NAIL_ART'],
        imageUrl: '/images/employees/semiha.jpg', // You can update this path later
        bio: 'Expert nail technician with over 10 years of experience specializing in artistic nail designs and professional care.',
        isActive: true,
        workSchedule: {
          create: [
            { dayOfWeek: 1, startTime: '09:00', endTime: '17:00' }, // Monday
            { dayOfWeek: 2, startTime: '09:00', endTime: '17:00' }, // Tuesday
            { dayOfWeek: 3, startTime: '09:00', endTime: '17:00' }, // Wednesday
            { dayOfWeek: 4, startTime: '09:00', endTime: '17:00' }, // Thursday
            { dayOfWeek: 5, startTime: '09:00', endTime: '17:00' }, // Friday
          ]
        }
      }
    }),

    prisma.employee.create({
      data: {
        name: 'Havva AGU',
        email: 'havva.agu@example.com',
        expertise: ['MANICURE', 'PEDICURE', 'SPECIAL'],
        imageUrl: '/images/employees/havva.jpg', // You can update this path later
        bio: 'Specialized in luxury spa treatments and nail care with a focus on therapeutic techniques.',
        isActive: true,
        workSchedule: {
          create: [
            { dayOfWeek: 1, startTime: '10:00', endTime: '18:00' }, // Monday
            { dayOfWeek: 2, startTime: '10:00', endTime: '18:00' }, // Tuesday
            { dayOfWeek: 3, startTime: '10:00', endTime: '18:00' }, // Wednesday
            { dayOfWeek: 4, startTime: '10:00', endTime: '18:00' }, // Thursday
            { dayOfWeek: 5, startTime: '10:00', endTime: '18:00' }, // Friday
            { dayOfWeek: 6, startTime: '10:00', endTime: '16:00' }, // Saturday
          ]
        }
      }
    }),

    prisma.employee.create({
      data: {
        name: 'Alexsandra Micholi',
        email: 'alexsandra.micholi@example.com',
        expertise: ['NAIL_ART', 'MANICURE', 'SPECIAL'],
        imageUrl: '/images/employees/alexsandra.jpg', // You can update this path later
        bio: 'Creative nail artist with a passion for innovative designs and contemporary nail art techniques.',
        isActive: true,
        workSchedule: {
          create: [
            { dayOfWeek: 2, startTime: '09:00', endTime: '17:00' }, // Tuesday
            { dayOfWeek: 3, startTime: '09:00', endTime: '17:00' }, // Wednesday
            { dayOfWeek: 4, startTime: '09:00', endTime: '17:00' }, // Thursday
            { dayOfWeek: 5, startTime: '09:00', endTime: '17:00' }, // Friday
            { dayOfWeek: 6, startTime: '10:00', endTime: '16:00' }, // Saturday
          ]
        }
      }
    }),
  ]);

  console.log('Seeded employees:', employees);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 