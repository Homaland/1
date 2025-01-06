import React, { useState, useEffect, useRef } from "react";
import { JettonBalance } from "@ton-api/client";
import { createSwapWidget } from "@swap-coffee/ui-sdk";
import { useTonConnectUI } from "@tonconnect/ui-react"; // Импортируем хук

interface ButtonRowProps {
  jettons: JettonBalance[] | null;
  setSelectedJetton: (jetton: JettonBalance | null) => void;
}

const ButtonRow: React.FC<ButtonRowProps> = ({ jettons, setSelectedJetton }) => {
  const [loading, setLoading] = useState(true); // Состояние загрузки
  const [isSwapModalVisible, setIsSwapModalVisible] = useState(false); // Состояние видимости модального окна
  const [tonConnectUi] = useTonConnectUI(); // Получаем экземпляр TonConnectUI
  const widgetInitialized = useRef(false);

  // Инициализация виджета только один раз
  useEffect(() => {
    if (tonConnectUi && !widgetInitialized.current) {
      createSwapWidget('#swap-widget-component', {
        theme: 'light',
        locale: 'ru',
        tonConnectManifest: {
          url: "https://swap.coffee/tonconnect-manifest.json",
        },
        injectionMode: 'tonConnect',
        tonConnectUi: tonConnectUi, // Передаем существующий экземпляр
      });

      widgetInitialized.current = true;
    }
  }, [tonConnectUi]);

  // Эмулируем задержку загрузки
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000); // Убираем заглушки через 2 секунды
    return () => clearTimeout(timer);
  }, []);

  const toggleSwapModal = () => {
    setIsSwapModalVisible((prev) => !prev); // Переключаем видимость модального окна
  };

  if (loading) {
    // Заглушки
    return (
      <div className="button-row skeleton-button-row">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="skeleton-button-container">
            <div className="skeleton-button" />
          </div>
        ))}
        <style>
          {`
            @keyframes skeleton-loading {
              0% {
                background-color: #e0e0e0;
              }
              50% {
                background-color: #f7f7f7;
              }
              100% {
                background-color: #e0e0e0;
              }
            }

            .skeleton-button-row {
              display: flex;
              gap: 10px;
            }
            .skeleton-button-container {
              width: 70px;
              height: 80px;
            }
            .skeleton-button {
              width: 100%;
              height: 100%;
              background-color: #e0e0e0;
              border-radius: 10px;
              animation: skeleton-loading 1.5s infinite ease-in-out;
            }
          `}
        </style>
      </div>
    );
  }

  return (
    <div>
      <div className="button-row">
        {/* Кнопка "Receive" */}
        <div className="button-container">
          <div
            className="action-button"
            onClick={() => alert("Soon")}
          >
            <img
              src="https://raw.githubusercontent.com/HODRLAND/HODR/refs/heads/main/img/arrow_downward_36dp_000000_FILL0_wght400_GRAD0_opsz40.svg"
              alt="Receive"
              className="icon"
            />
            <p className="button-text">Receive</p>
          </div>
        </div>

        {/* Кнопка "Send" */}
        <div className="button-container">
          <div
            className="action-button"
            onClick={() => setSelectedJetton(jettons ? jettons[0] : null)}
          >
            <img
              src="https://raw.githubusercontent.com/HODRLAND/HODR/refs/heads/main/img/arrow_upward_36dp_000000_FILL0_wght400_GRAD0_opsz40.svg"
              alt="Send"
              className="icon"
            />
            <p className="button-text">Send</p>
          </div>
        </div>

        {/* Кнопка "Swap" */}
        <div className="button-container">
          <div
            className="action-button"
            onClick={toggleSwapModal} // Включаем модальное окно
          >
            <img
              src="https://raw.githubusercontent.com/HODRLAND/HODR/refs/heads/main/img/swap_vert_36dp_000000_FILL0_wght400_GRAD0_opsz40.svg"
              alt="Swap"
              className="icon"
            />
            <p className="button-text">Swap</p>
          </div>
        </div>
      </div>

      {/* Модальное окно с Swap Widget */}
      {isSwapModalVisible && (
        <div className="overlay visible">
          <div className="slide-modal">
            <div className="modal-content">
              <div id="swap-widget-component"></div>
              <button onClick={toggleSwapModal}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Добавляем стили для модального окна */}
      <style>
        {`
          /* Для модального окна */
          .overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.6); /* Полупрозрачный черный */
            display: none;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s ease-in-out;
          }

          .overlay.visible {
            display: block;
            opacity: 1;
          }

          /* Анимация для модального окна */
          @keyframes slideIn {
            from {
              transform: translateY(100%);
            }
            to {
              transform: translateY(0);
            }
          }

          @keyframes slideOut {
            from {
              transform: translateY(0);
            }
            to {
              transform: translateY(100%);
            }
          }

          /* Выезжающее окно */
          .slide-modal {
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            max-height: 80%;
            background: #fff;
            border-radius: 16px 16px 0 0;
            box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.2);
            z-index: 1001;
            padding: 20px;
            box-sizing: border-box;
            overflow-y: auto;
            transform: translateY(100%); /* По умолчанию скрыто за пределами экрана */
            animation: slideOut 0.4s forwards; /* По умолчанию скрывается */
          }

          .slide-modal.visible {
            animation: slideIn 0.4s forwards; /* Анимация появления */
          }

          /* Контент внутри модального окна */
          .modal-content {
            background: #fff;
            display: flex;
            flex-direction: column;
            gap: 20px;
            justify-content: center;
            align-items: center;
            text-align: center;
          }
        `}
      </style>
    </div>
  );
};

export default ButtonRow;
