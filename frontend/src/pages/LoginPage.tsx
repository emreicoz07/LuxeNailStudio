import { motion } from 'framer-motion';
import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FaApple, FaFacebook, FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement login logic
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary-100 to-primary-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h1 className="text-3xl font-secondary text-center mb-8">Welcome Back</h1>
        
        <form onSubmit={handleSubmit}>
          <motion.div
            whileFocus={{ scale: 1.02 }}
            className="space-y-4"
          >
            <div>
              <input
                type="email"
                placeholder="Email"
                autoFocus
                className="input"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="input pr-10"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-primary-500 transition-colors"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </motion.div>

          <div className="text-right mt-2">
            <Link 
              to="/forgot-password" 
              className="text-primary-500 hover:text-primary-600 text-sm"
            >
              Forgot Password?
            </Link>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            className="btn btn-primary w-full mt-6"
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