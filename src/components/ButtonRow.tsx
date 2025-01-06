import React, { useState, useEffect, useRef } from "react";
import { JettonBalance } from "@ton-api/client";
import { createSwapWidget } from '@swap-coffee/ui-sdk';
import { useTonConnectUI } from '@tonconnect/ui-react';
import './ButtonRow.css';

interface ButtonRowProps {
  jettons: JettonBalance[] | null;
  setSelectedJetton: (jetton: JettonBalance | null) => void;
}

const ButtonRow: React.FC<ButtonRowProps> = ({ jettons, setSelectedJetton }) => {
  const [loading, setLoading] = useState(true);
  const widgetInitialized = useRef(false); // Чтобы избежать повторной инициализации виджета
  const [tonConnectUi] = useTonConnectUI(); // Получаем экземпляр TonConnectUI

  useEffect(() => {
    // Эмулируем задержку загрузки
    const timer = setTimeout(() => setLoading(false), 2000); // Убираем заглушки через 2 секунды
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (tonConnectUi && !widgetInitialized.current) {
      createSwapWidget('#swap-widget-component', {
        theme: 'light',
        locale: 'ru',
        tonConnectManifest: {
          url: "https://swap.coffee/tonconnect-manifest.json",
        },
        injectionMode: 'tonConnect',
        tonConnectUi: tonConnectUi, // Передаем TonConnectUI экземпляр
      });

      widgetInitialized.current = true;
    }
  }, [tonConnectUi]); // Ререндерим, если TonConnectUI изменился

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
        <div className="action-button" onClick={() => alert("Soon")}>
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
          onClick={() => {
            // Показать или скрыть виджет при клике на "Swap"
            const widgetElement = document.getElementById("swap-widget-component");
            if (widgetElement) {
              widgetElement.style.display = widgetElement.style.display === 'none' ? 'block' : 'none';
            }
          }}
        >
          <img
            src="https://raw.githubusercontent.com/HODRLAND/HODR/refs/heads/main/img/swap_vert_36dp_000000_FILL0_wght400_GRAD0_opsz40.svg"
            alt="Swap"
            className="icon"
          />
          <p className="button-text">Swap</p>
        </div>
      </div>

      {/* Контейнер для виджета Swap */}
      <div id="swap-widget-component" style={{ display: 'none' }}></div>
    </div>
  );
};

export default ButtonRow;
