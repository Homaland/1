import { useTonConnectUI } from '@tonconnect/ui-react';
import { useState, useEffect } from 'react';
import { useTonAddress } from '@tonconnect/ui-react'; // Хук для получения адреса
import './CustomConnectButton.css'; // Вынесите стили в отдельный файл

const CustomConnectButton = () => {
  const [tonConnectUI] = useTonConnectUI();
  const [isConnected, setIsConnected] = useState(tonConnectUI.connected);
  const userFriendlyAddress = useTonAddress(); // Получаем пользовательский адрес
  const rawAddress = useTonAddress(false); // Сырый адрес кошелька
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
      tonConnectUI.disconnect(); // Отключаем кошелек
    } else {
      tonConnectUI.openModal(); // Открываем модалку для подключения
    }
  };

  const handleCopyAddress = () => {
    if (rawAddress) {
      navigator.clipboard.writeText(rawAddress);
      alert('Address copied to clipboard');
    }
  };

  const handleDisconnect = () => {
    tonConnectUI.disconnect();
    setShowModal(false); // Закрыть модальное окно при отключении
  };

  // Функция для сокращения адреса (например, UQDN...4A26)
  const formatAddress = (address) => {
    if (!address) return '';
    const firstPart = address.slice(0, 4); // Первые 4 символа
    const lastPart = address.slice(-4); // Последние 4 символа
    return `${firstPart}...${lastPart}`;
  };

  return (
    <div>
      <button onClick={handleConnectDisconnect}>
        {isConnected ? formatAddress(rawAddress) : 'Connect Wallet'}
      </button>

      {isConnected && userFriendlyAddress && (
        <div className="wallet-address" onClick={() => setShowModal(!showModal)}>
          <span>{formatAddress(rawAddress)}</span>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button onClick={handleCopyAddress}>Copy address</button>
            <button onClick={handleDisconnect}>Disconnect</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomConnectButton;
