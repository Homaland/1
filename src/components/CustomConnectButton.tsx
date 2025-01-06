import { useTonConnectModal } from '@tonconnect/ui-react';

const CustomConnectButton = () => {
  const { open } = useTonConnectModal();
<style>
          {`
             .custom-connect-button {
              width: 100px;
              height: 36px;
              background-color:rgb(185, 82, 82);
              border-radius: 18px;
            }
          `}
        </style>
  return (
    <button onClick={open} className="custom-connect-button">
      Подключить кошелек
    </button>
  );
};

export default CustomConnectButton;
