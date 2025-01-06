import { useState } from 'react';
import { useTonConnectUI } from '@tonconnect/ui-react';
import './CustomConnectButton.css'; // Вынесите стили в отдельный файл

const CustomConnectButton = () => {
  const [tonConnectUI] = useTonConnectUI(); // Получаем UI от TonConnect
  const [isConnected, setIsConnected] = useState(false); // Состояние подключения

  // Функция для подключения и отключения
  const handleConnectDisconnect = () => {
    if (isConnected) {
      tonConnectUI.disconnect(); // Отключаем кошелек
      setIsConnected(false); // Обновляем состояние
    } else {
      tonConnectUI.openModal(); // Открываем модалку для подключения
    }
  };

  return (
    <button onClick={handleConnectDisconnect}>
      {isConnected ? 'Disconnect Wallet' : 'Connect Wallet'}
    </button>
  );
};

export default CustomConnectButton;
