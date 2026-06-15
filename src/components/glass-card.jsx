import React from 'react';

export default function GlassCard({ children, className = '', hoverEffect = true, onClick }) {
  return (
    <div 
      onClick={onClick}
      className={`glass-card ${hoverEffect ? 'glass-card-hover' : ''} ${className} ${onClick ? 'cursor-pointer' : ''}`}
    >
      {children}
    </div>
  );
}
