import React, { useEffect, useRef } from 'react';
import { createSwapWidget } from '@swap-coffee/ui-sdk';
import { useTonConnectUI } from '@tonconnect/ui-react'; // Импортируем хук

interface ModalProps {
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ onClose }) => {
  const manifestUrl = "https://swap.coffee/tonconnect-manifest.json";
  const widgetInitialized = useRef(false);
  const [tonConnectUi] = useTonConnectUI(); // Получаем экземпляр TonConnectUI

  useEffect(() => {
    if (!widgetInitialized.current) {
      createSwapWidget('#swap-widget-component', {
        theme: 'light',
        locale: 'ru',
        tonConnectManifest: {
          url: manifestUrl,
        },
        injectionMode: 'tonConnect',
        tonConnectUi: tonConnectUi, // Передаем существующий экземпляр
      });

      widgetInitialized.current = true;
    }
  }, [tonConnectUi]);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h1>Swap Widget</h1>
        <div id="swap-widget-component"></div>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Modal;
