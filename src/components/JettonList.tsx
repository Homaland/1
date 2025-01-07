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
      return data.result / 1e9;
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
              <img
                src="https://ton.org/download/ton_symbol.svg"
                alt="TON"
                className="jetton-image"
                style={{ width: "40px", height: "40px", borderRadius: "50%" }}
              />
              <div className="jetton-details">
                <p>TON: </p>
              </div>
              <p>{tonBalance}</p>
              <p>({(tonBalance * tonPriceInUSD).toFixed(2)} $)</p>
            </div>
          ) : (
            <p>No jettons found</p>
          )}

          {/* Фильтруем и показываем только TON или HODR */}
          {jettons && jettons.length ? (
            jettons
              .filter((jettonBalance) => {
                const symbol = jettonBalance.jetton.symbol;
                return symbol === "TON" || symbol === "HODR"; // Фильтруем только по символу TON или HODR
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
        `}
      </style>
    </div>
  );
};
