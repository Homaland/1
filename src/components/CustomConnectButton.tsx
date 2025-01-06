import { useTonConnectUI } from '@tonconnect/ui-react';
import { useState, useEffect } from 'react';
import './CustomConnectButton.css'; // Вынесите стили в отдельный файл

const CustomConnectButton = () => {
  const [tonConnectUI] = useTonConnectUI(); // Получаем UI от TonConnect
  const [isConnected, setIsConnected] = useState(tonConnectUI.connected); // Состояние подключения, начинаем с текущего состояния

  // Эффект для отслеживания состояния подключения
  useEffect(() => {
    // Функция для обновления состояния
    const updateConnectionStatus = () => {
      setIsConnected(tonConnectUI.connected); // Обновляем состояние подключения
    };

    // Изначально проверяем подключение
    updateConnectionStatus();

       // Возвращаем очистку эффекта, если нужно, например, для отписки от событий
    return () => {
      // Очистка, если потребуется
    };
  }, [tonConnectUI]); // Следим за изменениями состояния TonConnectUI

  // Функция для подключения и отключения
  const handleConnectDisconnect = () => {
    if (isConnected) {
      tonConnectUI.disconnect(); // Отключаем кошелек
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
