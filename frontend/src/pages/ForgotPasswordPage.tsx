import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/forgot-password`, {
        email,
      });
      
      setIsSubmitted(true);
      toast.success('Reset instructions sent to your email');
    } catch (error) {
      console.error('Failed to send reset email:', error);
      toast.error('Failed to send reset email. Please try again.');
      setIsSubmitted(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-primary-200 via-primary-100 to-primary-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] w-full max-w-md mx-4"
      >
        <h1 className="mb-4 text-3xl text-center font-secondary">Reset Password</h1>
        
        {!isSubmitted ? (
          <>
            <p className="mb-8 text-center text-text-secondary">
              Enter your email, and we'll send you a password reset link.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div whileFocus={{ scale: 1.02 }}>
                <input
                  type="email"
                  placeholder="Email Address"
                  className="input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                  disabled={isLoading}
                />
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                className="w-full btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex justify-center items-center">
                    <svg className="mr-3 -ml-1 w-5 h-5 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  'Send Reset Link'
                )}
              </motion.button>
            </form>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4 text-center"
          >
            <div className="mb-4 text-5xl text-primary-500">✓</div>
            <h2 className="text-xl font-medium text-text-primary">Check Your Email</h2>
            <p className="text-text-secondary">
              If an account exists for {email}, you will receive a password reset link shortly.
            </p>
          </motion.div>
        )}

        <div className="mt-8 text-center">
          <Link 
            to="/login"
            className="inline-flex items-center font-medium text-primary-500 hover:text-primary-600"
          >
            <motion.span
              whileHover={{ x: -4 }}
              className="mr-2"
            >
              ←
            </motion.span>
            Back to Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage; 