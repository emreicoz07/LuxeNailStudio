import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Section from '../../../components/common/Section';
import Button from '../../../components/common/Button';
import Image from '../../../components/common/Image';
import { useBookingNavigation } from '../../../hooks/useBookingNavigation';

const HeroSection: React.FC = () => {
  const handleBookNowClick = useBookingNavigation();

  return (
    <Section className="bg-gradient-to-r from-primary-50 to-primary-100 pt-20 pb-32">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-text-primary">
            Your Beauty, <br />
            <span className="text-primary-500">Our Passion</span>
          </h1>
          <p className="text-lg text-text-secondary max-w-lg">
            Experience luxury nail care at its finest. Our expert technicians are dedicated 
            to making your nails look and feel amazing.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button size="large" onClick={handleBookNowClick}>
              Book Now
            </Button>
            <Button size="large" variant="secondary" as={Link} to="/services">
              Our Services
            </Button>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative"
        >
          <div className="rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src="https://images.pexels.com/photos/3997391/pexels-photo-3997391.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt="Professional nail art and manicure"
              className="w-full h-full object-cover"
              style={{ aspectRatio: '4/3' }}
            />
          </div>
          <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-lg shadow-xl">
            <div className="text-4xl font-bold text-primary-500">500+</div>
            <div className="text-text-secondary">Happy Clients</div>
          </div>
        </motion.div>
      </div>
    </Section>
  );
};

export default HeroSection; 