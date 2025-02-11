import React from 'react';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  container?: boolean;
}

const Section: React.FC<SectionProps> = ({
  children,
  className = '',
  container = true,
}) => {
  return (
    <section className={`section ${className}`}>
      {container ? (
        <div className="container mx-auto">{children}</div>
      ) : (
        children
      )}
    </section>
  );
};

export default Section; 