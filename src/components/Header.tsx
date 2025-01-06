import React, { useState, useEffect } from 'react';
import { TonConnectButton } from "@tonconnect/ui-react";
import { useNavigate } from "react-router-dom";

type HeaderProps = {
  profilePhotoUrl: string | null;
  firstName: string | null;
};

const Header: React.FC<HeaderProps> = ({ profilePhotoUrl, firstName }) => {
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
      <header>
        <div className="profile-header skeleton-header">
          <div className="skeleton-photo" />
          <div className="skeleton-name" />
          <div className="skeleton-button" />
        </div>
        <style>{/* Стили скелетона */}</style>
      </header>
    );
  }

  return (
    <header>
      <div className="profile-header">
        {profilePhotoUrl ? (
          <img src={profilePhotoUrl} alt="Telegram Profile" className="profile-photo" />
        ) : (
          <div className="placeholder-photo" />
        )}

        {firstName ? (
          <div onClick={handleSettingsClick} className="user-name">
            {firstName.length > 12 ? `${firstName.substring(0, 12)}...` : firstName}
            <span className="arrow-icon">
              <i className="material-icons">arrow_forward_ios</i>
            </span>
          </div>
        ) : (
          <div onClick={handleSettingsClick} className="user-name">
            User
            <span className="arrow-icon">
              <i className="material-icons">arrow_forward_ios</i>
            </span>
          </div>
        )}

        {/* Кастомный стиль для TonConnectButton */}
        <TonConnectButton className="ton-connect-button" />
      </div>
      <style>
        {`
          .profile-header {
            display: flex;
            align-items: center;
            gap: 10px;
          }
          .profile-photo {
            width: 40px;
            height: 40px;
            border-radius: 50%;
          }
          .placeholder-photo {
            width: 40px;
            height: 40px;
            background-color: #e0e0e0;
            border-radius: 50%;
          }
          .ton-connect-button {
            background-color: #007BFF; /* Синий фон */
            color: white; /* Белый текст */
            border-radius: 18px; /* Радиус скругления */
            padding: 10px 20px; /* Внутренние отступы */
            border: none;
            cursor: pointer;
            font-size: 16px;
          }
          .ton-connect-button:hover {
            background-color: #0056b3; /* Более тёмный синий при наведении */
          }
        `}
      </style>
    </header>
  );
};

export default Header;
