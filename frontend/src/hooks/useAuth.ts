import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export const useAuth = () => {
  const getAuthToken = () => {
    return document.cookie
      .split('; ')
      .find(row => row.startsWith('auth_token='))
      ?.split('=')[1];
  };

  const isAuthenticated = !!getAuthToken();

  return {
    isAuthenticated,
    getAuthToken
  };
}; 