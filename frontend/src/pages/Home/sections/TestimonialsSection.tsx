import React from 'react';
import { motion } from 'framer-motion';
import Section from '../../../components/common/Section';
import Card from '../../../components/common/Card';
import Image from '../../../components/common/Image';

const testimonials = [
  {
    name: 'Sarah Johnson',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    text: "The best nail salon I've ever been to! The staff is professional and the results are always amazing.",
    rating: 5,
  },
  {
    name: 'Emily Davis',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
    text: "Love the attention to detail and the relaxing atmosphere. My go-to place for nail care!",
    rating: 5,
  },
  {
    name: 'Michelle Lee',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop',
    text: "Exceptional service and stunning nail art. Highly recommend their gel manicures!",
    rating: 5,
  },
];

const TestimonialsSection: React.FC = () => {
  return (
    <Section className="bg-white py-20">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-text-primary mb-4">
          What Our Clients Say
        </h2>
        <p className="text-text-secondary max-w-2xl mx-auto">
          Don't just take our word for it - hear what our happy clients have to say
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="p-6 h-full">
              <div className="flex items-center mb-4">
                <Image
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h3 className="font-bold text-text-primary">{testimonial.name}</h3>
                  <div className="flex text-yellow-400">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i}>⭐</span>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-text-secondary">{testimonial.text}</p>
            </Card>
          </motion.div>
        ))}
      </div>
    </Section>
  );
};

export default TestimonialsSection; 