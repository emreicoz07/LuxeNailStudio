import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import Section from '../../components/common/Section';
import Card from '../../components/common/Card';
import { bookingApi } from '../../api/bookingApi';
import { Service } from '../../types/schema';
import { ServiceCategory } from '../../types/schema';
import { GiNails } from 'react-icons/gi';
import { FaSpa } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getServiceImage, getAddonImage } from '../../utils/imageUtils';
import { serviceImages } from '../../constants/serviceImages';
import OptimizedImage from '../../components/common/OptimizedImage';

const categories = [
  {
    id: ServiceCategory.MANICURE,
    title: 'Manicure',
    icon: <GiNails className="w-12 h-12 text-primary-500" />,
    description: 'Full range of manicure services including spa, gel, and extensions',
    bgImage: serviceImages[ServiceCategory.MANICURE].default,
    imageTitle: 'Professional Manicure Services'
  },
  {
    id: ServiceCategory.PEDICURE,
    title: 'Pedicure',
    icon: <FaSpa className="w-12 h-12 text-primary-500" />,
    description: 'Luxurious pedicure treatments for ultimate foot care',
    bgImage: serviceImages[ServiceCategory.PEDICURE].default,
    imageTitle: 'Luxury Pedicure Treatments'
  }
];

const ServicesPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = React.useState<string>('');
  const [selectedService, setSelectedService] = React.useState<string>('');

  const { data: services, isLoading, error: servicesError } = useQuery({
    queryKey: ['services', selectedCategory],
    queryFn: async () => {
      try {
        const response = await bookingApi.getServices(selectedCategory);
        console.log('Services response:', response);
        return response.data || [];
      } catch (error) {
        console.error('Service fetch error:', error);
        throw error;
      }
    },
    enabled: !!selectedCategory,
  });

  const { data: addons, isLoading: isLoadingAddons, error: addonsError } = useQuery({
    queryKey: ['addons', selectedService],
    queryFn: () => bookingApi.getAddOns(selectedService),
    enabled: !!selectedService,
    onError: (error) => {
      console.error('Error fetching addons:', error);
    }
  });

  const handleBookNow = (serviceId: string) => {
    navigate(`/booking?service=${serviceId}`);
  };

  useEffect(() => {
    console.log('Current state:', {
      selectedCategory,
      services,
      isLoading,
      servicesError
    });
  }, [selectedCategory, services, isLoading, servicesError]);

  if (servicesError) {
    return (
      <Section className="pt-20 pb-20 bg-gray-50">
        <div className="px-4 mx-auto max-w-7xl">
          <div className="text-center text-red-600">
            <p>Error loading services. Please try again later.</p>
          </div>
        </div>
      </Section>
    );
  }

  return (
    <Section className="pt-20 pb-20 bg-gray-50">
      <div className="px-4 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center"
        >
          <h1 className="mb-4 text-4xl font-bold text-gray-900">Our Services</h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Choose from our wide range of professional nail care services
          </p>
        </motion.div>
        
        {/* Categories */}
        <div className="grid gap-8 mb-16 md:grid-cols-2">
          {categories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => {
                setSelectedCategory(category.id);
                setSelectedService('');
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative overflow-hidden rounded-xl shadow-lg transition-all
                ${selectedCategory === category.id
                  ? 'ring-4 ring-primary-500 ring-opacity-50'
                  : 'hover:shadow-xl'
                }`}
            >
              <div 
                className="relative z-10 p-8 bg-center bg-cover"
                style={{ backgroundImage: `url(${category.bgImage})` }}
              >
                <div className={`flex gap-6 items-center ${
                  selectedCategory === category.id ? 'text-white' : 'text-gray-900'
                }`}>
                  {category.icon}
                  <div className="text-left">
                    <h3 className="text-2xl font-bold">{category.title}</h3>
                    <p className="mt-2 text-sm opacity-90">{category.description}</p>
                  </div>
                </div>
              </div>
              <div className={`absolute inset-0 transition-all ${
                selectedCategory === category.id
                  ? 'bg-primary-500 bg-opacity-80'
                  : 'bg-white bg-opacity-90'
              }`} />
            </motion.button>
          ))}
        </div>

        {/* Services */}
        <AnimatePresence mode="wait">
          {selectedCategory && (
            <motion.div
              key={selectedCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <h2 className="text-3xl font-bold text-gray-900">
                {categories.find(c => c.id === selectedCategory)?.title} Services
              </h2>
              
              {isLoading ? (
                <div className="flex justify-center py-16">
                  <LoadingSpinner />
                </div>
              ) : !services || services.length === 0 ? (
                <div className="py-16 text-center text-gray-500">
                  {servicesError ? 'Error loading services' : 'No services available for this category.'}
                </div>
              ) : (
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {services.map((service: Service) => (
                    <motion.div
                      key={service.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <Card className="overflow-hidden h-full transition-shadow hover:shadow-lg">
                        <div className="relative w-full h-48 group">
                          <OptimizedImage
                            src={getServiceImage(service)}
                            alt={service.name}
                            className="object-cover w-full h-full rounded-t-lg transition-transform duration-300 group-hover:scale-105"
                            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                              const target = e.target as HTMLImageElement;
                              target.src = serviceImages.fallback;
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t to-transparent opacity-0 transition-opacity duration-300 from-black/60 group-hover:opacity-100">
                            <div className="absolute right-0 bottom-0 left-0 p-4 text-white">
                              <h4 className="text-lg font-semibold">
                                {service.name} Treatment
                              </h4>
                              <p className="text-sm opacity-90">
                                Professional {categories.find(c => c.id === service.category)?.title} Service
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="p-6">
                          <h3 className="mb-2 text-xl font-bold text-gray-900">{service.name}</h3>
                          <p className="mb-4 text-gray-600">{service.description}</p>
                          <div className="flex justify-between items-center mb-4">
                            <span className="text-2xl font-bold text-primary-500">
                              ${service.price}
                            </span>
                            <span className="text-sm text-gray-500">
                              {service.duration} min
                            </span>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedService(service.id);
                              handleBookNow(service.id);
                            }}
                            className="px-4 py-2 w-full text-white rounded-lg transition-colors bg-primary-500 hover:bg-primary-600"
                          >
                            Book Now
                          </button>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Add-ons Section */}
              {selectedService && !isLoadingAddons && addons?.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-16"
                >
                  <h3 className="mb-8 text-2xl font-bold text-gray-900">Available Add-ons</h3>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {addons.map((addon: Service) => (
                      <Card key={addon.id} className="p-4">
                        <div className="overflow-hidden relative mb-3 rounded-lg group">
                          <img
                            src={getAddonImage(addon)}
                            alt={addon.name}
                            className="object-cover w-full h-24 transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t to-transparent opacity-0 transition-opacity duration-300 from-black/60 group-hover:opacity-100">
                            <div className="absolute right-0 bottom-0 left-0 p-2 text-white">
                              <p className="text-sm font-medium">
                                {addon.name} Enhancement
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-gray-900">{addon.name}</h4>
                          <span className="font-bold text-primary-500">${addon.price}</span>
                        </div>
                        <p className="mb-2 text-sm text-gray-600">{addon.description}</p>
                        <span className="text-xs text-gray-500">+{addon.duration} min</span>
                      </Card>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Section>
  );
};

export default ServicesPage; 