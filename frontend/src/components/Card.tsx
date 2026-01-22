import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className = '', hover = false }) => {
  return (
    <div
      className={`glass rounded-xl p-6 ${hover ? 'card-hover' : ''} ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
