import React, { useEffect, useState } from "react";
import ApexCharts from "react-apexcharts";
import BottomMenu from "../components/BottomMenu";
import "./PlayPage.css";

// Функция для получения данных о криптовалютах через Binance API
const fetchBinanceAltcoins = async () => {
  const response = await fetch("https://api.binance.com/api/v3/ticker/24hr");
  if (!response.ok) {
    throw new Error("Failed to fetch altcoins data from Binance");
  }
  const data = await response.json();
  return data.filter((coin: any) => coin.symbol.endsWith("USDT")); // Отфильтровываем только пары с USDT
};

const PlayPage: React.FC = () => {
  const [altcoins, setAltcoins] = useState<any[]>([]);
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [initialPrices, setInitialPrices] = useState<Record<string, number>>({}); // Для хранения начальных цен
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Инициализация CoinGecko данных
    const fetchTopAltcoins = async () => {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5&page=1&sparkline=false"
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
        setIsLoading(false);
      } catch (err: any) {
        console.error(err);
        setIsLoading(false);
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
        console.error("Error fetching Binance data:", err);
      }
    };

    // Обновляем цены раз в секунду
    const interval = setInterval(() => {
      updatePrices();
    }, 1000);

    return () => clearInterval(interval); // Очищаем интервал при размонтировании
  }, [prices, initialPrices]);

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "line",
      animations: {
        enabled: true,
        dynamicAnimation: {
          enabled: true,
          speed: 2000,
        },
      },
      toolbar: { show: false },
      zoom: { enabled: false },
      background: "transparent",
    },
    stroke: {
      curve: "smooth",
      width: 3,
      colors: ["#FFC107"],
    },
    xaxis: {
      type: "datetime",
      labels: { show: false },
      axisTicks: { show: false },
      axisBorder: { show: false },
    },
    yaxis: {
      labels: {
        formatter: (value) => `$${value.toFixed(2)}`,
        style: { colors: "#FFC107" },
      },
    },
    grid: { show: false },
    tooltip: { enabled: false },
    colors: ["#FFC107"],
  };

  return (
    <div className="play-page">
      <img
        src="https://raw.githubusercontent.com/HODRLAND/HODR/refs/heads/main/img/IMG_0189.png"
        alt="Earn"
        style={{ display: "block", margin: "0 auto", maxWidth: "100%", height: "auto" }}
      />
      <h1 style={{ textAlign: "center" }}>Earn</h1>
      <div className="earn-blok-wrapper">
        {isLoading ? (
          <div className="skeleton-loader"></div>
        ) : (
          <div className="chart-container">
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
                    style={{ width: "30px", height: "30px" }}
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
      <div className="how-it-works2">
        <p>SOON SOON SOON SOON SOON SOON SOON SOON </p>
      </div>
      <BottomMenu />
    </div>
  );
};

export default PlayPage;
