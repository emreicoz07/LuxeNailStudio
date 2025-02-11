import React from 'react';
import HeroSection from './sections/HeroSection';
import ServicesSection from './sections/ServicesSection';
import GalleryPreview from './sections/GalleryPreview';
import TestimonialsSection from './sections/TestimonialsSection';
import BookingCTA from './sections/BookingCTA';

const HomePage: React.FC = () => {
  return (
    <div className="pt-20">
      <HeroSection />
      <ServicesSection />
      <GalleryPreview />
      <TestimonialsSection />
      <BookingCTA />
    </div>
  );
};

export default HomePage; 