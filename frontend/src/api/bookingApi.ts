import axios from 'axios';
import { config } from '../config';

const api = axios.create({
  baseURL: config.apiUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('auth_token='))
    ?.split('=')[1];

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface CreateBookingData {
  serviceId: string;
  addOnIds?: string[];
  appointmentDate: string;
  amount: number;
  notes?: string;
}

export const bookingApi = {
  createBooking: async (data: CreateBookingData) => {
    try {
      const formattedData = {
        ...data,
        appointmentDate: new Date(data.appointmentDate).toISOString(),
        addOnIds: data.addOnIds || []
      };

      const response = await api.post('/bookings', formattedData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new Error('Please login to make a booking');
        }
        if (error.response?.status === 404) {
          throw new Error('Service not found. Please check if the service is still available.');
        }
        throw {
          message: error.response?.data?.message || 'Failed to create booking',
          errors: error.response?.data?.errors
        };
      }
      throw error;
    }
  },

  getAvailableSlots: async (date: string, serviceId: string) => {
    const response = await api.get('/available-slots', {
      params: { date, serviceId }
    });
    return response.data;
  },

  getServices: async (category?: string) => {
    try {
      const response = await api.get('/services', {
        params: { 
          category: category?.toUpperCase() // Ensure uppercase for consistency
        }
      });
      
      return response.data.map((service: any) => ({
        id: service._id,
        name: service.name,
        description: service.description,
        duration: service.duration,
        price: service.price,
        category: service.category,
        deposit: service.deposit,
        imageUrl: service.imageUrl
      }));
    } catch (error) {
      console.error('Error fetching services:', error);
      throw error;
    }
  },

  getAddOns: async (serviceId: string) => {
    try {
      const response = await api.get(`/services/${serviceId}/addons`);
      return response.data;
    } catch (error) {
      console.error('Error fetching add-ons:', error);
      throw error;
    }
  },

  getEmployees: async (serviceId: string) => {
    try {
      const response = await api.get('/employees', {
        params: { serviceId }
      });
      return response.data.map((employee: any) => ({
        id: employee._id,
        name: employee.name,
        imageUrl: employee.imageUrl,
        bio: employee.bio,
        expertise: employee.expertise
      }));
    } catch (error) {
      console.error('Error fetching employees:', error);
      // Return empty array instead of throwing
      return [];
    }
  },

  getEmployeeAvailability: async (employeeId: string, date: string) => {
    try {
      const response = await api.get(`/employees/${employeeId}/availability`, {
        params: { date }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching employee availability:', error);
      throw error;
    }
  },

  getWorkingHours: async () => {
    try {
      const response = await api.get('/bookings/working-hours');
      return response.data;
    } catch (error) {
      console.error('Error fetching working hours:', error);
      throw error;
    }
  },

  getAvailableTimeSlots: async (date: string, employeeId: string, serviceId: string) => {
    try {
      const response = await api.get('/available-slots', {
        params: {
          date,
          employeeId,
          serviceId
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching available slots:', error);
      throw error;
    }
  }
}; 