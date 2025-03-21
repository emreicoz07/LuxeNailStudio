import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { authService } from '../services/authService';

interface RegisterFormInputs {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
  subscribe: boolean;
  agreeToTerms: boolean;
}

const schema = yup.object().shape({
  firstName: yup
    .string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must not exceed 50 characters')
    .matches(/^[A-Za-z\s]+$/, 'First name can only contain letters and spaces'),
  
  lastName: yup
    .string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must not exceed 50 characters')
    .matches(/^[A-Za-z\s]+$/, 'Last name can only contain letters and spaces'),
  
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address'),
  
  phone: yup
    .string()
    .nullable()
    .transform((value) => (value === '' ? null : value))
    .matches(/^\+?[1-9]\d{1,14}$/, {
      message: 'Please enter a valid phone number',
      excludeEmptyString: true
    }),
  
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),
  
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords do not match'),
  
  subscribe: yup
    .boolean()
    .default(false),
  
  agreeToTerms: yup
    .boolean()
    .oneOf([true], 'You must agree to the Terms & Conditions')
});

const RegisterPage = () => {
  const { register: registerUser, error: authError, clearError } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<RegisterFormInputs>({
    resolver: yupResolver(schema),
    mode: 'onChange'
  });

  const password = watch('password');
  const confirmPassword = watch('confirmPassword');

  // Update password match effect with proper error handling
  useEffect(() => {
    if (confirmPassword && password !== confirmPassword) {
      setError('confirmPassword', {
        type: 'manual',
        message: 'Passwords do not match. Please make sure both password fields are identical.'
      });
    } else {
      // Clear the error when passwords match
      setError('confirmPassword', {
        type: 'manual',
        message: undefined
      });
    }
  }, [password, confirmPassword, setError]);

  const onSubmit = async (data: RegisterFormInputs) => {
    try {
      const registrationData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        phone: data.phone || undefined,
        subscribe: data.subscribe || false,
        agreeToTerms: data.agreeToTerms
      };

      await registerUser(registrationData);
      toast.success('Registration successful! Please log in.');
      navigate('/login');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
        (Array.isArray(error.message) ? error.message[0] : error.message) ||
        'Registration failed. Please try again.';
      
      toast.error(errorMessage);
      
      // Handle specific error cases
      if (error.response?.data?.error === 'PASSWORD_MISMATCH') {
        setError('confirmPassword', {
          type: 'manual',
          message: error.response.data.message
        });
      } else if (error.response?.data?.error === 'EMAIL_EXISTS') {
        setError('email', {
          type: 'manual',
          message: error.response.data.message
        });
      }
    }
  };

  // Clear auth errors when component unmounts
  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-white py-12 px-4 sm:px-6 lg:px-8">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg"
      >
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>
        
        {authError && (
          <div className="mb-6 p-4 bg-red-50 text-red-500 rounded-lg text-sm">
            {authError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="firstName" className="sr-only">First Name</label>
              <input
                {...register("firstName")}
                type="text"
                className="input"
                placeholder="First Name"
              />
              {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>}
            </div>

            <div>
              <label htmlFor="lastName" className="sr-only">Last Name</label>
              <input
                {...register("lastName")}
                type="text"
                className="input"
                placeholder="Last Name"
              />
              {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>}
            </div>

            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address"
                  }
                })}
                type="email"
                className="input"
                placeholder="Email address"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="phone" className="sr-only">Phone Number (Optional)</label>
              <input
                {...register("phone", {
                  pattern: {
                    value: /^\+?[1-9]\d{1,14}$/,
                    message: "Invalid phone number format"
                  }
                })}
                type="tel"
                className="input"
                placeholder="Phone Number (Optional)"
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
            </div>

            <div className="relative">
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 8, message: "Password must be at least 8 characters" },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])/,
                    message: "Password must contain at least one uppercase letter, one lowercase letter, and one special character"
                  }
                })}
                type={showPassword ? "text" : "password"}
                className="input"
                placeholder="Password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm text-gray-600">Please confirm your password</label>
            <div className="relative">
              <input
                {...register('confirmPassword')}
                type={showConfirmPassword ? "text" : "password"}
                className="input pr-10"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary-500"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          <div className="flex items-start space-x-3">
            <input
              {...register('subscribe')}
              type="checkbox"
              id="subscribe"
              className="mt-1 w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
            />
            <label htmlFor="subscribe" className="text-sm text-gray-600">
              Would you like to receive exclusive nail care tips and promotions?
            </label>
          </div>

          <div className="flex items-start space-x-3">
            <input
              {...register('agreeToTerms')}
              type="checkbox"
              id="agreeToTerms"
              className="mt-1 w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
            />
            <label htmlFor="agreeToTerms" className="text-sm text-gray-600">
              I agree to the{' '}
              <Link to="/terms" className="text-primary-500 hover:text-primary-600">
                Terms & Conditions
              </Link>
            </label>
          </div>
          {errors.agreeToTerms && (
            <p className="text-red-500 text-sm">{errors.agreeToTerms.message}</p>
          )}

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {isSubmitting ? 'Creating account...' : 'Create account'}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-500 hover:text-primary-600">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default RegisterPage; 