import React from 'react';

const LoadingState: React.FC = () => {
  return (
    <div className="gd-loading-state">
      <div className="gd-spinner"></div>
      <h3>Sending your enquiry...</h3>
      <p>Please wait while we set things up for you.</p>
    </div>
  );
};

export default LoadingState;
