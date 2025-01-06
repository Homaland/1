import { useTonConnectUI } from '@tonconnect/ui-react';
import './CustomConnectButton.css'; // Вынесите стили в отдельный файл

const CustomConnectButton = () => {
  const [tonConnectUI, setOptions] = useTonConnectUI();

  return (
        <button onClick={() => tonConnectUI.openModal()}>
     Connect Wallet
   </button>
  );
};

export default CustomConnectButton;
