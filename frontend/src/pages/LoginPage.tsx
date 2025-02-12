import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FaApple, FaFacebook, FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import Button from '../components/common/Button';

interface LoginFormInputs {
  email: string;
  password: string;
}

const schema = yup.object().shape({
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
});

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(() => {
    // Check if there's an error stored in sessionStorage
    const storedError = sessionStorage.getItem('loginError');
    return storedError ? JSON.parse(storedError) : null;
  });

  // Clear error when component unmounts or user starts typing
  useEffect(() => {
    return () => {
      sessionStorage.removeItem('loginError');
    };
  }, []);

  const { register, handleSubmit, formState: { errors }, setError, watch } = useForm<LoginFormInputs>({
    resolver: yupResolver(schema)
  });

  // Clear error when user starts typing
  useEffect(() => {
    const subscription = watch(() => {
      if (loginError) {
        setLoginError(null);
        sessionStorage.removeItem('loginError');
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, loginError]);

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      setIsSubmitting(true);
      setLoginError(null);
      sessionStorage.removeItem('loginError');
      await login(data.email, data.password);
      
      toast.success('Welcome back! 👋', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Check for redirect after login
      const redirectPath = sessionStorage.getItem('redirectAfterLogin');
      sessionStorage.removeItem('redirectAfterLogin'); // Clean up
      
      // Redirect to the stored path or home
      navigate(redirectPath || '/');
    } catch (err: any) {
      const errorMessage = err.message || 'Login failed. Please check your credentials.';
      
      // Store error in sessionStorage
      sessionStorage.setItem('loginError', JSON.stringify(errorMessage));
      
      // Show error toast with longer duration
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: false, // Won't auto-close
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      // Set form-level error
      setError('root', {
        type: 'manual',
        message: errorMessage
      });
      
      // Store the error message in state
      setLoginError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-200 via-primary-100 to-primary-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg"
      >
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Welcome Back
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to your account
          </p>
        </div>

        {loginError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative mb-4 p-4 bg-red-50 border border-red-200 rounded-lg"
          >
            <div className="flex justify-between items-start">
              <p className="text-red-600 text-sm">{loginError}</p>
              <button
                onClick={() => {
                  setLoginError(null);
                  sessionStorage.removeItem('loginError');
                }}
                className="text-red-400 hover:text-red-600 transition-colors"
                aria-label="Dismiss error"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                {...register('email')}
                type="email"
                className="input"
                placeholder="Enter your email"
                autoComplete="email"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? "text" : "password"}
                  className="input pr-10"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary-500"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Link
              to="/forgot-password"
              className="text-sm font-medium text-primary-500 hover:text-primary-600"
            >
              Forgot your password?
            </Link>
          </div>

          {errors.root && (
            <div className="text-red-500 text-sm mt-2">
              {errors.root.message}
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            isLoading={isSubmitting}
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: <FcGoogle className="w-5 h-5" />, name: 'Google' },
              { icon: <FaFacebook className="w-5 h-5 text-blue-600" />, name: 'Facebook' },
              { icon: <FaApple className="w-5 h-5" />, name: 'Apple' }
            ].map((provider) => (
              <button
                key={provider.name}
                type="button"
                className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-500 bg-white hover:bg-gray-50"
              >
                {provider.icon}
              </button>
            ))}
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-primary-500 hover:text-primary-600">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage; 