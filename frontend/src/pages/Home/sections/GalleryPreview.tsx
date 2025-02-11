import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Section from '../../../components/common/Section';
import Button from '../../../components/common/Button';
import Image from '../../../components/common/Image';

const galleryImages = [
  {
    src: 'https://images.pexels.com/photos/3997391/pexels-photo-3997391.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&dpr=1',
    alt: 'Elegant pink and gold nail design'
  },
  {
    src: 'https://images.pexels.com/photos/4210784/pexels-photo-4210784.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&dpr=1',
    alt: 'French manicure with glitter accents'
  },
  {
    src: 'https://images.pexels.com/photos/3997383/pexels-photo-3997383.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&dpr=1',
    alt: 'Artistic floral nail art design'
  },
  {
    src: 'https://images.pexels.com/photos/4046316/pexels-photo-4046316.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&dpr=1',
    alt: 'Modern geometric nail pattern'
  },
];

const GalleryPreview: React.FC = () => {
  return (
    <Section className="bg-background-secondary py-20">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-text-primary mb-4">Our Gallery</h2>
        <p className="text-text-secondary max-w-2xl mx-auto">
          Take a look at some of our recent work and get inspired for your next visit
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {galleryImages.map((image, index) => (
          <motion.div
            key={image.src}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="relative aspect-square overflow-hidden rounded-lg group"
          >
            <Image
              src={image.src}
              alt={image.alt}
              className="w-full h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-white text-sm">{image.alt}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="text-center">
        <Button as={Link} to="/gallery" variant="secondary">
          View Full Gallery
        </Button>
      </div>
    </Section>
  );
};

export default GalleryPreview; 