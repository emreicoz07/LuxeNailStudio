import React from 'react';
import { motion } from 'framer-motion';
import Section from '../../../components/common/Section';
import Card from '../../../components/common/Card';

const services = [
  {
    title: 'Manicure',
    description: 'Classic and luxury manicure services for beautiful hands.',
    icon: '💅',
    price: 'From $30',
  },
  {
    title: 'Pedicure',
    description: 'Relaxing pedicure treatments for happy feet.',
    icon: '👣',
    price: 'From $40',
  },
  {
    title: 'Nail Art',
    description: 'Custom nail art designs to express your style.',
    icon: '🎨',
    price: 'From $15',
  },
  {
    title: 'Gel Polish',
    description: 'Long-lasting gel polish for stunning nails.',
    icon: '✨',
    price: 'From $35',
  },
];

const ServicesSection: React.FC = () => {
  return (
    <Section className="bg-white">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-text-primary mb-4">
          Our Services
        </h2>
        <p className="text-text-secondary max-w-2xl mx-auto">
          Discover our range of professional nail care services designed to make you look and feel beautiful.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {services.map((service, index) => (
          <motion.div
            key={service.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="p-6 text-center h-full">
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="text-xl font-bold text-text-primary mb-2">
                {service.title}
              </h3>
              <p className="text-text-secondary mb-4">
                {service.description}
              </p>
              <div className="text-primary-500 font-semibold">
                {service.price}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </Section>
  );
};

export default ServicesSection; 