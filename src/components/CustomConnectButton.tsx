import { useTonConnectUI } from '@tonconnect/ui-react'; 
import { useState, useEffect } from 'react';
import { useTonAddress } from '@tonconnect/ui-react'; // Хук для получения адреса
import { IoMdClose } from 'react-icons/io'; // Импортируем иконку для кнопки Close
import './CustomConnectButton.css'; // Вынесите стили в отдельный файл

const CustomConnectButton = () => {
  const [tonConnectUI] = useTonConnectUI();
  const [isConnected, setIsConnected] = useState(tonConnectUI.connected);
  const userFriendlyAddress = useTonAddress(); // Получаем пользовательский адрес
  const [showModal, setShowModal] = useState(false); // Состояние для отображения модального окна

  useEffect(() => {
    const checkConnectionStatus = () => {
      setIsConnected(tonConnectUI.connected); // Обновляем состояние подключения
    };

    checkConnectionStatus();

    const intervalId = setInterval(() => {
      checkConnectionStatus();
    }, 500);

    return () => clearInterval(intervalId);
  }, [tonConnectUI]);

  const handleConnectDisconnect = () => {
    if (isConnected) {
      setShowModal(true); // Открываем модалку при подключенном состоянии
    } else {
      tonConnectUI.openModal(); // Открываем модалку для подключения
    }
  };

  const handleCopyAddress = () => {
    if (userFriendlyAddress) {
      navigator.clipboard.writeText(userFriendlyAddress); // Копируем полный адрес
      alert('Address copied to clipboard');
    }
  };

  const handleDisconnect = () => {
    tonConnectUI.disconnect();
    setShowModal(false); // Закрыть модальное окно при отключении
  };

  // Функция для обрезки адреса, чтобы показывать только первые и последние 4 символа
  const getShortenedAddress = (address: string) => {
    if (!address) return '';
    const firstPart = address.slice(0, 4);
    const lastPart = address.slice(-4);
    return `${firstPart}...${lastPart}`;
  };

  // Функция для закрытия модального окна
  const handleCloseModal = () => {
    setShowModal(false); // Закрыть модальное окно
  };

  return (
    <div>
      {/* Одна кнопка для подключения/отключения и отображения адреса */}
      <button className="wallet-address" onClick={handleConnectDisconnect}>
        {isConnected ? getShortenedAddress(userFriendlyAddress) : 'Connect Wallet'}
      </button>

      {/* Модальное окно для копирования адреса и отключения */}
      {showModal && (
        <div className="modal-overlay">
          <div className={`slide-modal ${showModal ? 'visible' : ''}`}>
            <div className="modal-header">
              <button className="close-btn" onClick={handleCloseModal}>
                <IoMdClose size={24} /> Close
              </button>
            </div>
            <div className="modal-content">
              <button onClick={handleCopyAddress}>Copy address</button>
              <button onClick={handleDisconnect}>Disconnect</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomConnectButton;
