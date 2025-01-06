import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { SendJettonModal } from './SendJettonModal'; // Импортируем модальное окно
import './Header.css';

interface HeaderProps {
  profilePhotoUrl: string | null;
  firstName: string | null;
  jetton: JettonBalance;
  senderAddress: Address;
  jettons: JettonBalance[];
}

const Header = ({ profilePhotoUrl, firstName, jetton, senderAddress, jettons }: HeaderProps) => {
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false); // Состояние для модального окна
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleSettingsClick = () => {
    navigate('/settings');
  };

  const handleGiftClick = () => {
    setIsModalVisible(true); // Открыть модальное окно
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
      <i className="material-icons gift-icon" onClick={handleGiftClick}>card_giftcard</i>

      {/* Модальное окно для отправки жетонов */}
      <SendJettonModal
        jetton={jetton}
        senderAddress={senderAddress}
        onClose={() => setIsModalVisible(false)}
        jettons={jettons}
        isVisible={isModalVisible}
      />
    </header>
  );
};

export default Header;
