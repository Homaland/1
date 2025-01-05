import React, { useState, useEffect, useRef } from "react";
import { JettonBalance } from "@ton-api/client";
import { createSwapWidget } from "@swap-coffee/ui-sdk";
import { TonConnectUI } from "@tonconnect/ui";
import { swapWidgetConfig } from "../config"; // Конфигурация виджета

interface ButtonRowProps {
  jettons: JettonBalance[] | null;
  setSelectedJetton: (jetton: JettonBalance | null) => void;
}

const ButtonRow: React.FC<ButtonRowProps> = ({ jettons, setSelectedJetton }) => {
  const [loading, setLoading] = useState(true); // Состояние загрузки
  const [showSwapWidget, setShowSwapWidget] = useState(false); // Флаг для отображения виджета
  const widgetInitialized = useRef(false);

  useEffect(() => {
    // Эмулируем задержку загрузки
    const timer = setTimeout(() => setLoading(false), 2000); // Убираем заглушки через 2 секунды
    return () => clearTimeout(timer);
  }, []);

  const handleSwapClick = () => {
    setShowSwapWidget(true); // Показываем виджет при нажатии на "Swap"
  };

  useEffect(() => {
    if (showSwapWidget && !widgetInitialized.current) {
      // Создаем виджет только при необходимости
      const tonConnectUiInstance = new TonConnectUI({
        manifestUrl: "https://homaland-memefight-f32c.twc1.net/static/tonconnect-manifest.json", // URL манифеста для TonConnect
        uiPreferences: {
          theme: "dark", // Темная тема
        },
      });

      createSwapWidget('#swap-widget-component', {
        ...swapWidgetConfig, // Применяем конфигурацию виджета
        theme: 'light', // Осветленная тема
        locale: 'ru', // Русский язык
        tonConnectUi: tonConnectUiInstance,
      });
      widgetInitialized.current = true;
    }
  }, [showSwapWidget]);

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
              0% { background-color: #e0e0e0; }
              50% { background-color: #f7f7f7; }
              100% { background-color: #e0e0e0; }
            }
            .skeleton-button-row { display: flex; gap: 10px; }
            .skeleton-button-container { width: 70px; height: 80px; }
            .skeleton-button { width: 100%; height: 100%; background-color: #e0e0e0; border-radius: 10px; animation: skeleton-loading 1.5s infinite ease-in-out; }
          `}
        </style>
      </div>
    );
  }

  return (
    <div className="button-row">
      {/* Кнопка "Receive" */}
      <div className="button-container">
        <div className="action-button" onClick={() => alert("Soon")}> {/* Placeholder */}
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
        <div className="action-button" onClick={() => setSelectedJetton(jettons ? jettons[0] : null)}>
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
        <div className="action-button" onClick={handleSwapClick}>
          <img
            src="https://raw.githubusercontent.com/HODRLAND/HODR/refs/heads/main/img/swap_vert_36dp_000000_FILL0_wght400_GRAD0_opsz40.svg"
            alt="Swap"
            className="icon"
          />
          <p className="button-text">Swap</p>
        </div>
      </div>

      {/* Виджет Swap */}
      {showSwapWidget && <div id="swap-widget-component" className="swap-widget-container"></div>}
    </div>
  );
};

export default ButtonRow;
