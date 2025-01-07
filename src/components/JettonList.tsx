import { useEffect, useState } from "react";
import { JettonBalance } from "@ton-api/client";
import { JettonItem } from "./JettonItem";

interface JettonListProps {
  jettons: JettonBalance[] | null;
  connectedAddressString: string | null;
  onSendClick: (jetton: JettonBalance) => void;
  className?: string;
}

const getTonPriceInUSD = async () => {
  try {
    const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=the-open-network&vs_currencies=usd");
    const data = await response.json();
    return data["the-open-network"]?.usd || 0;
  } catch (error) {
    console.error("Ошибка при получении курса TON:", error);
    return 0;
  }
};

const getTonBalance = async (address: string) => {
  try {
    const response = await fetch(`https://toncenter.com/api/v2/getAddressBalance?address=${address}`);
    const data = await response.json();
    if (data.ok) {
      return data.result / 1e9; // Преобразуем в TON
    } else {
      throw new Error("Ошибка при получении баланса");
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const JettonList = ({ jettons, connectedAddressString, onSendClick, className }: JettonListProps) => {
  const [tonBalance, setTonBalance] = useState<number | null>(null);
  const [tonPriceInUSD, setTonPriceInUSD] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (connectedAddressString) {
          const balance = await getTonBalance(connectedAddressString);
          const price = await getTonPriceInUSD();
          setTonBalance(balance);
          setTonPriceInUSD(price);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [connectedAddressString]);

  // Функция для форматирования баланса в зависимости от символа
  const formatBalance = (balance: number, symbol: string) => {
    if (symbol === "HODR") {
      return Math.floor(balance).toString(); // Округляем до целого числа для HODR
    }
    return balance.toFixed(2); // Для других токенов (например, TON) — два знака после запятой
  };

  return (
    <div className={className}>
      {connectedAddressString ? (
        <div>
          {loading ? (
            <div className="skeleton-list">
              <div className="skeleton-item">
                <div className="skeleton-image" />
                <div className="skeleton-details">
                  <div className="skeleton-line" style={{ width: "100px", height: "16px" }} />
                  <div className="skeleton-line" style={{ width: "50px", height: "14px" }} />
                </div>
              </div>
            </div>
          ) : tonBalance !== null && tonPriceInUSD > 0 ? (
            <div className="jetton-item">
              <div className="jetton-info">
                <img
                  src="https://ton.org/download/ton_symbol.svg"
                  alt="TON"
                  className="jetton-image"
                />
                <div className="jetton-symbol-and-balance">
                  <p className="jetton-symbol">TON:</p>
                  <p className="jetton-balance">{formatBalance(tonBalance, "TON")}</p>
                </div>
              </div>
              <div className="jetton-price">
                <p>({(tonBalance * tonPriceInUSD).toFixed(2)} $)</p>
              </div>
            </div>
          ) : (
            <p>No jettons found</p>
          )}

          {/* Фильтруем и показываем только TON или HODR */}
          {jettons && jettons.length ? (
            jettons
              .filter((jettonBalance) => {
                const symbol = jettonBalance.jetton.symbol;
                // Показываем TON всегда и HODR только если баланс больше 0
                return symbol === "TON" || (symbol === "HODR" && jettonBalance.balance > 0);
              })
              .map((jettonBalance) => (
                <JettonItem key={jettonBalance.jetton.address.toString()} jettonBalance={jettonBalance} onSendClick={onSendClick} />
              ))
          ) : (
            <p>No jettons found</p>
          )}
        </div>
      ) : (
        <div className="connect-message">
          {loading ? (
            <div className="skeleton-text" />
          ) : (
            <p>Connect to see jettons</p>
          )}
        </div>
      )}

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

          .skeleton-list {
            display: flex;
            flex-direction: column;
            gap: 16px;
          }
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
            animation: skeleton-loading 1.5s infinite ease-in-out;
          }
          .skeleton-details {
            display: flex;
            flex-direction: column;
            gap: 5px;
          }
          .skeleton-line {
            background-color: #e0e0e0;
            border-radius: 4px;
            animation: skeleton-loading 1.5s infinite ease-in-out;
          }
          .connect-message {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100%;
            text-align: center;
            font-size: 18px;
            color: #888;
          }
          .skeleton-text {
            width: 200px;
            height: 20px;
            background-color: #e0e0e0;
            border-radius: 4px;
            margin: 0 auto;
            animation: skeleton-loading 1.5s infinite ease-in-out;
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

          .jetton-symbol-and-balance {
            display: flex;
            align-items: center; /* Размещаем символ и баланс на одной строке */
            gap: 5px; /* Отступ между символом и балансом */
          }

          .jetton-price {
            font-size: 14px;
            color: #888;
            margin-top: 5px;
          }

          .jetton-symbol {
            font-weight: bold;
          }

          .jetton-balance {
            font-weight: normal;
          }
        `}
      </style>
    </div>
  );
};
