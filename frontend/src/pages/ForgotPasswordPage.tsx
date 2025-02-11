import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    // TODO: Implement password reset logic
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-200 via-primary-100 to-primary-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] w-full max-w-md mx-4"
      >
        <h1 className="text-3xl font-secondary text-center mb-4">Reset Password</h1>
        
        {!isSubmitted ? (
          <>
            <p className="text-text-secondary text-center mb-8">
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
                />
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                className="btn btn-primary w-full"
                type="submit"
              >
                Send Reset Link
              </motion.button>
            </form>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center space-y-4"
          >
            <div className="text-primary-500 text-5xl mb-4">✓</div>
            <h2 className="text-xl font-medium text-text-primary">Check Your Email</h2>
            <p className="text-text-secondary">
              If an account exists for {email}, you will receive a password reset link shortly.
            </p>
          </motion.div>
        )}

        <div className="mt-8 text-center">
          <Link 
            to="/login"
            className="text-primary-500 hover:text-primary-600 font-medium inline-flex items-center"
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