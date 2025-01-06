import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import './Header.css';

interface HeaderProps {
  profilePhotoUrl: string | null;
  firstName: string | null;
}

const Header = ({ profilePhotoUrl, firstName }: HeaderProps) => {
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false); // Для модального окна
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleSettingsClick = () => {
    navigate('/settings');
  };

  const handleGiftClick = () => {
    setIsModalVisible(true); // Показываем модальное окно
  };

  const handleCloseModal = () => {
    setIsModalVisible(false); // Скрываем модальное окно
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
      {/* Иконка подарка */}
      <div onClick={handleGiftClick} className="gift-icon">
        🎁
      </div>

      {/* Модальное окно */}
      {isModalVisible && (
        <div className="overlay visible">
          <div className="slide-modal visible">
            <div className="modal-content">
              <h2>Send Gift</h2>
              <label>
                Recipient Address:
                <input type="text" placeholder="Enter recipient address" />
              </label>
              <label>
                Amount:
                <input type="number" placeholder="Enter amount" />
              </label>
              <button onClick={handleCloseModal}>Send</button>
              <button onClick={handleCloseModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
