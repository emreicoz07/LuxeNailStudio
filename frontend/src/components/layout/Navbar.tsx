import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { HiMenu, HiX } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

const navigation = [
  { name: 'Home', path: '/' },
  { name: 'Services', path: '/services' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  const handleBookNowClick = () => {
    if (!user) {
      // Store the intended destination
      sessionStorage.setItem('redirectAfterLogin', '/appointments');
      
      // Show a toast notification
      toast.info('Please log in to book an appointment', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      
      // Redirect to login page
      navigate('/login');
      return;
    }
    
    // User is authenticated, proceed to appointments
    navigate('/appointments');
  };

  // Updated helper function to get full name with fallback
  const getUserDisplayName = () => {
    if (!user) return '';
    if (!user.firstName && !user.email) return 'User';
    return user.firstName && user.lastName 
      ? `${user.firstName} ${user.lastName}`
      : user.email.split('@')[0]; // Fallback to email username if no name
  };

  // Helper function to get short display name for mobile
  const getShortDisplayName = () => {
    if (!user) return '';
    if (user.firstName) return user.firstName;
    return user.email.split('@')[0];
  };

  return (
    <nav className="fixed w-full bg-white shadow-md z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Updated Logo */}
          <Link to="/" className="flex flex-col items-start">
            <span className="font-accent text-3xl text-primary-500 leading-none">Fifi's</span>
            <div className="flex items-baseline space-x-1">
              <span className="font-secondary text-xl">Nail Studio</span>
              <span className="font-accent text-sm text-primary-400">by Semiha</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'text-primary-500'
                    : 'text-text-secondary hover:text-primary-500'
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 text-text-secondary hover:text-primary-500"
                >
                  <span className="font-medium">{getUserDisplayName()}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
                    >
                      <div className="py-1">
                        {user.firstName && user.lastName && (
                          <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-100">
                            Signed in as<br />
                            <span className="font-medium text-gray-900">{user.email}</span>
                          </div>
                        )}
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Profile
                        </Link>
                        <Link
                          to="/appointments"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowUserMenu(false)}
                        >
                          My Appointments
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Sign out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="font-medium text-text-secondary hover:text-primary-500 transition-colors"
                >
                  Login
                </Link>
                <button
                  onClick={handleBookNowClick}
                  className="btn btn-primary"
                >
                  Book Now
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <HiX className="h-6 w-6 text-text-primary" />
            ) : (
              <HiMenu className="h-6 w-6 text-text-primary" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {/* Show user info when logged in */}
            {user && (
              <div className="px-3 py-2 border-b border-gray-200 mb-2">
                <div className="font-medium text-gray-900">{getShortDisplayName()}</div>
                <div className="text-sm text-gray-500">{user.email}</div>
              </div>
            )}

            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === item.path
                    ? 'text-primary-500 bg-primary-50'
                    : 'text-text-secondary hover:text-primary-500 hover:bg-primary-50'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            {user ? (
              <>
                <Link
                  to="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium text-text-secondary hover:text-primary-500 hover:bg-primary-50"
                  onClick={() => setIsOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  to="/appointments"
                  className="block px-3 py-2 rounded-md text-base font-medium text-text-secondary hover:text-primary-500 hover:bg-primary-50"
                  onClick={() => setIsOpen(false)}
                >
                  My Appointments
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-text-secondary hover:text-primary-500 hover:bg-primary-50"
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="block px-3 py-2 rounded-md text-base font-medium text-text-secondary hover:text-primary-500 hover:bg-primary-50"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
            )}

            <button
              onClick={() => {
                setIsOpen(false);
                handleBookNowClick();
              }}
              className="block w-full px-3 py-2 text-base font-medium text-white bg-primary-500 rounded-md hover:bg-primary-600"
            >
              Book Now
            </button>
          </div>
        </motion.div>
      </div>
    </nav>
  );
};

export default Navbar; 