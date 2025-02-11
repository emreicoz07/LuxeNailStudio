import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Placeholder from './Placeholder';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: string;
}

const Image: React.FC<ImageProps> = ({ src, alt, className = '', ...props }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {(isLoading || error) && (
        <Placeholder className="absolute inset-0" />
      )}
      <motion.img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover ${error ? 'hidden' : ''}`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setError(true);
          setIsLoading(false);
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.3 }}
        {...props}
      />
    </div>
  );
};

export default Image; 