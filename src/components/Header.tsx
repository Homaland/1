// src/components/Header.tsx

import React from 'react';
import { TonConnectButton } from "@tonconnect/ui-react";
import { useNavigate } from "react-router-dom"; // Импортируем useNavigate

type HeaderProps = {
  profilePhotoUrl: string | null;
  firstName: string | null;
};

const Header: React.FC<HeaderProps> = ({ profilePhotoUrl, firstName }) => {
  const navigate = useNavigate();  // Инициализация useNavigate для программной навигации

  const handleSettingsClick = () => {
    navigate('/settings');  // Программно переходим на страницу настроек
  };

  return (
    <header>
      <div className="profile-header">
        {profilePhotoUrl && (
          <img src={profilePhotoUrl} alt="Telegram Profile" className="profile-photo" />
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

        <TonConnectButton className="ton-connect-button" />
      </div>
    </header>
  );
};

export default Header;
