import React, { useEffect, useState } from "react";  
import { BackButton } from "../components/BackButton";
import { createAppKit } from '@reown/appkit/react';
import { SolanaAdapter } from '@reown/appkit-adapter-solana/react';
import { arbitrum, polygon, scroll, optimism, mainnet } from '@reown/appkit/networks';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';

// Настройка Solana Adapter
const solanaWeb3JsAdapter = new SolanaAdapter({
  wallets: [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
});

// Project ID
const projectId = '75c1ff8eab2548ed33251aaadcebee4e';

// Metadata
const metadata = {
  name: 'HODR',
  description: 'HODR',
  url: 'https://hodrland.fun',
  icons: ['https://raw.githubusercontent.com/HODRLAND/HODR/refs/heads/main/HODR.png'],
};

// Инициализация AppKit
createAppKit({
  adapters: [solanaWeb3JsAdapter],
  networks: [arbitrum, polygon, scroll, optimism, mainnet],
  metadata: metadata,
  projectId,
  features: {
    connectMethodsOrder: ['social', 'email', 'wallet'],
    analytics: true,
    onramp: false,
    swaps: true,
  },
});

// Функция для получения данных о криптовалютах через Binance API
const fetchBinanceAltcoins = async () => {
  const response = await fetch("https://api.binance.com/api/v3/ticker/24hr");
  if (!response.ok) {
    throw new Error("Failed to fetch altcoins data from Binance");
  }
  const data = await response.json();
  return data.filter((coin: any) => coin.symbol.endsWith("USDT")); // Отфильтровываем только пары с USDT
};

const TradePage: React.FC = () => {
  const [altcoins, setAltcoins] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [initialPrices, setInitialPrices] = useState<Record<string, number>>({}); // Для хранения начальных цен

  // Инициализация CoinGecko данных
  useEffect(() => {
    const fetchTopAltcoins = async () => {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch CoinGecko data");
      }
      return response.json();
    };

    const getAltcoins = async () => {
      try {
        const data = await fetchTopAltcoins();
        setAltcoins(data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || "An error occurred");
        setLoading(false);
      }
    };

    getAltcoins();
  }, []);

  // Обновление данных с Binance API
  useEffect(() => {
    const updatePrices = async () => {
      try {
        const binanceData = await fetchBinanceAltcoins();

        const priceMap: Record<string, number> = {};
        binanceData.forEach((coin: any) => {
          priceMap[coin.symbol] = parseFloat(coin.lastPrice);

          // Если цена еще не установлена (первая загрузка), сохраняем начальную цену
          if (!initialPrices[coin.symbol]) {
            setInitialPrices((prev) => ({
              ...prev,
              [coin.symbol]: priceMap[coin.symbol],
            }));
          }
        });

        setPrices(priceMap);
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching Binance data");
      }
    };

    // Обновляем цены раз в секунду
    const interval = setInterval(() => {
      updatePrices();
    }, 1000);

    return () => clearInterval(interval); // Очищаем интервал при размонтировании
  }, [prices, initialPrices]);

  return (
    <div className="alt-hub">
      <BackButton />
      <h1>Crypto</h1>
     <div className="ui-tapbar-button-container">
  <appkit-button />
</div>


      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <div className="altcoins-list">
          {altcoins.map((coin) => {
            const binanceSymbol = `${coin.symbol.toUpperCase()}USDT`;
            const currentPrice = prices[binanceSymbol] || coin.current_price;
            const initialPrice = initialPrices[binanceSymbol];
            const priceChange = initialPrice
              ? ((currentPrice - initialPrice) / initialPrice) * 100
              : 0;

            const priceChangeColor = priceChange > 0 ? 'green' : 'red';
            const priceChangeIcon = priceChange > 0 ? '▲' : '▼';
            const priceChanged = initialPrice !== currentPrice;

            return (
              <div key={coin.id} className="altcoin">
                <img
                  src={coin.image}
                  alt={coin.name}
                  className="altcoin-image"
                />
                <div className="altcoin-details">
                  <span>{coin.name} ({coin.symbol.toUpperCase()})</span>
                  <br />
                  <div className="price-info">
                    <span
                      style={{ color: priceChangeColor }}
                      className={priceChanged ? "blinking" : ""}
                    >
                      ${currentPrice.toLocaleString()}
                    </span>
                    <span style={{ color: priceChangeColor }}>
                      {priceChangeIcon} {priceChange.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TradePage;
