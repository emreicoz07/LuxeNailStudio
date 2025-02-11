import React from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaInstagram, FaFacebook, FaPinterest } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="container py-12">
        {/* Logo Section with Decorative Elements */}
        <div className="flex flex-col items-center mb-12">
          <div className="relative">
            <div className="absolute -left-8 -right-8 top-1/2 transform -translate-y-1/2">
              <div className="border-t border-primary-200 w-full"></div>
            </div>
            <Link to="/" className="relative bg-white px-4 flex flex-col items-center">
              <span className="font-accent text-4xl text-primary-500 leading-none mb-1">Fifi's</span>
              <div className="flex flex-col items-center">
                <span className="font-secondary text-2xl text-text-primary">Nail Studio</span>
                <span className="font-accent text-lg text-primary-400 mt-1">by Semiha</span>
              </div>
            </Link>
          </div>
          <p className="mt-6 text-text-secondary text-center max-w-md">
            Where elegance meets expertise. Experience the art of nail care in a luxurious setting.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Quick Links */}
          <div>
            <h4 className="font-secondary text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {['Home', 'About', 'Gallery', 'Contact'].map((link) => (
                <li key={link}>
                  <Link
                    to={`/${link.toLowerCase()}`}
                    className="text-text-secondary hover:text-primary-500 transition-colors"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-secondary text-lg mb-4">Our Services</h4>
            <ul className="space-y-2">
              {['Manicure', 'Pedicure', 'Nail Art', 'Gel Polish', 'Nail Extensions'].map((service) => (
                <li key={service}>
                  <Link
                    to="/services"
                    className="text-text-secondary hover:text-primary-500 transition-colors"
                  >
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h4 className="font-secondary text-lg mb-4">Opening Hours</h4>
            <ul className="space-y-2 text-text-secondary">
              <li className="flex justify-between">
                <span>Monday - Friday</span>
                <span>9:00 - 19:00</span>
              </li>
              <li className="flex justify-between">
                <span>Saturday</span>
                <span>9:00 - 17:00</span>
              </li>
              <li className="flex justify-between">
                <span>Sunday</span>
                <span>Closed</span>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-secondary text-lg mb-4">Contact Us</h4>
            <ul className="space-y-2 text-text-secondary">
              <li className="flex items-center space-x-2">
                <FaMapMarkerAlt className="text-primary-500" />
                <span>123 Beauty Street, New York, NY 10001</span>
              </li>
              <li className="flex items-center space-x-2">
                <FaPhone className="text-primary-500" />
                <span>(555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-2">
                <FaEnvelope className="text-primary-500" />
                <span>info@fifisnails.com</span>
              </li>
            </ul>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-text-secondary hover:text-primary-500 transition-colors">
                <FaInstagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-text-secondary hover:text-primary-500 transition-colors">
                <FaFacebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-text-secondary hover:text-primary-500 transition-colors">
                <FaPinterest className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="mt-12 pt-8 border-t border-gray-100 space-y-4">
          <p className="text-center text-text-secondary text-sm">
            © {new Date().getFullYear()} Fifi's Nail Studio by Semiha. All rights reserved.
          </p>
          
          <p className="text-gray-500 text-sm text-center">
            Developed with <span className="text-red-500 animate-pulse">❤</span> by{' '}
            <span className="inline-flex items-center gap-2 justify-center">
              <a 
                href="https://www.linkedin.com/in/emre-içöz"
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary-500 hover:text-primary-600 transition-colors duration-300 font-medium"
              >
                Emre ICOZ
              </a>
              <a 
                href="https://github.com/emreicoz07"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-600 transition-colors duration-300"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" clipRule="evenodd" />
                </svg>
              </a>
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 