import React from 'react';

interface NMContainerProps {
  children: React.ReactNode;
  className?: string;
}

const NMContainer = ({ children, className }: NMContainerProps) => {
  return (
    <div className={`container mx-auto px-5 ${className}`}>{children}</div>
  );
};

export default NMContainer;
