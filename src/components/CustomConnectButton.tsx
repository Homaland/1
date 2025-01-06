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

  return (
    <div>
      {/* Кнопка подключения / отключения */}
      <button onClick={handleConnectDisconnect}>
        {isConnected ? 'Disconnect Wallet' : 'Connect Wallet'}
      </button>

      {/* Модальное окно с адресом кошелька, если подключено */}
      {isConnected && userFriendlyAddress && (
        <div>
          <div className="wallet-address" onClick={() => setShowModal(true)}>
            <span>{userFriendlyAddress}</span>
          </div>

          {showModal && (
            <div className="modal-overlay">
              <div className={`slide-modal ${showModal ? 'visible' : ''}`}>
                <div className="modal-content">
                  <p>Wallet Address:</p>
                  <p>{userFriendlyAddress}</p>
                  <button onClick={handleCopyAddress}>Copy Address</button>
                  <button onClick={handleDisconnect}>Disconnect</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomConnectButton;
