import { useTonConnectModal } from '@tonconnect/ui-react';
import './CustomConnectButton.css'; // Вынесите стили в отдельный файл

const CustomConnectButton = () => {
  const { open } = useTonConnectModal();

  return (
    <button onClick={open} className="custom-connect-button">
      Подключить кошелек
    </button>
  );
};

export default CustomConnectButton;
