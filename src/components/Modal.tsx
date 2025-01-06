import React, { useEffect, useRef } from 'react';
import { createSwapWidget } from '@swap-coffee/ui-sdk';
import { useTonConnectUI } from '@tonconnect/ui-react'; // Импортируем хук

interface ModalProps {
  onClose: () => void;
  isVisible: boolean;
}

const Modal: React.FC<ModalProps> = ({ onClose, isVisible }) => {
  const manifestUrl = "https://fefefefe.fun/static/tonconnect-manifest.json";
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
    <div className={`overlay ${isVisible ? "visible" : ""}`}>
      <div className={`slide-swap ${isVisible ? "visible" : ""}`}>
        <div className="swap-content">
          <h1>Swap Widget</h1>
          <div id="swap-widget-component"></div>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
