import axios from 'axios';
import config from '../config/config';
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
  private baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${this.baseURL}/auth/login`, {
        email,
        password
      });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async register(data: RegisterData) {
    try {
      const response = await axiosInstance.post(`${API_URL}/register`, data);
      
      // Check if we have a successful response with token
      if (response.data.token) {
        // Store token and user data
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Return the response data
        return response.data;
      } else {
        throw new Error('Registration successful but no token received');
      }
    } catch (error) {
      console.error('Registration error:', error.response?.data);
      // Throw the error with a more specific message
      throw error.response?.data?.message 
        ? error 
        : new Error('Registration failed. Please try again later.');
    }
  }

  async forgotPassword(email: string): Promise<void> {
    await axios.post(`${this.baseURL}/auth/forgot-password`, { email });
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    return null;
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const authService = new AuthService(); 