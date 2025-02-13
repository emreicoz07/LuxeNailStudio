import { axiosInstance } from '../utils/axios';

export class BookingService {
  async createBooking(bookingData: CreateBookingDto) {
    try {
      const response = await axiosInstance.post('/bookings', bookingData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error('Your session has expired. Please log in again.');
      }
      if (error.response?.status === 404) {
        throw new Error('Service not found. Please check if the service is still available.');
      }
      throw new Error(error.response?.data?.message || 'Failed to create booking. Please try again.');
    }
  }

  private getAuthToken(): string {
    // Get token from cookie
    const cookies = document.cookie.split(';');
    const authCookie = cookies.find(cookie => cookie.trim().startsWith('auth_token='));
    return authCookie ? authCookie.split('=')[1] : '';
  }
} 