import React from 'react';
import { motion } from 'framer-motion';
import Section from '../../../components/common/Section';
import Button from '../../../components/common/Button';
import { useBookingNavigation } from '../../../hooks/useBookingNavigation';

const BookingCTA: React.FC = () => {
  const handleBookNowClick = useBookingNavigation();

  return (
    <Section className="bg-primary-50 py-20">
      <div className="text-center max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <h2 className="text-4xl font-bold text-text-primary">
            Ready for Beautiful Nails?
          </h2>
          <p className="text-lg text-text-secondary">
            Book your appointment today and let our expert technicians take care of you.
            Experience luxury nail care at its finest.
          </p>
          <div className="pt-4">
            <Button size="large" onClick={handleBookNowClick}>
              Book Your Appointment
            </Button>
          </div>
        </motion.div>
      </div>
    </Section>
  );
};

export default BookingCTA; 