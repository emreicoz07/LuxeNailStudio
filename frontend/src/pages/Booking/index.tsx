import React, { useState, useRef, useEffect, useMemo } from 'react';
import Section from '../../components/common/Section';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSpa } from 'react-icons/fa';
import { GiNails } from 'react-icons/gi';
import { format, addDays, addMonths, isBefore, startOfToday } from 'date-fns';
import { HiOutlineCalendar, HiOutlineClock, } from 'react-icons/hi';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useMutation, useQuery } from '@tanstack/react-query';
import { bookingApi,  } from '../../api/bookingApi';
import { useAuth } from '../../hooks/useAuth';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

type BookingStep = 'category' | 'service' | 'employee' | 'datetime' | 'summary';

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

interface Employee {
  id: string;
  name: string;
  imageUrl?: string;
  bio?: string;
  expertise: string[];
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
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
 
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated,} = useAuth();
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [addOns, setAddOns] = useState<Service[]>([]);
  const addOnsSectionRef = useRef<HTMLDivElement>(null);
  const dateSelectionRef = useRef<HTMLDivElement>(null);
  const [bookingNotes] = useState('');
  const [timeSlots, setTimeSlots] = useState<Array<{ time: string; available: boolean }>>([]);

  // Add-ons görüntülendiğini takip etmek için yeni state
  const [hasViewedAddons, setHasViewedAddons] = useState(false);

  // Minimum ve maksimum tarih aralığını belirle
  const minDate = startOfToday();
  const maxDate = addMonths(minDate, 2); // 2 ay ileri

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

  const { data: employees, isLoading: isLoadingEmployees } = useQuery({
    queryKey: ['employees', selectedService],
    queryFn: async () => {
      if (!selectedService) return [];
      console.log('Fetching employees for service:', selectedService);
      const result = await bookingApi.getEmployees(selectedService);
      console.log('Employees result:', result);
      return result;
    },
    enabled: !!selectedService,
  });

  const { data: workingHours } = useQuery({
    queryKey: ['workingHours'],
    queryFn: () => bookingApi.getWorkingHours(),
    staleTime: Infinity, // Çalışma saatleri nadiren değişeceği için cache'de tutalım
  });

  useEffect(() => {
    if (addonsData) {
      const transformedAddons = addonsData.map((addon: any) => ({
        id: addon._id || addon.id,
        name: addon.name,
        description: addon.description || '',
        duration: addon.duration,
        price: addon.price,
        category: addon.category || '',
        imageUrl: addon.imageUrl
      }));
      setAddOns(transformedAddons);
      console.log('Transformed addons:', transformedAddons); // Debug için
    } else {
      setAddOns([]);
    }
  }, [addonsData]);

  const getSelectedService = (): Service | undefined => {
    if (!services) return undefined;
    return services.find((service: Service) => service.id === selectedService);
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentStep('service');
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Adım geçişlerini kontrol eden fonksiyon
  const handleStepTransition = (nextStep: BookingStep) => {
    // Servis seçiminden sonra add-ons görüntülenmeden geçişe izin verme
    if (currentStep === 'service' && nextStep === 'employee' && !hasViewedAddons) {
      toast.warning('Please check additional services before proceeding', {
        duration: 3000,
        position: "top-right"
      });
      // Add-ons bölümüne scroll
      addOnsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    
    setCurrentStep(nextStep);
    // Sayfa başına scroll
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Servis seçim fonksiyonunu güncelle
  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
    setHasViewedAddons(false); // Yeni servis seçildiğinde reset
    // Otomatik geçişi kaldır
    // setCurrentStep('employee');
  };

  const handleEmployeeSelect = (employeeId: string) => {
    setSelectedEmployee(employeeId);
    setCurrentStep('datetime');
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleDateTimeSubmit = () => {
    if (selectedTime) {
      setCurrentStep('summary');
    }
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const createBookingMutation = useMutation({
    mutationFn: (bookingData: any) => bookingApi.createBooking(bookingData),
    onError: (error: any) => {
      if (error.response?.data?.errors) {
        toast.error(error.response.data.errors);
      } else {
        toast.error(error.response?.data?.message || 'Failed to create booking');
      }
    }
  });

  const calculateTotalPrice = () => {
    let total = 0;
    // Add service price
    const selectedServiceData = services?.find((service: Service) => service.id === selectedService);
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

      const selectedServiceData = services?.find((service: Service) => service.id === selectedService);
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
        employeeId: selectedEmployee || undefined,
        addOnIds: selectedAddOns,
        appointmentDate: appointmentDate.toISOString(),
        amount: totalAmount,
        notes: bookingNotes || ''
      };

      const result = await createBookingMutation.mutateAsync(bookingData);
      
      if (result) {
        // Show success message
        toast.success('Booking created successfully! Redirecting to booking details...', {
          position: "top-center",
          autoClose: 3000
        });

        // Wait for toast to be visible before redirecting
        setTimeout(() => {
          navigate(`/bookings/${result._id}`, {
            state: { bookingConfirmed: true }
          });
        }, 2000);
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

  useEffect(() => {
    const fetchTimeSlots = async () => {
      if (!selectedDate || !selectedEmployee || !selectedService) return;

      try {
        setTimeSlots([]); // Önceki slotları temizle
        const formattedDate = format(selectedDate, 'yyyy-MM-dd');
        const slots = await bookingApi.getAvailableTimeSlots(
          formattedDate,
          selectedEmployee,
          selectedService
        );
        setTimeSlots(slots);
      } catch (error) {
        console.error('Error fetching time slots:', error);
        toast.error('Failed to load available time slots');
      }
    };

    fetchTimeSlots();
  }, [selectedDate, selectedEmployee, selectedService]);

  useEffect(() => {
    const checkAuth = async () => {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth_token='))
        ?.split('=')[1];

      if (!token) {
        sessionStorage.setItem('redirectAfterLogin', '/appointments');
        navigate('/login');
      }
    };

    checkAuth();
  }, [navigate]);

  // Adım değişikliğinde scroll'u sıfırla
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // Yumuşak geçiş için
    });
  }, [currentStep]);

  const filteredAddOns = useMemo(() => {
    if (!selectedService || !addOns) return [];
    
    // No need to filter by category since the backend already handles this
    // Just return all addons returned from the API
    return addOns;
  }, [selectedService, addOns]);

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime(''); // Yeni tarih seçildiğinde seçili saati sıfırla
    setTimeSlots([]); // Zaman slotlarını sıfırla
  };

  // datetime adımı için render fonksiyonu güncelleme
  const renderDateTimeStep = () => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="space-y-6"
      >
        <h2 className="text-2xl font-semibold mb-6">Select Date & Time</h2>
        
        {/* Calendar ve Time Slots Container */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Calendar Section */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-medium mb-4">Select Date</h3>
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              inline
              minDate={minDate}
              maxDate={maxDate}
              calendarClassName="!border-none"
              dayClassName={date => 
                isBefore(date, minDate) ? "text-gray-300" : "hover:bg-primary-100"
              }
              filterDate={date => {
                // Pazar günlerini ve çalışma günü olmayan günleri devre dışı bırak
                const dayOfWeek = format(date, 'EEEE').toUpperCase();
                return workingHours?.[dayOfWeek]?.isOpen ?? false;
              }}
            />
          </div>

          {/* Time Slots Section */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-medium mb-4">Available Time Slots</h3>
            {selectedDate ? (
              timeSlots.length > 0 ? (
                <div className="grid grid-cols-3 gap-3">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot.time}
                      onClick={() => setSelectedTime(slot.time)}
                      disabled={!slot.available}
                      className={`
                        p-3 rounded-lg text-center transition-colors
                        ${selectedTime === slot.time
                          ? 'bg-primary-500 text-white'
                          : slot.available
                            ? 'bg-gray-100 hover:bg-primary-100'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }
                      `}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Loading available time slots...
                </div>
              )
            ) : (
              <div className="text-center py-8 text-gray-500">
                Please select a date to see available time slots
              </div>
            )}

            {/* Çalışma Saatleri Bilgisi */}
            {selectedDate && workingHours && (
              <div className="mt-6 pt-4 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-600 mb-2">
                  Working Hours for {format(selectedDate, 'EEEE')}
                </h4>
                {(() => {
                  const dayHours = workingHours[format(selectedDate, 'EEEE').toUpperCase()];
                  return dayHours?.isOpen ? (
                    <p className="text-sm text-gray-500">
                      {dayHours.openTime} - {dayHours.closeTime}
                    </p>
                  ) : (
                    <p className="text-sm text-red-500">Closed</p>
                  );
                })()}
              </div>
            )}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={() => setCurrentStep('employee')}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Back
          </button>
          <button
            onClick={() => setCurrentStep('summary')}
            disabled={!selectedDate || !selectedTime}
            className={`
              px-6 py-3 rounded-lg transition-colors
              ${selectedDate && selectedTime
                ? 'bg-primary-500 text-white hover:bg-primary-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }
            `}
          >
            Next
          </button>
        </div>
      </motion.div>
    );
  };

  return (
    <Section className="mt-8">
      <div className="mx-auto max-w-4xl">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {['category', 'service', 'employee', 'datetime', 'summary'].map((step, index) => (
              <div key={step} className="flex items-center">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center
                  ${currentStep === step 
                    ? 'bg-primary-300 text-white' 
                    : 'bg-gray-200 text-gray-600'}
                `}>
                  {index + 1}
                </div>
                {index < 4 && (
                  <div className={`
                    w-24 h-1 mx-2
                    ${index < ['category', 'service', 'employee', 'datetime', 'summary']
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

          {currentStep === 'service' && selectedCategory && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
              ref={addOnsSectionRef}
            >
              <div className="flex items-center mb-8">
                <button
                  onClick={() => {
                    setSelectedCategory('');
                    setSelectedService('');
                    setCurrentStep('category');
                  }}
                  className="text-gray-500 transition-colors hover:text-primary-500"
                >
                  ← Back
                </button>
                <h1 className="flex-1 text-4xl font-bold text-center">
                  Select Your Service
                </h1>
              </div>

              {isLoadingServices ? (
                <div className="flex justify-center">
                  <div className="w-12 h-12 rounded-full border-b-2 animate-spin border-primary-500" />
                </div>
              ) : services && services.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2">
                  {services.map((service: Service) => (
                    <motion.button
                      key={service.id}
                      onClick={() => handleServiceSelect(service.id)}
                      className={`p-4 text-left rounded-lg border-2 transition-all duration-300
                        ${selectedService === service.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-primary-200 bg-white'
                        }`}
                    >
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold">{service.name}</h3>
                          <span className="font-medium">${service.price}</span>
                        </div>
                        <p className="text-sm text-gray-600">{service.description}</p>
                        <p className="text-sm text-gray-500">Duration: {service.duration} minutes</p>
                      </div>
                    </motion.button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600">No services available for this category.</p>
                </div>
              )}

              {/* Add Cancel Selection Button when a service is selected */}
              {selectedService && (
                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => {
                      setSelectedService('');
                      setSelectedAddOns([]);
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-red-500 transition-colors"
                  >
                    Cancel Selection
                  </button>
                </div>
              )}

              {/* Continue Button */}
              {selectedService && (
                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => setCurrentStep('employee')}
                    className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                  >
                    Continue
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {currentStep === 'service' && selectedService && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6 mt-8"
              ref={addOnsSectionRef}
            >
              <div className="border-t border-gray-200">
                <div className="sticky top-0 bg-white z-10 py-4 shadow-sm">
                  <h2 className="text-2xl font-semibold">Additional Services</h2>
                </div>
                
                <div className="pt-6">
                  {isLoadingAddOns ? (
                    <div className="flex justify-center">
                      <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
                    </div>
                  ) : filteredAddOns && filteredAddOns.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {filteredAddOns.map((addon) => (
                        <div
                          key={addon.id}
                          onClick={() => {
                            setSelectedAddOns(prev =>
                              prev.includes(addon.id)
                                ? prev.filter(id => id !== addon.id)
                                : [...prev, addon.id]
                            );
                          }}
                          className={`
                            p-4 rounded-lg border-2 transition-all duration-300 cursor-pointer
                            ${selectedAddOns.includes(addon.id)
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-gray-200 hover:border-primary-200'
                            }
                          `}
                        >
                          <div className="space-y-2">
                            <div className="flex justify-between items-start">
                              <h3 className="font-semibold">{addon.name}</h3>
                              <span className="font-medium text-primary-600">${addon.price}</span>
                            </div>
                            <p className="text-sm text-gray-600">{addon.description}</p>
                            <div className="flex justify-between items-center text-sm text-gray-500">
                              <span>Duration: {addon.duration} min</span>
                              {selectedAddOns.includes(addon.id) && (
                                <span className="text-primary-500">Selected</span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 py-4">
                      No additional services available for this service.
                    </p>
                  )}
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <button
                  onClick={() => {
                    setSelectedService('');
                    setSelectedAddOns([]);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-red-500 transition-colors"
                >
                  ← Back to Services
                </button>
                
                <button
                  onClick={() => setCurrentStep('employee')}
                  className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  Continue to Select Stylist →
                </button>
              </div>
            </motion.div>
          )}

          {currentStep === 'employee' && selectedService && (
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
                  Choose Your Stylist
                </h1>
              </div>

              {isLoadingEmployees ? (
                <div className="flex justify-center">
                  <div className="w-12 h-12 rounded-full border-b-2 animate-spin border-primary-500" />
                </div>
              ) : employees && employees.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2">
                  {employees.map((employee: Employee) => (
                    <motion.button
                      key={employee.id}
                      onClick={() => handleEmployeeSelect(employee.id)}
                      className={`p-4 text-left rounded-lg border-2 transition-all duration-300
                        ${selectedEmployee === employee.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-primary-200 bg-white'}`}
                    >
                        <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold">{employee.name}</h3>
                        </div>
                        <p className="text-sm text-gray-600">{employee.bio}</p>
                        <p className="text-xs text-gray-500">Expertise: {employee.expertise.join(', ')}</p>
                      </div>
                    </motion.button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600">No stylists are currently available for this service.</p>
                  {process.env.NODE_ENV === 'development' && (
                    <div className="mt-4 p-4 bg-gray-100 rounded-lg text-left">
                      <p className="text-sm text-gray-600">Debug Info:</p>
                      <p className="text-xs text-gray-500">Selected Service ID: {selectedService}</p>
                      <p className="text-xs text-gray-500">Employees Data: {JSON.stringify(employees)}</p>
                    </div>
                  )}
                  <button
                    onClick={() => setCurrentStep('datetime')}
                    className="mt-4 px-6 py-2 text-white bg-primary-600 rounded-lg hover:bg-primary-700"
                  >
                    Continue without stylist preference
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {currentStep === 'datetime' && renderDateTimeStep()}

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

              <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
                {/* Service Details */}
                {(() => {
                  const selectedServiceData = getSelectedService();
                  return selectedServiceData ? (
                    <div className="space-y-4">
                      <h2 className="text-xl font-semibold">Selected Service</h2>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{selectedServiceData.name}</h3>
                            <p className="text-sm text-gray-600">{selectedServiceData.description}</p>
                            <p className="text-sm text-gray-600">Duration: {selectedServiceData.duration} minutes</p>
                          </div>
                          <p className="font-semibold">${selectedServiceData.price}</p>
                        </div>
                      </div>
                    </div>
                  ) : null;
                })()}

                {/* Selected Employee */}
                {selectedEmployee && employees && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Selected Stylist</h2>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      {(() => {
                        const employee = employees.find((e: { id: string }) => e.id === selectedEmployee);
                        return employee ? (
                          <div className="flex items-start gap-4">
                            {employee.imageUrl && (
                              <img
                                src={employee.imageUrl} 
                                alt={employee.name}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                            )}
                            <div>
                              <h3 className="font-medium">{employee.name}</h3>
                              {employee.bio && <p className="text-sm text-gray-600">{employee.bio}</p>}
                            </div>
                          </div>
                        ) : null;
                      })()}
                    </div>
                  </div>
                )}

                {/* Appointment Time */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Appointment Time</h2>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <HiOutlineCalendar className="w-5 h-5 text-gray-500" />
                      <span>{format(selectedDate, 'MMMM d, yyyy')}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <HiOutlineClock className="w-5 h-5 text-gray-500" />
                      <span>{selectedTime}</span>
                    </div>
                  </div>
                </div>

                {/* Total Price */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Total Price</h2>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span>Total</span>
                      <span className="text-xl font-bold">${calculateTotalPrice()}</span>
                    </div>
                  </div>
                </div>

                {/* Confirm Booking Button */}
                <div className="flex justify-end pt-6">
                  <button
                    onClick={handleBookingSubmit}
                    className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                  >
                    Confirm Booking
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

// Helper fonksiyonlar
const getNextStep = (currentStep: BookingStep): BookingStep => {
  const steps: BookingStep[] = ['category', 'service', 'employee', 'datetime', 'summary'];
  const currentIndex = steps.indexOf(currentStep);
  return steps[currentIndex + 1];
};

const getPreviousStep = (currentStep: BookingStep): BookingStep => {
  const steps: BookingStep[] = ['category', 'service', 'employee', 'datetime', 'summary'];
  const currentIndex = steps.indexOf(currentStep);
  return steps[currentIndex - 1];
};

export default BookingPage; 