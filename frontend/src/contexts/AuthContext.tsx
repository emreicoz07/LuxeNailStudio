import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { authService } from '../services/authService';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface RegisterData {
  name: string;
  email: string;
  phone?: string | null;
  password: string;
  subscribe: boolean;
  agreeToTerms: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(authService.getCurrentUser());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(() => {
    // Check for persisted error on initial load
    const storedError = sessionStorage.getItem('authError');
    return storedError ? JSON.parse(storedError) : null;
  });

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

  const register = useCallback(async (data: RegisterData) => {
    try {
      const response = await authService.register(data);
      setUser(response.user);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      clearError();
      const response = await authService.login({ email, password });
      setUser(response.user);
    } catch (err: any) {
      const errorMessage = err.message || 'Login failed. Please check your credentials.';
      setError(errorMessage);
      // Persist error in sessionStorage
      sessionStorage.setItem('authError', JSON.stringify(errorMessage));
      throw err;
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
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