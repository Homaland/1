import React, { useState, useEffect } from "react";
import { JettonBalance } from "@ton-api/client";

interface ButtonRowProps {
  jettons: JettonBalance[] | null;
  setSelectedJetton: (jetton: JettonBalance | null) => void;
}

const ButtonRow: React.FC<ButtonRowProps> = ({ jettons, setSelectedJetton }) => {
  const [loading, setLoading] = useState(true); // Состояние загрузки

  useEffect(() => {
    // Эмулируем задержку загрузки
    const timer = setTimeout(() => setLoading(false), 2000); // Убираем заглушки через 2 секунды
    return () => clearTimeout(timer);
  }, []);

  const handleSwapClick = () => {
    const swapWidgetUrl = "https://swap.coffee/widget";
    const connectedAddress = jettons?.length ? jettons[0]?.walletAddress : null;

    if (!connectedAddress) {
      alert("Wallet address is not connected.");
      return;
    }

    const widgetParams = new URLSearchParams({
      address: connectedAddress.toString(),
      network: "mainnet", // Замените на "testnet", если требуется
    }).toString();

    const widgetUrl = `${swapWidgetUrl}?${widgetParams}`;

    // Открываем виджет в новой вкладке
    window.open(widgetUrl, "_blank", "noopener,noreferrer");
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
          onClick={handleSwapClick}
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
  );
};

export default ButtonRow;
