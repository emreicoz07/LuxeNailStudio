import React from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaFacebook, FaPinterest, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center space-x-2">
              <span className="font-accent text-3xl text-primary-500">Luxe</span>
              <span className="font-secondary text-xl">Nail Studio</span>
            </Link>
            <p className="mt-4 text-text-secondary">
              Experience luxury nail care at its finest. Professional service with a personal touch.
            </p>
          </div>

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
                <span>info@luxenails.com</span>
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

        {/* Copyright */}
        <div className="border-t border-gray-100 mt-12 pt-8 text-center text-text-secondary">
          <p>© {new Date().getFullYear()} Luxe Nail Studio. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 