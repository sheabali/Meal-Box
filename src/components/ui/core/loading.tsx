import React from 'react';
import '../../../app/loader.css';

const Loading = () => {
  return (
    <div className="h-screen w-full flex justify-center items-center">
      <div className="spinner"></div>
    </div>
  );
};

export default Loading;
