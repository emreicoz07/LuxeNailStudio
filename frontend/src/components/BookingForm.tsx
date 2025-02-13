import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BookingService } from '../services/bookingService';
import { toast } from 'react-toastify';

export const BookingForm = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const bookingService = new BookingService();

  const handleSubmit = async (bookingData) => {
    try {
      if (!isAuthenticated) {
        // Store the intended booking data in session storage
        sessionStorage.setItem('pendingBooking', JSON.stringify(bookingData));
        // Redirect to login
        navigate('/login');
        return;
      }

      const response = await bookingService.createBooking(bookingData);
      toast.success('Booking created successfully!');
      navigate('/bookings/confirmation', { state: { booking: response } });
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Rest of the component code...
}; 