import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HiMenu, HiX } from 'react-icons/hi';
import { motion } from 'framer-motion';

const navigation = [
  { name: 'Home', path: '/' },
  { name: 'Services', path: '/services' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="fixed w-full bg-white shadow-md z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-accent text-3xl text-primary-500">Luxe</span>
            <span className="font-secondary text-xl">Nail Studio</span>
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
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="font-medium text-text-secondary hover:text-primary-500 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/appointments"
                className="btn btn-primary"
              >
                Book Now
              </Link>
            </div>
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
            <Link
              to="/login"
              className="block px-3 py-2 rounded-md text-base font-medium text-text-secondary hover:text-primary-500 hover:bg-primary-50"
              onClick={() => setIsOpen(false)}
            >
              Login
            </Link>
            <Link
              to="/appointments"
              className="block px-3 py-2 text-base font-medium text-white bg-primary-500 rounded-md hover:bg-primary-600"
              onClick={() => setIsOpen(false)}
            >
              Book Now
            </Link>
          </div>
        </motion.div>
      </div>
    </nav>
  );
};

export default Navbar; 