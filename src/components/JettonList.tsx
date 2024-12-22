import { useEffect, useState } from "react";  
import { JettonBalance } from "@ton-api/client"; 
import { JettonItem } from "./JettonItem";

interface JettonListProps {
  jettons: JettonBalance[] | null;
  connectedAddressString: string | null;
  onSendClick: (jetton: JettonBalance) => void;
  className?: string;
}

// Функция для получения курса TON в долларах
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

// Функция для получения баланса TON
const getTonBalance = async (address: string) => {
  try {
    const response = await fetch(`https://toncenter.com/api/v2/getAddressBalance?address=${address}`);
    const data = await response.json();
    if (data.ok) {
      return data.result / 1e9; // Конвертируем нанотоны в тоны
    } else {
      throw new Error('Ошибка при получении баланса');
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const JettonList = ({ jettons, connectedAddressString, onSendClick, className }: JettonListProps) => {
  const [tonBalance, setTonBalance] = useState<number | null>(null);
  const [tonPriceInUSD, setTonPriceInUSD] = useState<number>(0);

  useEffect(() => {
    const fetchTonBalance = async () => {
      if (connectedAddressString) {
        const balance = await getTonBalance(connectedAddressString); 
        setTonBalance(balance);
      }
    };

    const fetchTonPrice = async () => {
      const price = await getTonPriceInUSD();
      setTonPriceInUSD(price);
    };
    
    fetchTonBalance();
    fetchTonPrice();
  }, [connectedAddressString]);

  return (
    <div className={className}>
      {connectedAddressString ? (
        <div>
          {tonBalance !== null && tonPriceInUSD > 0 && (
            <div className="jetton-item">
              <img
                src="https://ton.org/download/ton_symbol.svg" // Путь к логотипу TON
                alt="TON"
                className="jetton-image"
              />
              <div className="jetton-details">
                <p>TON: </p>
              </div>
              <p>{tonBalance}</p>
              <p>({(tonBalance * tonPriceInUSD).toFixed(2)} $)</p> {/* Показать баланс в долларах */}
            </div>
          )}
          {jettons && jettons.length ? (
            jettons
              .filter((jettonBalance) => jettonBalance.balance > 0) // Фильтруем Jettons с нулевым балансом
              .map((jettonBalance) => (
                <JettonItem key={jettonBalance.jetton.address.toString()} jettonBalance={jettonBalance} onSendClick={onSendClick} />
              ))
          ) : (
            <p>No jettons found</p>
          )}
        </div>
      ) : (
        <p>Connect to see jettons</p>
      )}
    </div>
  );
};
