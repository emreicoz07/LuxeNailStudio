import axiosInstance from '../config/axios.config';

const API_URL = '/auth';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  phone?: string | null;
  password: string;
  confirmPassword: string;
  subscribe: boolean;
  agreeToTerms: boolean;
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

class AuthService {
   async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await axiosInstance.post<AuthResponse>(`${API_URL}/login`, credentials);
      
      if (response.data.token) {
        // Store token in HttpOnly cookie
        document.cookie = `auth_token=${response.data.token}; path=/; secure; samesite=strict; max-age=86400`; // 24 hours
        
        // Store minimal user info
        const userData = {
          id: response.data.user.id,
          name: response.data.user.name,
          email: response.data.user.email,
          role: response.data.user.role
        };
        localStorage.setItem('user', JSON.stringify(userData));
        return response.data;
      }
      throw new Error('No token received from server');
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.response?.status === 404) {
        throw new Error('Login service is currently unavailable');
      }
      if (error.response?.status === 401) {
        throw new Error('Invalid email or password');
      }
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Login failed. Please try again.');
    }
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await axiosInstance.post<AuthResponse>(`${API_URL}/register`, data);
      
      if (response.data.token) {
        // Store token in HttpOnly cookie
        document.cookie = `auth_token=${response.data.token}; path=/; secure; samesite=strict`;
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return response.data;
      }
      throw new Error('Registration successful but no token received');
    } catch (error: any) {
      console.error('Registration error:', error.response?.data);
      throw error.response?.data?.message 
        ? new Error(error.response.data.message)
        : new Error('Registration failed. Please try again later.');
    }
  }

  async forgotPassword(email: string): Promise<void> {
    try {
      await axiosInstance.post(`${API_URL}/forgot-password`, { email });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to process forgot password request');
    }
  }

  logout(): void {
    // Clear HttpOnly cookie
    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    localStorage.removeItem('user');
  }

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    return null;
  }

  isAuthenticated(): boolean {
    // Check for auth_token cookie
    return document.cookie.includes('auth_token=');
  }
}

export const authService = new AuthService(); 