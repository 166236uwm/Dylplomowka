import React from 'react';
import { useNavigate } from 'react-router-dom';
import './header.css';

const Header = () => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate('/home');
  };

  return (
    <header className="header">
      <button className="home-button" onClick={handleHomeClick}>Home</button>
    </header>
  );
};

export default Header;