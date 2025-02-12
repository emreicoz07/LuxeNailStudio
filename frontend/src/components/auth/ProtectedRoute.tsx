import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Store the attempted URL
    sessionStorage.setItem('redirectAfterLogin', location.pathname);
    
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}; 