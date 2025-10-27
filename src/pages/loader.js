import React from 'react';
import loaderGif from '../assets/images/loader.gif';
import './loader.scss';

function Loader() {
  return (
    <div className="loader-container">
    <div className="loader-content">
      <img src={loaderGif} alt="Loading..." />
      <div className="loader-text">Loading...</div>
    </div>
  </div>
  );
}

export default Loader;
