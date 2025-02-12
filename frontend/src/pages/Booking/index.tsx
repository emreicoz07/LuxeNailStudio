import React, { useState } from 'react';
import Section from '../../components/common/Section';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSpa } from 'react-icons/fa';
import { GiNails } from 'react-icons/gi';
import { format, addDays, setHours, setMinutes, isBefore, isAfter } from 'date-fns';
import { HiOutlineCalendar, HiOutlineClock } from 'react-icons/hi';

type BookingStep = 'category' | 'service' | 'datetime' | 'summary';

interface Service {
  id: string;
  title: string;
  description: string;
  duration: string;
  price: number;
  category: string;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

const BookingPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<BookingStep>('category');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedService, setSelectedService] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');

  const categories = [
    {
      id: 'manicure',
      title: 'Manicure',
      icon: <GiNails className="w-8 h-8" />,
      description: 'Luxurious hand and nail care treatments'
    },
    {
      id: 'pedicure',
      title: 'Pedicure',
      icon: <FaSpa className="w-8 h-8" />,
      description: 'Rejuvenating foot and nail treatments'
    }
  ];

  const services: Service[] = [
    {
      id: 'classic-manicure',
      title: 'Classic Manicure',
      description: 'Essential nail care with regular polish',
      duration: '45 min',
      price: 35,
      category: 'manicure'
    },
    {
      id: 'gel-manicure',
      title: 'Gel Manicure',
      description: 'Long-lasting gel polish with nail care',
      duration: '60 min',
      price: 45,
      category: 'manicure'
    },
    {
      id: 'classic-pedicure',
      title: 'Classic Pedicure',
      description: 'Relaxing foot care with regular polish',
      duration: '50 min',
      price: 40,
      category: 'pedicure'
    },
    {
      id: 'gel-pedicure',
      title: 'Gel Pedicure',
      description: 'Premium foot care with gel polish',
      duration: '65 min',
      price: 50,
      category: 'pedicure'
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
        </AnimatePresence>
      </div>
    </Section>
  );
};

export default BookingPage; 