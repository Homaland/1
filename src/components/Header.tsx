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

  const customButtonStyles = {
    backgroundColor: '#007BFF',
    color: '#FFFFFF',
    borderRadius: '20px',
    padding: '10px 20px',
    fontSize: '16px',
    border: 'none',
    cursor: 'pointer'
  };

  if (loading) {
    return (
      <header>
        <div className="profile-header skeleton-header">
          <div className="skeleton-photo" />
          <div className="skeleton-name" />
          <div className="skeleton-button" />
        </div>
        <style>
          {`
            @keyframes skeleton-loading {
              0% {
                background-color: #e0e0e0;
              }
              50% {
                background-color: #f7f7f7;
              }
              100% {
                background-color: #e0e0e0;
              }
            }

            .skeleton-header {
              display: flex;
              align-items: center;
              gap: 10px;
            }

            .skeleton-photo,
            .skeleton-name,
            .skeleton-button {
              animation: skeleton-loading 1.5s infinite ease-in-out;
            }

            .skeleton-photo {
              width: 40px;
              height: 40px;
              background-color: #e0e0e0;
              border-radius: 50%;
            }
            .skeleton-name {
              width: 120px;
              height: 36px;
              background-color: #e0e0e0;
              border-radius: 4px;
            }
            .skeleton-button {
              width: 100px;
              height: 36px;
              background-color: #e0e0e0;
              border-radius: 18px;
            }
          `}
        </style>
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

        <TonConnectButton 
          className="ton-connect-button" 
          style={customButtonStyles}
        />
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
        `}
      </style>
    </header>
  );
};

export default Header;
