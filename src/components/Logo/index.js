import React from 'react';
import logo from './logo.svg';
import './index.css';

const Logo = () => (
  <div className="logo">
    <img src={logo} alt="SIMPLI EXPENSE" className="logo-icon" />
    <span className="logo-text">SIMPLI EXPENSE</span>
  </div>
);

export default Logo;
