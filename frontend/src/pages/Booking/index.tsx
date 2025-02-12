import React, { useState } from 'react';
import Section from '../../components/common/Section';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSpa } from 'react-icons/fa';
import { GiNails } from 'react-icons/gi';
import { format, addDays, setHours, setMinutes, isBefore, isAfter } from 'date-fns';
import { HiOutlineCalendar, HiOutlineClock, HiOutlineCash } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useMutation } from '@tanstack/react-query';
import { bookingApi } from '../../api/bookingApi';
import { useAuth } from '../../hooks/useAuth';
import { z } from 'zod';

type BookingStep = 'category' | 'service' | 'datetime' | 'summary';

interface Service {
  id: string;
  title: string;
  description: string;
  duration: string;
  price: number;
  category: string;
  depositRequired?: boolean;
  depositAmount?: number;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

interface BookingSummary {
  category: string;
  service: Service;
  date: Date;
  time: string;
  depositRequired: boolean;
}

const bookingValidationSchema = z.object({
  serviceId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid service ID format"),
  appointmentDate: z.string().datetime("Invalid date and time"),
  amount: z.number().min(0, "Amount must be positive"),
  depositAmount: z.number().min(0, "Deposit amount must be positive"),
  notes: z.string().optional()
});

interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

const BookingPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<BookingStep>('category');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedService, setSelectedService] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const categories = [
    {
      id: 'manicure',
      title: 'Manicure',
      icon: <GiNails className="w-8 h-8" />,
      description: 'Full range of manicure services including spa, gel, and extensions'
    },
    {
      id: 'pedicure',
      title: 'Pedicure',
      icon: <FaSpa className="w-8 h-8" />,
      description: 'Luxurious pedicure treatments for ultimate foot care'
    }
  ];

  const services: Service[] = [
    // Manicure Services
    {
      id: '507f1f77bcf86cd799439001',
      title: 'Manicure Spa (without polish)',
      description: 'Soak off in water with aroma oil + scrub cuticles + cleaning cuticles + shape nails',
      duration: '30 min',
      price: 15,
      category: 'manicure',
      depositRequired: true,
      depositAmount: 7.50
    },
    {
      id: '507f1f77bcf86cd799439002',
      title: 'Manicure + Normal Polish',
      description: 'Normal polish is dried naturally and can be cleaned with acetone',
      duration: '60 min',
      price: 19,
      category: 'manicure',
      depositRequired: true,
      depositAmount: 9.50
    },
    {
      id: '507f1f77bcf86cd799439003',
      title: 'Manicure + Gel Polish',
      description: 'Semipermanent / Sellac / Gel polish needs to be cured under a UV or LED lamp',
      duration: '75 min',
      price: 28,
      category: 'manicure',
      depositRequired: true,
      depositAmount: 14
    },
    {
      id: '507f1f77bcf86cd799439004',
      title: 'Manicure + Rubber Base',
      description: 'If your nails need more protection or strengthening, the rubber base may be a better choice',
      duration: '80 min',
      price: 31,
      category: 'manicure',
      depositRequired: true,
      depositAmount: 15.50
    },
    {
      id: '507f1f77bcf86cd799439005',
      title: 'Manicure + Hard Gel',
      description: 'If you have very weak nails, can use a hard gel to create a solid base',
      duration: '90 min',
      price: 33,
      category: 'manicure',
      depositRequired: true,
      depositAmount: 16.50
    },
    // Add new manicure services
    {
      id: '507f1f77bcf86cd799439006',
      title: 'Infills + Hard Gel (Short)',
      description: '3 weeks after extension nails or acrylic, hard gel, the natural part of your nail starts to show at the bottom of your artificial nail and you should have that part filled in with the Hard gel.',
      duration: '2 hr',
      price: 35,
      category: 'manicure',
      depositRequired: true,
      depositAmount: 17.50
    },
    {
      id: '507f1f77bcf86cd799439007',
      title: 'Infills + Hard Gel (Medium)',
      description: '3 weeks after extension nails or acrylic, hard gel, the natural part of your nail starts to show at the bottom of your artificial nail and you should have that part filled in with the Hard gel.',
      duration: '2 hr',
      price: 37,
      category: 'manicure',
      depositRequired: true,
      depositAmount: 18.50
    },
    {
      id: '507f1f77bcf86cd799439008',
      title: 'Infills + Hard Gel (Long)',
      description: '3 weeks after extension nails or acrylic, hard gel, the natural part of your nail starts to show at the bottom of your artificial nail and you should have that part filled in with the Hard gel.',
      duration: '2 hr 15 min',
      price: 40,
      category: 'manicure',
      depositRequired: true,
      depositAmount: 20
    },
    {
      id: '507f1f77bcf86cd799439009',
      title: 'Infills + Acrylic (Short)',
      description: '3 weeks after extension nails or acrylic, hard gel, the natural part of your nail starts to show at the bottom of your artificial nail and you should have that part filled in with the Acrylic.',
      duration: '2 hr',
      price: 35,
      category: 'manicure',
      depositRequired: true,
      depositAmount: 17.50
    },
    {
      id: '507f1f77bcf86cd799439010',
      title: 'Infills + Acrylic (Medium)',
      description: '3 weeks after extension nails or acrylic, hard gel, the natural part of your nail starts to show at the bottom of your artificial nail and you should have that part filled in with the Acrylic.',
      duration: '2 hr',
      price: 37,
      category: 'manicure',
      depositRequired: true,
      depositAmount: 18.50
    },
    {
      id: '507f1f77bcf86cd799439011',
      title: 'Infills + Acrylic (Long)',
      description: '3 weeks after extension nails or acrylic, hard gel, the natural part of your nail starts to show at the bottom of your artificial nail and you should have that part filled in with the Acrylic.',
      duration: '2 hr 15 min',
      price: 40,
      category: 'manicure',
      depositRequired: true,
      depositAmount: 20
    },
    {
      id: '507f1f77bcf86cd799439012',
      title: 'Full Set Extension + Hard Gel (Short)',
      description: 'Gel nail extension is a process that involves Hard gel built on a natural nail and cured with UV light. We use a nail form, which is a sticker that goes under the free edge (the tip) of the nail, to extend the length of the nail.',
      duration: '2 hr',
      price: 50,
      category: 'manicure',
      depositRequired: true,
      depositAmount: 25
    },
    {
      id: '507f1f77bcf86cd799439013',
      title: 'Full Set Extension + Hard Gel (Medium)',
      description: 'Gel nail extension is a process that involves Hard gel built on a natural nail and cured with UV light. We use a nail form, which is a sticker that goes under the free edge (the tip) of the nail, to extend the length of the nail.',
      duration: '2 hr 20 min',
      price: 55,
      category: 'manicure',
      depositRequired: true,
      depositAmount: 27.50
    },
    {
      id: '507f1f77bcf86cd799439014',
      title: 'Full Set Extension + Hard Gel (Long)',
      description: 'Gel nail extension is a process that involves Hard gel built on a natural nail and cured with UV light. We use a nail form, which is a sticker that goes under the free edge (the tip) of the nail, to extend the length of the nail.',
      duration: '2 hr 30 min',
      price: 60,
      category: 'manicure',
      depositRequired: true,
      depositAmount: 30
    },
    {
      id: '507f1f77bcf86cd799439015',
      title: 'Full Set Extension + Acrylic (Short)',
      description: 'Gel nail extension is a process that involves Acrylic built on a natural nail and cured with UV light. We use a nail form, which is a sticker that goes under the free edge (the tip) of the nail, to extend the length of the nail.',
      duration: '2 hr',
      price: 50,
      category: 'manicure',
      depositRequired: true,
      depositAmount: 25
    },
    {
      id: '507f1f77bcf86cd799439016',
      title: 'Full Set Extension + Acrylic (Medium)',
      description: 'Gel nail extension is a process that involves Acrylic built on a natural nail and cured with UV light. We use a nail form, which is a sticker that goes under the free edge (the tip) of the nail, to extend the length of the nail.',
      duration: '2 hr 20 min',
      price: 55,
      category: 'manicure',
      depositRequired: true,
      depositAmount: 27.50
    },
    {
      id: '507f1f77bcf86cd799439017',
      title: 'Full Set Extension + Acrylic (Long)',
      description: 'Gel nail extension is a process that involves Acrylic built on a natural nail and cured with UV light. We use a nail form, which is a sticker that goes under the free edge (the tip) of the nail, to extend the length of the nail.',
      duration: '2 hr 30 min',
      price: 60,
      category: 'manicure',
      depositRequired: true,
      depositAmount: 30
    },

    // Service Add-ons for Manicure
    {
      id: '507f1f77bcf86cd799439018',
      title: 'Nail Arts',
      description: 'From 2 euro each',
      duration: '10 min',
      price: 2,
      category: 'manicure',
      depositRequired: false
    },
    {
      id: '507f1f77bcf86cd799439019',
      title: 'French/Ombre',
      description: 'French or ombre nail design',
      duration: '20 min',
      price: 5,
      category: 'manicure',
      depositRequired: false
    },

    // Pedicure Services
    {
      id: '507f1f77bcf86cd799439020',
      title: 'Pedicure Spa (without polish)',
      description: 'Pedicure spa in the water which includes callus removal and scrub exfoliation',
      duration: '45 min',
      price: 30,
      category: 'pedicure',
      depositRequired: true,
      depositAmount: 15
    },
    {
      id: '507f1f77bcf86cd799439021',
      title: 'Pedicure Spa Only (For Gentleman)',
      description: 'Pedicure spa in the water which includes callus removal and scrub exfoliation, for gentleman',
      duration: '45 min',
      price: 32,
      category: 'pedicure',
      depositRequired: true,
      depositAmount: 16
    },
    {
      id: '507f1f77bcf86cd799439022',
      title: 'Toes Normal Polish (without spa)',
      description: 'Basic toe nail polish application',
      duration: '50 min',
      price: 18,
      category: 'pedicure',
      depositRequired: true,
      depositAmount: 9.50
    },
    {
      id: '507f1f77bcf86cd799439023',
      title: 'Toes Gel Polish (Without Spa)',
      description: 'Includes cleaning cuticles and shape nails + application of Gel polish',
      duration: '50 min',
      price: 25,
      category: 'pedicure',
      depositRequired: true,
      depositAmount: 12.50
    },
    {
      id: '507f1f77bcf86cd799439024',
      title: 'Pedicure Spa + Normal Polish',
      description: 'Pedicure spa in the water which includes callus removal and scrub exfoliation + application of Normal polish',
      duration: '75 min',
      price: 35,
      category: 'pedicure',
      depositRequired: true,
      depositAmount: 17.50
    },
    {
      id: '507f1f77bcf86cd799439025',
      title: 'Pedicure Spa + Gel Polish',
      description: 'Pedicure spa in the water which includes callus removal and scrub exfoliation + application of Gel polish',
      duration: '75 min',
      price: 40,
      category: 'pedicure',
      depositRequired: true,
      depositAmount: 20
    },

    // Add service add-ons for both categories
    {
      id: '507f1f77bcf86cd799439026',
      title: 'Take off gel polish',
      description: 'Removal of existing gel polish',
      duration: '15 min',
      price: 10,
      category: 'pedicure',
      depositRequired: false
    },
    {
      id: '507f1f77bcf86cd799439027',
      title: 'Take off hard gel',
      description: 'Removal of existing hard gel',
      duration: '20 min',
      price: 12,
      category: 'pedicure',
      depositRequired: false
    },
    {
      id: '507f1f77bcf86cd799439028',
      title: 'Take off acrylic',
      description: 'Removal of existing acrylic',
      duration: '30 min',
      price: 12,
      category: 'pedicure',
      depositRequired: false
    },
    {
      id: '507f1f77bcf86cd799439029',
      title: 'Nail effects (Magnetic)',
      description: 'Special magnetic nail effects',
      duration: '15 min',
      price: 5,
      category: 'pedicure',
      depositRequired: false
    }
  ];

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentStep('service');
  };

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
    setCurrentStep('datetime');
  };

  const filteredServices = services.filter(
    service => service.category === selectedCategory
  );

  const generateTimeSlots = (selectedDate: Date): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const startHour = 9; // 9 AM
    const endHour = 17; // 5 PM
    const now = new Date();

    for (let hour = startHour; hour <= endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = setMinutes(setHours(selectedDate, hour), minute);
        
        // Skip times in the past for today
        if (format(selectedDate, 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd') && 
            isBefore(time, now)) {
          continue;
        }

        slots.push({
          time: format(time, 'h:mm a'),
          available: true // In a real app, this would come from your backend
        });
      }
    }
    return slots;
  };

  const handleDateTimeSubmit = () => {
    if (selectedTime) {
      setCurrentStep('summary');
    }
  };

  const getSelectedService = (): Service | undefined => {
    return services.find(service => service.id === selectedService);
  };

  const createBookingMutation = useMutation({
    mutationFn: bookingApi.createBooking,
    onSuccess: () => {
      toast.success('Booking confirmed successfully!');
      navigate('/appointments');
    },
    onError: (error: ApiError) => {
      if (error.errors) {
        setValidationErrors(
          Object.fromEntries(
            Object.entries(error.errors).map(([key, messages]) => [key, messages[0]])
          )
        );
        toast.error('Please check the booking details and try again.');
      } else {
        toast.error(error.message || 'Failed to create booking. Please try again.');
      }
    }
  });

  const handleBookingSubmit = async () => {
    const service = getSelectedService();
    if (!service || !selectedTime) return;

    if (!isAuthenticated) {
      toast.error('Please log in to make a booking');
      navigate('/login', { 
        state: { 
          returnTo: '/booking',
          bookingData: { serviceId: service.id, date: selectedDate, time: selectedTime }
        } 
      });
      return;
    }

    setValidationErrors({});
    
    try {
      const [hours, minutes] = selectedTime.match(/(\d+):(\d+)/)?.slice(1).map(Number) || [0, 0];
      const period = selectedTime.toLowerCase().includes('pm') ? 'PM' : 'AM';
      const hour24 = period === 'PM' && hours !== 12 ? hours + 12 : hours;
      
      const appointmentDateTime = new Date(selectedDate);
      appointmentDateTime.setHours(hour24, minutes, 0, 0);

      if (isBefore(appointmentDateTime, new Date())) {
        throw new Error('Cannot book appointments in the past');
      }
      
      const bookingData = {
        serviceId: service.id,
        appointmentDate: appointmentDateTime.toISOString(),
        amount: service.price,
        depositAmount: service.depositAmount || (service.price >= 50 ? Math.round(service.price * 0.2) : 0),
        notes: '',
      };

      if (!/^[0-9a-fA-F]{24}$/.test(bookingData.serviceId)) {
        throw new Error('Invalid service ID format');
      }

      const validatedData = bookingValidationSchema.parse(bookingData);
      createBookingMutation.mutate(validatedData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = Object.fromEntries(
          error.errors.map(err => [err.path[0], err.message])
        );
        setValidationErrors(errors);
        toast.error('Please check the booking details and try again.');
      } else {
        toast.error((error as Error).message || 'An unexpected error occurred');
      }
    }
  };

  return (
    <Section className="pt-20 min-h-screen">
      <div className="mx-auto max-w-4xl">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {['category', 'service', 'datetime', 'summary'].map((step, index) => (
              <div key={step} className="flex items-center">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center
                  ${currentStep === step 
                    ? 'bg-primary-300 text-white' 
                    : 'bg-gray-200 text-gray-600'}
                `}>
                  {index + 1}
                </div>
                {index < 3 && (
                  <div className={`
                    w-24 h-1 mx-2
                    ${index < ['category', 'service', 'datetime', 'summary']
                      .indexOf(currentStep) 
                      ? 'bg-primary-300' 
                      : 'bg-gray-200'}
                  `} />
                )}
              </div>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {currentStep === 'category' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <h1 className="mb-8 text-4xl font-bold text-center">
                Choose Your Service Category
              </h1>
              <div className="grid gap-6 md:grid-cols-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategorySelect(category.id)}
                    className="p-8 bg-white rounded-2xl border-2 border-gray-100 shadow-sm transition-all duration-300 hover:border-primary-300 group hover:shadow-md"
                  >
                    <div className="flex flex-col items-center space-y-4 text-center">
                      <div className="flex justify-center items-center w-16 h-16 rounded-full transition-colors duration-300 bg-primary-50 text-primary-300 group-hover:bg-primary-100">
                        {category.icon}
                      </div>
                      <h3 className="text-xl font-semibold">{category.title}</h3>
                      <p className="text-gray-600">{category.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {currentStep === 'service' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center mb-8">
                <button
                  onClick={() => setCurrentStep('category')}
                  className="text-gray-500 transition-colors hover:text-primary-500"
                >
                  ← Back
                </button>
                <h1 className="flex-1 text-4xl font-bold text-center">
                  Select Your Service
                </h1>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                {filteredServices.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => handleServiceSelect(service.id)}
                    className="p-6 text-left bg-white rounded-xl border-2 border-gray-100 shadow-sm transition-all duration-300 hover:border-primary-300 group hover:shadow-md"
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <h3 className="text-xl font-semibold">{service.title}</h3>
                        <span className="font-semibold text-primary-500">
                          ${service.price}
                        </span>
                      </div>
                      <p className="text-gray-600">{service.description}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="flex items-center">
                          <svg className="mr-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {service.duration}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {currentStep === 'datetime' && selectedService && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center mb-8">
                <button
                  onClick={() => setCurrentStep('service')}
                  className="text-gray-500 transition-colors hover:text-primary-500"
                >
                  ← Back
                </button>
                <h1 className="flex-1 text-4xl font-bold text-center">
                  Choose Date & Time
                </h1>
              </div>

              {/* Date Selection */}
              <div className="space-y-4">
                <h2 className="flex items-center text-xl font-semibold">
                  <HiOutlineCalendar className="mr-2 w-5 h-5" />
                  Select Date
                </h2>
                <div className="grid grid-cols-4 gap-3">
                  {[...Array(7)].map((_, index) => {
                    const date = addDays(new Date(), index);
                    const isSelected = format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
                    
                    return (
                      <button
                        key={index}
                        onClick={() => setSelectedDate(date)}
                        className={`
                          p-4 rounded-lg border-2 transition-all duration-300
                          ${isSelected 
                            ? 'border-primary-300 bg-primary-50' 
                            : 'border-gray-100 hover:border-primary-200'
                          }
                        `}
                      >
                        <div className="text-sm text-gray-600">
                          {format(date, 'EEE')}
                        </div>
                        <div className="text-lg font-semibold">
                          {format(date, 'd')}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Selection */}
              <div className="space-y-4">
                <h2 className="flex items-center text-xl font-semibold">
                  <HiOutlineClock className="mr-2 w-5 h-5" />
                  Select Time
                </h2>
                <div className="grid grid-cols-3 gap-3 md:grid-cols-4">
                  {generateTimeSlots(selectedDate).map((slot) => (
                    <button
                      key={slot.time}
                      onClick={() => setSelectedTime(slot.time)}
                      disabled={!slot.available}
                      className={`
                        p-3 rounded-lg border-2 transition-all duration-300
                        ${selectedTime === slot.time 
                          ? 'border-primary-300 bg-primary-50' 
                          : 'border-gray-100 hover:border-primary-200'
                        }
                        ${!slot.available && 'opacity-50 cursor-not-allowed'}
                      `}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Continue Button */}
              <div className="flex justify-end mt-8">
                <button
                  onClick={handleDateTimeSubmit}
                  disabled={!selectedTime}
                  className={`
                    px-6 py-3 rounded-lg font-semibold text-white
                    transition-all duration-300
                    ${selectedTime 
                      ? 'bg-primary-500 hover:bg-primary-600' 
                      : 'bg-gray-300 cursor-not-allowed'
                    }
                  `}
                >
                  Continue to Summary
                </button>
              </div>
            </motion.div>
          )}

          {currentStep === 'summary' && selectedService && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center mb-8">
                <button
                  onClick={() => setCurrentStep('datetime')}
                  className="text-gray-500 transition-colors hover:text-primary-500"
                >
                  ← Back
                </button>
                <h1 className="flex-1 text-4xl font-bold text-center">
                  Booking Summary
                </h1>
              </div>

              <div className="bg-white rounded-xl border-2 border-gray-100 p-6 space-y-6">
                {/* Service Details */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Selected Service</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-gray-600">Category</p>
                      <p className="font-semibold">
                        {categories.find(cat => cat.id === selectedCategory)?.title}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-gray-600">Service</p>
                      <p className="font-semibold">{getSelectedService()?.title}</p>
                    </div>
                  </div>
                </div>

                {/* Date & Time */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Appointment Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <HiOutlineCalendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-gray-600">Date</p>
                        <p className="font-semibold">{format(selectedDate, 'EEEE, MMMM d, yyyy')}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <HiOutlineClock className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-gray-600">Time</p>
                        <p className="font-semibold">{selectedTime}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Price Details */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Price Details</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Service Price</span>
                      <span className="font-semibold">${getSelectedService()?.price}</span>
                    </div>
                    {getSelectedService()?.price >= 50 && (
                      <div className="flex justify-between items-center text-primary-600">
                        <span>Required Deposit (20%)</span>
                        <span className="font-semibold">
                          ${(getSelectedService()?.price * 0.2).toFixed(2)}
                        </span>
                      </div>
                    )}
                    <div className="border-t border-gray-100 pt-3">
                      <div className="flex justify-between items-center font-semibold text-lg">
                        <span>Total</span>
                        <span>${getSelectedService()?.price}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="bg-primary-50 rounded-lg p-4 text-sm text-gray-600">
                <p>
                  By confirming this booking, you agree to our{' '}
                  <a href="/terms" className="text-primary-500 hover:text-primary-600">
                    Terms & Conditions
                  </a>
                  . A confirmation email will be sent to your registered email address.
                </p>
              </div>

              {/* Validation Errors */}
              {Object.keys(validationErrors).length > 0 && (
                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 text-sm text-red-600">
                  <h3 className="font-semibold mb-2">Please correct the following errors:</h3>
                  <ul className="list-disc list-inside">
                    {Object.entries(validationErrors).map(([field, message]) => (
                      <li key={field}>{message}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Confirm Button */}
              <div className="flex justify-end mt-8">
                <button
                  onClick={handleBookingSubmit}
                  disabled={createBookingMutation.isPending || Object.keys(validationErrors).length > 0}
                  className="px-6 py-3 rounded-lg font-semibold text-white bg-primary-500 hover:bg-primary-600 
                    transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {createBookingMutation.isPending ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
                        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" 
                          stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" 
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                        </path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    'Confirm Booking'
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Section>
  );
};

export default BookingPage; 