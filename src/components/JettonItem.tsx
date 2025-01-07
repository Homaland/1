import { useState, useEffect } from "react";  
import { JettonBalance } from "@ton-api/client";

interface JettonItemProps {
  jettonBalance: JettonBalance | null; // Учитываем возможность, что данные ещё не загружены
  onSendClick: (jetton: JettonBalance) => void;
}

export const JettonItem = ({ jettonBalance }: JettonItemProps) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Эмулируем загрузку
    const timer = setTimeout(() => setLoading(false), 2000); // Убираем заглушку через 2 секунды
    return () => clearTimeout(timer);
  }, []);

  if (loading || !jettonBalance) {
    return (
      <div className="jetton-item skeleton-item">
        <div className="skeleton-image" />
        <div className="skeleton-details">
          <div className="skeleton-line" style={{ width: "120px", height: "16px" }} />
          <div className="skeleton-line" style={{ width: "80px", height: "14px" }} />
        </div>
        <div className="skeleton-line" style={{ width: "60px", height: "16px" }} />
        <style>
          {`
            .skeleton-item {
              display: flex;
              align-items: center;
              gap: 10px;
            }
            .skeleton-image {
              width: 40px;
              height: 40px;
              background-color: #e0e0e0;
              border-radius: 50%;
            }
            .skeleton-details {
              display: flex;
              flex-direction: column;
              gap: 5px;
              flex-grow: 1;
            }
            .skeleton-line {
              background-color: #e0e0e0;
              border-radius: 4px;
            }
          `}
        </style>
      </div>
    );
  }

  const { jetton, balance } = jettonBalance;

  // Функция для форматирования баланса
  const formatBalance = (balance: bigint, symbol: string) => {
    // Преобразуем balance в number
    const balanceNumber = Number(balance); // Преобразование bigint в number
    if (symbol === "HODR") {
      // Для HODR убираем дробную часть (округление вниз)
      return Math.floor(balanceNumber).toString(); 
    }
    // Для других токенов (например, TON) два знака после запятой
    return balanceNumber.toFixed(2); 
  };

  return (
    <div className="jetton-item">
      <img src={jetton.image} alt={jetton.symbol} className="jetton-image" />
      <div className="jetton-details">
        {/* Отображаем только символ токена */}
        <p>{jetton.symbol}: </p>
      </div>
      {/* Форматируем баланс с помощью formatBalance */}
      <p>{formatBalance(balance, jetton.symbol)}</p>
    </div>
  );
};
