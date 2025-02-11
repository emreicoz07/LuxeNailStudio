import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    subscribe: false,
    agreeToTerms: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement registration logic
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary-100 to-primary-50 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mx-4"
      >
        <h1 className="text-3xl font-secondary text-center mb-8">Create Account</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Input */}
          <motion.div whileFocus={{ scale: 1.02 }}>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              autoFocus
              className="input"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </motion.div>

          {/* Email Input */}
          <motion.div whileFocus={{ scale: 1.02 }}>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              className="input"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </motion.div>

          {/* Phone Input */}
          <motion.div whileFocus={{ scale: 1.02 }}>
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              className="input"
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
          </motion.div>

          {/* Password Input */}
          <motion.div whileFocus={{ scale: 1.02 }} className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              className="input pr-10"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-primary-500 transition-colors"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </motion.div>

          {/* Confirm Password Input */}
          <motion.div whileFocus={{ scale: 1.02 }} className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              className="input pr-10"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-primary-500 transition-colors"
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </motion.div>

          {/* Subscribe Checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="subscribe"
              name="subscribe"
              className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
              checked={formData.subscribe}
              onChange={handleInputChange}
            />
            <label htmlFor="subscribe" className="ml-2 text-sm text-text-secondary">
              Subscribe to nail care tips and promotions
            </label>
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="agreeToTerms"
              name="agreeToTerms"
              className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
              checked={formData.agreeToTerms}
              onChange={handleInputChange}
              required
            />
            <label htmlFor="agreeToTerms" className="ml-2 text-sm text-text-secondary">
              I agree to the{' '}
              <Link to="/terms" className="text-primary-500 hover:text-primary-600">
                Terms & Conditions
              </Link>
            </label>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            className="btn btn-primary w-full"
            type="submit"
          >
            Create Account
          </motion.button>
        </form>

        <p className="mt-8 text-center text-sm text-text-secondary">
          Already have an account?{' '}
          <Link 
            to="/login" 
            className="text-primary-500 hover:text-primary-600 font-medium"
          >
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default RegisterPage; 