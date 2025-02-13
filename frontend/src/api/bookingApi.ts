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

      console.log('Sending booking request:', formattedData);
      const response = await api.post('/bookings', formattedData);
      console.log('Booking response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Booking error:', error);
      if (axios.isAxiosError(error)) {
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
  }
}; 