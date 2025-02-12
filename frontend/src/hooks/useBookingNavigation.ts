import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

export const useBookingNavigation = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleBookNowClick = () => {
    if (!user) {
      // Store the intended destination
      sessionStorage.setItem('redirectAfterLogin', '/appointments');
      
      // Show a toast notification
      toast.info('Please log in to book an appointment', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      // Redirect to login page
      navigate('/login');
      return;
    }
    
    // User is authenticated, proceed to appointments
    navigate('/appointments');
  };

  return handleBookNowClick;
}; 