import { ServiceCategory } from '../types/schema';
import { serviceImages } from '../constants/serviceImages';

export const getServiceImage = (service: {
  name: string;
  category: string;
  imageUrl?: string;
}) => {
  try {
    if (service.imageUrl) {
      return service.imageUrl;
    }

    const category = service.category as ServiceCategory;
    const serviceKey = service.name.toLowerCase().replace(/\s+/g, '-');

    if (category && serviceImages[category]?.services) {
      return (
        serviceImages[category].services[serviceKey] ||
        serviceImages[category].default ||
        serviceImages.fallback
      );
    }

    return serviceImages.fallback;
  } catch (error) {
    console.error('Error getting service image:', error);
    return serviceImages.fallback;
  }
};

export const getAddonImage = (addon: {
  name: string;
  imageUrl?: string;
}) => {
  try {
    if (addon.imageUrl) {
      return addon.imageUrl;
    }

    const addonKey = addon.name.toLowerCase().replace(/\s+/g, '-');
    return serviceImages.addons[addonKey] || serviceImages.fallback;
  } catch (error) {
    console.error('Error getting addon image:', error);
    return serviceImages.fallback;
  }
}; 