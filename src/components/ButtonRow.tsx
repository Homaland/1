import React, { useState, useEffect, useRef } from "react";
import { JettonBalance } from "@ton-api/client";
import { createSwapWidget } from '@swap-coffee/ui-sdk';  // Импортируем виджет
import { useTonConnectUI } from '@tonconnect/ui-react'; // Импортируем хук для TonConnect
import './ButtonRow.css';

interface ButtonRowProps {
  jettons: JettonBalance[] | null;
  setSelectedJetton: (jetton: JettonBalance | null) => void;
}

const ButtonRow: React.FC<ButtonRowProps> = ({ jettons, setSelectedJetton }) => {
  const [loading, setLoading] = useState(true); // Состояние загрузки
  const widgetInitialized = useRef(false); // Для того чтобы инициализировать виджет только один раз
  const [tonConnectUi] = useTonConnectUI(); // Получаем экземпляр TonConnectUI

  // Эмулируем задержку загрузки
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000); // Убираем заглушки через 2 секунды
    return () => clearTimeout(timer);
  }, []);

  // Инициализация виджета Swap после первого рендера
  useEffect(() => {
    if (!widgetInitialized.current && tonConnectUi) {
      const manifestUrl = "https://swap.coffee/tonconnect-manifest.json";
      createSwapWidget('#swap-widget-component', {
        theme: 'light',
        locale: 'ru',
        tonConnectManifest: {
          url: manifestUrl,
        },
        injectionMode: 'tonConnect',
        tonConnectUi: tonConnectUi, // Передаем экземпляр TonConnectUI
      });
      widgetInitialized.current = true;
    }
  }, [tonConnectUi]); // Срабатывает, когда загружен TonConnectUI

  if (loading) {
    // Заглушки
    return (
      <div className="button-row skeleton-button-row">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="skeleton-button-container">
            <div className="skeleton-button" />
          </div>
        ))}
      </div>
    );
  }

  return (
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
          onClick={() => alert("Soon")}
        >
          <img
            src="https://raw.githubusercontent.com/HODRLAND/HODR/refs/heads/main/img/swap_vert_36dp_000000_FILL0_wght400_GRAD0_opsz40.svg"
            alt="Swap"
            className="icon"
          />
          <p className="button-text">Swap</p>
          <div id="swap-widget-component"></div> {/* Место для виджета */}
        </div>
      </div>
    </div>
  );
};

export default ButtonRow;
