import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import CustomConnectButton from './CustomConnectButton';
import './Header.css'; // Вынесите стили в отдельный файл

const Header = ({ profilePhotoUrl, firstName }) => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleSettingsClick = () => {
    navigate('/settings');
  };

  if (loading) {
    return (
      <header className="skeleton-header">
        <div className="skeleton-photo" />
        <div className="skeleton-name" />
        <div className="skeleton-button" />
      </header>
    );
  }

  return (
    <header className="profile-header">
      {profilePhotoUrl ? (
        <img src={profilePhotoUrl} alt="Telegram Profile" className="profile-photo" />
      ) : (
        <div className="placeholder-photo" />
      )}
      <div onClick={handleSettingsClick} className="user-name">
        {firstName ? 
          (firstName.length > 12 ? `${firstName.substring(0, 12)}...` : firstName) 
          : 'User'}
        <span className="arrow-icon">
          <i className="material-icons">arrow_forward_ios</i>
        </span>
      </div>
      <CustomConnectButton />
    </header>
  );
};

export default Header;
