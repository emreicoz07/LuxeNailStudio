import axios from 'axios';
import config from '../config/config';

const api = axios.create({
  baseURL: `${config.apiUrl}/bookings`,
  withCredentials: true
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

interface CreateBookingData {
  serviceId: string;
  appointmentDate: string;
  amount: number;
  depositAmount?: number;
  notes?: string;
}

export const bookingApi = {
  createBooking: async (data: CreateBookingData) => {
    try {
      // Format the date properly
      const formattedData = {
        ...data,
        appointmentDate: new Date(data.appointmentDate).toISOString(),
      };

      const response = await api.post('/', formattedData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
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