import React from 'react';
import '../styles/components/LoadingSpinner.css';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="loading-container" role="status" aria-label="Carregando">
      <div className="spinner" aria-hidden="true"></div>
    </div>
  );
};

export default LoadingSpinner;
