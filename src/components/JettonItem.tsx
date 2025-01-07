import { useState, useEffect } from "react"; 
import { JettonBalance } from "@ton-api/client";
import { toDecimals } from "../utils/decimals";

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
          .jetton-info {
            display: flex;
            align-items: center; /* Располагаем картинку и символ на одной строке */
            gap: 10px; /* Промежуток между изображением и символом */
          }
          .jetton-image {
            width: 30px;
            height: 30px;
            border-radius: 50%;
          }
          .jetton-symbol {
            font-weight: bold;
          }

          .jetton-balance {
            font-weight: normal;
          }
       `}  </style>
      </div>
    );
  }

  const { jetton, balance } = jettonBalance;

  // Функция для отображения баланса без знаков после запятой
  const formatBalanceWithoutDecimals = (balance: bigint, decimals: number) => {
    // Используем toDecimals, чтобы преобразовать баланс в строку
    let formattedBalance = toDecimals(balance, decimals);
    
    // Преобразуем строку в число и убираем дробную часть
    const balanceNumber = Number(formattedBalance);
    return Math.floor(balanceNumber).toString(); // Округляем до целого
  };

  return (
    <div className="jetton-item">
      <img src={jetton.image} alt={jetton.symbol} className="jetton-image" />
      <div className="jetton-details">
        <p>{jetton.symbol}: </p>
      </div>
      {/* Форматируем баланс, убирая дробную часть */}
      <p>{formatBalanceWithoutDecimals(balance, jetton.decimals)}</p>
    </div>
  );
};
