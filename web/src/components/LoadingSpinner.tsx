import React from 'react';
import '../styles/components/LoadingSpinner.css';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
    </div>
  );
};

export default LoadingSpinner;
