import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { authService } from '../services/authService';
import { toast } from 'react-hot-toast';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  phone?: string;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  password: string;
  confirmPassword: string;
  subscribe: boolean;
  agreeToTerms: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: (fromAllDevices?: boolean) => Promise<void>;
  clearError: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(() => {
    // Check for persisted error on initial load
    const storedError = sessionStorage.getItem('authError');
    return storedError ? JSON.parse(storedError) : null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const clearError = useCallback(() => {
    setError(null);
    sessionStorage.removeItem('authError');
  }, []);

  // Clear stored error when component unmounts
  useEffect(() => {
    return () => {
      sessionStorage.removeItem('authError');
    };
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check for auth token in cookies
        const token = document.cookie
          .split('; ')
          .find(row => row.startsWith('auth_token='))
          ?.split('=')[1];

        if (token) {
          // Get user data from localStorage
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            const userData = JSON.parse(storedUser);
            setUser(userData);
            setIsAuthenticated(true);
          } else {
            // Token var ama user data yoksa, logout işlemi yap
            await logout();
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setUser(null);
        setIsAuthenticated(false);
      }
    };

    initializeAuth();
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    try {
      setLoading(true);
      clearError();
      const response: AuthResponse = await authService.register(data);
      setUser(response.user);
      setIsAuthenticated(true);
    } catch (err: any) {
      const errorMessage = err.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      sessionStorage.setItem('authError', JSON.stringify(errorMessage));
      throw err;
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      clearError();
      const response: AuthResponse = await authService.login({ email, password });
      
      // Ensure we have a token in the response
      if (!response.token) {
        throw new Error('No token received from server');
      }
      
      // Store token and user data
      localStorage.setItem('token', response.token);
      setUser(response.user);
      setIsAuthenticated(true);
    } catch (err: any) {
      const errorMessage = err.message || 'Login failed. Please check your credentials.';
      setError(errorMessage);
      sessionStorage.setItem('authError', JSON.stringify(errorMessage));
      throw err;
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  const logout = useCallback(async (fromAllDevices: boolean = false) => {
    try {
      if (fromAllDevices) {
        await authService.logoutAll();
      } else {
        await authService.logout();
      }
      
      setUser(null);
      localStorage.removeItem('token');
      
      // Toast ayarlarını hot-toast'a uygun şekilde güncelleyelim
      toast.success('Logged out successfully', {
        duration: 3000, // autoClose yerine duration kullanılıyor
        position: "top-right"
      });
      
      // Force reload to clear any cached data
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout. Please try again.');
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        isAuthenticated,
        login,
        register,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 