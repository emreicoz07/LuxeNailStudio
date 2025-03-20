import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useEffect, useState } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check for auth token in cookies
        const hasToken = document.cookie
          .split('; ')
          .some(row => row.startsWith('auth_token='));

        if (!hasToken) {
          // Store the attempted URL
          sessionStorage.setItem('redirectAfterLogin', location.pathname);
        }
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [location.pathname]);

  if (isChecking) {
    // Optional: Show loading spinner
    return <div>Loading...</div>;
  }

  if (!isAuthenticated || !user) {
    // Store the attempted URL
    sessionStorage.setItem('redirectAfterLogin', location.pathname);
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}; 