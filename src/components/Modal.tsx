import React, { useEffect, useRef } from 'react';
import { createSwapWidget } from '@swap-coffee/ui-sdk';
import { useTonConnectUI } from '@tonconnect/ui-react'; // Импортируем хук
import { IoMdClose } from 'react-icons/io'; // Импортируем иконку для кнопки Close

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
          {/* Иконка крестика и текст "Close" */}
          <div className="modal-header">
            <button className="close-btn" onClick={onClose}>
              <IoMdClose size={24} />
              Close
            </button>
          </div>
          <h2>Swap</h2>
          <div id="swap-widget-component"></div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
