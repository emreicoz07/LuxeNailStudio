import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FaApple, FaFacebook, FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const { login, error, clearError } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
      navigate('/'); // Redirect to home page after successful login
    } catch (err) {
      // Error is handled by the auth context
      console.error('Login failed:', err);
    }
  };

  // Clear any existing errors when component unmounts
  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-200 via-primary-100 to-primary-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] w-full max-w-md mx-4"
      >
        <h1 className="text-4xl font-secondary font-semibold text-center mb-8 text-text-primary">
          Welcome Back
        </h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-lg text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <motion.div
            className="space-y-5"
          >
            <motion.div
              whileFocus={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <input
                type="email"
                placeholder="Email"
                autoFocus
                className="w-full px-4 py-3 rounded-xl border border-primary-100 focus:border-primary-300 focus:ring-2 focus:ring-primary-100 outline-none transition-all duration-200"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </motion.div>
            
            <div className="relative">
              <motion.div
                whileFocus={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full px-4 py-3 rounded-xl border border-primary-100 focus:border-primary-300 focus:ring-2 focus:ring-primary-100 outline-none transition-all duration-200 pr-10"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </motion.div>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-primary-500 transition-colors duration-200"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </motion.div>

          <div className="text-right mt-2">
            <Link 
              to="/forgot-password" 
              className="text-primary-500 hover:text-primary-600 text-sm font-medium transition-colors duration-200"
            >
              Forgot Password?
            </Link>
          </div>

          <motion.button
            whileHover={{ scale: 1.02, backgroundColor: '#FF147B' }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="w-full px-6 py-3 mt-6 bg-primary-500 text-white rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-200"
            type="submit"
          >
            Sign In
          </motion.button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-text-secondary">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            {[
              { icon: <FcGoogle className="text-xl" />, name: 'Google' },
              { icon: <FaFacebook className="text-xl text-blue-600" />, name: 'Facebook' },
              { icon: <FaApple className="text-xl" />, name: 'Apple' }
            ].map((provider) => (
              <motion.button
                key={provider.name}
                whileHover={{ scale: 1.05 }}
                className="flex justify-center items-center py-2 px-4 border border-primary-100 rounded-lg hover:bg-primary-50 transition-colors"
                aria-label={`Sign in with ${provider.name}`}
              >
                {provider.icon}
              </motion.button>
            ))}
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-text-secondary">
          Don't have an account?{' '}
          <Link 
            to="/register" 
            className="text-primary-500 hover:text-primary-600 font-medium"
          >
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage; 