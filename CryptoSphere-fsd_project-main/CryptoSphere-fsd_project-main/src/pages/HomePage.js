import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div>
      <h1>CryptoSphere</h1>
      <Link to="/register">Register</Link>
      <Link to="/trade">Trade</Link>
    </div>
  );
};

export default HomePage;
