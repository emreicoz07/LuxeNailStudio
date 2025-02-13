import React, { useState, useRef, useEffect, useMemo } from 'react';
import Section from '../../components/common/Section';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSpa } from 'react-icons/fa';
import { GiNails } from 'react-icons/gi';
import { format, addDays, setHours, setMinutes, isBefore,  } from 'date-fns';
import { HiOutlineCalendar, HiOutlineClock, } from 'react-icons/hi';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useMutation, useQuery } from '@tanstack/react-query';
import { bookingApi,  } from '../../api/bookingApi';
import { useAuth } from '../../hooks/useAuth';
import { z } from 'zod';


type BookingStep = 'category' | 'service' | 'datetime' | 'summary';

interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  category: string;
  deposit: number;
  imageUrl?: string;
}



interface TimeSlot {
  time: string;
  available: boolean;
}


const bookingValidationSchema = z.object({
  serviceId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid service ID format"),
  addOnIds: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid add-on ID format")).optional(),
  appointmentDate: z.string().datetime("Invalid date and time"),
  amount: z.number().min(0, "Amount must be positive"),
  depositAmount: z.number().min(0, "Deposit amount must be positive").optional(),
  notes: z.string().optional()
});



const ScrollIndicator: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, y: 0 }}
    animate={{ opacity: 1, y: [0, 10, 0] }}
    transition={{ 
      duration: 1.5,
      repeat: Infinity,
      repeatType: "reverse"
    }}
    className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-primary-500"
  >
    <svg 
      className="w-6 h-6"
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M19 14l-7 7m0 0l-7-7m7 7V3"
      />
    </svg>
  </motion.div>
);

const BookingPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<BookingStep>('category');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedService, setSelectedService] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
 
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated,} = useAuth();
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [addOns, setAddOns] = useState<Service[]>([]);
  const addOnsSectionRef = useRef<HTMLDivElement>(null);
  const dateSelectionRef = useRef<HTMLDivElement>(null);
  const [bookingNotes, setBookingNotes] = useState('');

  const categories = [
    {
      id: 'MANICURE',
      title: 'Manicure',
      icon: <GiNails className="w-8 h-8" />,
      description: 'Full range of manicure services including spa, gel, and extensions'
    },
    {
      id: 'PEDICURE',
      title: 'Pedicure',
      icon: <FaSpa className="w-8 h-8" />,
      description: 'Luxurious pedicure treatments for ultimate foot care'
    }
  ];

  const { data: services, isLoading: isLoadingServices } = useQuery({
    queryKey: ['services', selectedCategory],
    queryFn: async () => {
      const data = await bookingApi.getServices(selectedCategory);
      console.log('Services for category:', selectedCategory, data);
      return data;
    },
    enabled: !!selectedCategory,
    staleTime: 5 * 60 * 1000 // Cache for 5 minutes
  });

  const { data: addonsData, isLoading: isLoadingAddOns } = useQuery({
    queryKey: ['addons', selectedService],
    queryFn: () => selectedService ? bookingApi.getAddOns(selectedService) : Promise.resolve([]),
    enabled: !!selectedService,
  });

  useEffect(() => {
    if (addonsData) {
      // Transform the data to ensure it matches the Service interface
      const transformedAddons = addonsData.map((addon: any) => ({
        id: addon._id || addon.id, // Handle both MongoDB _id and regular id
        name: addon.name,
        description: addon.description || '',
        duration: addon.duration,
        price: addon.price,
        category: addon.category || '',
        imageUrl: addon.imageUrl
      }));
      setAddOns(transformedAddons);
    } else {
      setAddOns([]);
    }
  }, [addonsData, selectedService]);

  const getSelectedService = (): Service | undefined => {
    if (!services) return undefined;
    return services.find((service: Service) => service.id === selectedService);
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentStep('service');
  };

  const handleServiceSelect = (serviceId: string) => {
    // Eğer aynı servis tekrar seçilirse seçimi kaldır
    if (selectedService === serviceId) {
      setSelectedService('');
      setAddOns([]); // Add-ons listesini temizle
      setSelectedAddOns([]); // Seçili add-onları temizle
    } else {
      setSelectedService(serviceId);
      setSelectedAddOns([]); // Yeni servis seçildiğinde seçili add-onları temizle
    }
  };

  const filteredAddOns = useMemo(() => {
    if (!selectedService || !addOns) return [];
    
    // No need to filter by category since the backend already handles this
    // Just return all addons returned from the API
    return addOns;
  }, [selectedService, addOns]);

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

  const createBookingMutation = useMutation({
    mutationFn: (bookingData: any) => bookingApi.createBooking(bookingData),
    onError: (error: any) => {
      if (error.response?.data?.errors) {
        setValidationErrors(error.response.data.errors);
      } else {
        toast.error(error.response?.data?.message || 'Failed to create booking');
      }
    }
  });

  const calculateTotalPrice = () => {
    let total = 0;

    // Add service price
    const selectedServiceData = services?.find(s => s.id === selectedService);
    if (selectedServiceData) {
      total += selectedServiceData.price;
    }

    // Add selected add-ons prices
    selectedAddOns.forEach(addOnId => {
      const addon = addOns.find(a => a.id === addOnId);
      if (addon) {
        total += addon.price;
      }
    });

    return total;
  };


  const handleBookingSubmit = async () => {
    try {
      if (!isAuthenticated) {
        toast.error('Please login to make a booking');
        navigate('/login', { 
          state: { from: location.pathname } 
        });
        return;
      }

      const selectedServiceData = services?.find(s => s.id === selectedService);
      if (!selectedServiceData) {
        toast.error('Please select a service');
        return;
      }

      // Parse time string and create Date object
      const timeMatch = selectedTime.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (!timeMatch) {
        toast.error('Invalid time format');
        return;
      }

      let [_, hours, minutes, period] = timeMatch;
      let hour = parseInt(hours);
      
      // Convert to 24-hour format
      if (period.toUpperCase() === 'PM' && hour !== 12) {
        hour += 12;
      } else if (period.toUpperCase() === 'AM' && hour === 12) {
        hour = 0;
      }

      const appointmentDate = new Date(selectedDate);
      appointmentDate.setHours(hour, parseInt(minutes), 0, 0);

      const totalAmount = calculateTotalPrice();

      const bookingData = {
        serviceId: selectedServiceData.id,
        addOnIds: selectedAddOns,
        appointmentDate: appointmentDate.toISOString(),
        amount: totalAmount,
        notes: bookingNotes || ''
      };

      const result = await createBookingMutation.mutateAsync(bookingData);
      
      if (result) {
        toast.success('Booking created successfully!');
        navigate('/bookings/' + result._id);
      }
    } catch (error: any) {
      console.error('Booking error:', error);
      if (error.message === 'Please login to make a booking') {
        toast.error(error.message);
        navigate('/login', { 
          state: { from: location.pathname }
        });
        return;
      }
      toast.error(error.message || 'Failed to create booking');
    }
  };

  const handleContinueToDateTime = () => {
    setCurrentStep('datetime');
    // Scroll to top with smooth behavior
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleAddOnSelect = (addOnId: string) => {
    setSelectedAddOns(prev => 
      prev.includes(addOnId)
        ? prev.filter(id => id !== addOnId)
        : [...prev, addOnId]
    );
  };

  useEffect(() => {
    if (services) {
      console.log('Loaded services:', services);
      console.log('Selected service:', selectedService);
    }
  }, [services, selectedService]);

  // Add effect to handle scrolling when service is selected
  useEffect(() => {
    if (selectedService && addOnsSectionRef.current) {
      setTimeout(() => {
        addOnsSectionRef.current?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }, 300); // Small delay to ensure smooth transition
    }
  }, [selectedService]);

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
              className="relative space-y-8"
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
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold">Select Service</h2>
                {isLoadingServices ? (
                  <div className="flex justify-center">
                    <div className="w-12 h-12 rounded-full border-b-2 animate-spin border-primary-500" />
                  </div>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2">
                    {services?.map((service: Service) => (
                      <motion.button
                        key={service.id}
                        onClick={() => handleServiceSelect(service.id)}
                        className={`p-4 text-left rounded-lg border-2 transition-all duration-300 relative
                          ${selectedService === service.id
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-primary-200 bg-white'}
                          ${selectedService && selectedService !== service.id
                            ? 'opacity-50 cursor-not-allowed'
                            : 'cursor-pointer hover:shadow-sm'}`}
                        disabled={selectedService && selectedService !== service.id ? true : false}
                      >
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <h3 className="font-semibold">{service.name}</h3>
                            <span className="text-primary-600">€{service.price}</span>
                          </div>
                          <p className="text-sm text-gray-600">{service.description}</p>
                          <div className="text-sm text-gray-500">
                            Duration: {service.duration} minutes
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>

              {selectedService && filteredAddOns.length > 0 && (
                <ScrollIndicator />
              )}

              {selectedService && (
                <>
                  {isLoadingAddOns ? (
                    <div className="flex justify-center mt-8">
                      <div className="w-12 h-12 rounded-full border-b-2 animate-spin border-primary-500" />
                    </div>
                  ) : filteredAddOns.length > 0 ? (
                    <div 
                      ref={addOnsSectionRef}
                      className="mt-8 space-y-6 add-ons-section scroll-mt-24"
                    >
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="flex justify-between items-center mb-6">
                          <h2 className="text-2xl font-semibold">Optional Add-ons</h2>
                          {selectedAddOns.length > 0 && (
                            <button
                              onClick={() => setSelectedAddOns([])}
                              className="text-sm text-primary-600 hover:text-primary-700"
                            >
                              Clear all
                            </button>
                          )}
                        </div>
                        
                        <motion.div 
                          className="grid gap-4 md:grid-cols-3"
                          initial="hidden"
                          animate="visible"
                          variants={{
                            visible: {
                              transition: {
                                staggerChildren: 0.1
                              }
                            }
                          }}
                        >
                          {filteredAddOns.map((addon) => (
                            <motion.button
                              key={addon.id}
                              variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0 }
                              }}
                              onClick={() => handleAddOnSelect(addon.id)}
                              className={`p-4 text-left rounded-lg border-2 transition-all duration-300
                                ${selectedAddOns.includes(addon.id)
                                  ? 'border-primary-500 bg-primary-50'
                                  : 'border-gray-200 hover:border-primary-200 bg-white'}`}
                            >
                              <div className="space-y-2">
                                <div className="flex justify-between items-start">
                                  <h3 className="font-semibold">{addon.name}</h3>
                                  <span className="text-primary-600">€{addon.price}</span>
                                </div>
                                <p className="text-sm text-gray-600">{addon.description}</p>
                                <div className="text-sm text-gray-500">
                                  Duration: {addon.duration} minutes
                                </div>
                              </div>
                            </motion.button>
                          ))}
                        </motion.div>
                      </motion.div>
                    </div>
                  ) : null}
                </>
              )}

              {/* Continue Button */}
              <div className="flex justify-end mt-8">
                <button
                  onClick={handleContinueToDateTime}
                  disabled={!selectedService}
                  className={`px-6 py-2 rounded-lg transition-colors
                    ${selectedService
                      ? 'text-white bg-primary-600 hover:bg-primary-700'
                      : 'text-gray-500 bg-gray-200 cursor-not-allowed'}`}
                >
                  Continue
                </button>
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
              <div ref={dateSelectionRef} className="space-y-4">
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
                        key={date.toISOString()}
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

          {currentStep === 'summary' && (
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

              <div className="p-6 space-y-6 bg-white rounded-lg shadow-sm">
                {/* Selected Service */}
                <div>
                  <h2 className="mb-4 text-xl font-semibold">Selected Service</h2>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    {getSelectedService() && (
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <h3 className="font-medium">{getSelectedService()?.name}</h3>
                          <span className="text-primary-600">€{getSelectedService()?.price}</span>
                        </div>
                        <p className="text-sm text-gray-600">{getSelectedService()?.description}</p>
                        <div className="text-sm text-gray-500">
                          Duration: {getSelectedService()?.duration} minutes
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Selected Add-ons */}
                {selectedAddOns.length > 0 && (
                  <div>
                    <h2 className="mb-4 text-xl font-semibold">Selected Add-ons</h2>
                    <div className="space-y-3">
                      {selectedAddOns.map(addonId => {
                        const addon = addOns?.find((a: Service) => a.id === addonId);
                        return addon ? (
                          <div key={addon.id} className="p-4 bg-gray-50 rounded-lg">
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <h3 className="font-medium">{addon.name}</h3>
                                <span className="text-primary-600">€{addon.price}</span>
                              </div>
                              <p className="text-sm text-gray-600">{addon.description}</p>
                              <div className="text-sm text-gray-500">
                                Duration: {addon.duration} minutes
                              </div>
                            </div>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}

                {/* Date and Time */}
                <div>
                  <h2 className="mb-4 text-xl font-semibold">Appointment Time</h2>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <HiOutlineCalendar className="w-5 h-5 text-gray-500" />
                        <span>{format(selectedDate, 'EEEE, MMMM d, yyyy')}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <HiOutlineClock className="w-5 h-5 text-gray-500" />
                        <span>{selectedTime}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Total Price */}
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>Total Price:</span>
                    <span className="text-primary-600">€{calculateTotalPrice()}</span>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <h2 className="mb-4 text-xl font-semibold">Additional Notes</h2>
                  <textarea
                    value={bookingNotes}
                    onChange={(e) => setBookingNotes(e.target.value)}
                    placeholder="Any special requests or notes for your appointment..."
                    className="p-3 w-full rounded-lg border focus:ring-2 focus:ring-primary-300 focus:border-primary-300"
                    rows={4}
                  />
                </div>

                {/* Booking Button */}
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setCurrentStep('datetime')}
                    className="px-6 py-2 text-primary-600 hover:text-primary-700"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleBookingSubmit}
                    disabled={createBookingMutation.isPending}
                    className="flex items-center px-6 py-2 space-x-2 text-white rounded-lg bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
                  >
                    {createBookingMutation.isPending ? (
                      <>
                        <div className="w-4 h-4 rounded-full border-2 border-white animate-spin border-t-transparent" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <span>Confirm Booking</span>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Section>
  );
};

export default BookingPage; 