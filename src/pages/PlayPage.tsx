import React, { useEffect, useState } from "react";
import ApexCharts from "react-apexcharts";
import BottomMenu from "../components/BottomMenu";
import "./PlayPage.css";

// Функция для получения данных о криптовалютах через Binance API
const fetchBinanceData = async (symbol: string) => {
  const response = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`);
  if (!response.ok) {
    throw new Error("Failed to fetch Binance data");
  }
  return response.json();
};

// Функция для получения данных о криптовалютах через CoinGecko API
const fetchCoinGeckoData = async (symbol: string) => {
  const response = await fetch(
    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${symbol}&sparkline=false`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch CoinGecko data");
  }
  const data = await response.json();
  return data[0];
};

const PlayPage: React.FC = () => {
  const [series, setSeries] = useState([{ data: [] as { x: number; y: number }[] }]);
  const [cryptoData, setCryptoData] = useState<any>(null); // Для данных о криптовалюте
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const binanceData = await fetchBinanceData("TONUSDT");
        const coinGeckoData = await fetchCoinGeckoData("toncoin");

        const price = parseFloat(binanceData.price);
        const time = new Date().getTime();

        setSeries((prev) => {
          const updatedData = [...prev[0].data, { x: time, y: price }];
          if (updatedData.length > 50) updatedData.shift();
          return [{ data: updatedData }];
        });

        setCryptoData({
          name: coinGeckoData.name,
          symbol: coinGeckoData.symbol.toUpperCase(),
          currentPrice: price,
          initialPrice: coinGeckoData.current_price,
          priceChange: ((price - coinGeckoData.current_price) / coinGeckoData.current_price) * 100,
        });

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const interval = setInterval(fetchData, 3500);
    fetchData();

    return () => clearInterval(interval);
  }, []);

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

  if (isLoading) {
    return <div className="skeleton-loader"></div>;
  }

  // Определяем цвет для стрелки изменения цены
  const priceChangeColor = cryptoData.priceChange > 0 ? "green" : "red";
  const priceChangeIcon = cryptoData.priceChange > 0 ? "▲" : "▼";

  return (
    <div className="play-page">
      {/* Добавляем картинку перед заголовком */}
      <img
        src="https://raw.githubusercontent.com/HODRLAND/HODR/refs/heads/main/img/IMG_0189.png"
        alt="Earn"
        style={{ display: "block", margin: "0 auto", maxWidth: "10%", height: "auto" }}
      />
      <h1 style={{ textAlign: "center" }}>Earn</h1>
      <div className="earn-blok-wrapper">
        <div className="chart-container">
          <p className="chart-text top">
            {cryptoData.name} ({cryptoData.symbol})
          </p> {/* Верхний текст с названием криптовалюты и тикером */}
          <div className={`earn-blok1 loaded`}>
            <div style={{ width: "100%", margin: "auto" }}>
              <ApexCharts options={options} series={series} type="line" />
            </div>
          </div>
          <p className="chart-text bottom">
            <span
              style={{ color: priceChangeColor }}
              className={cryptoData.priceChange !== 0 ? "blinking" : ""}
            >
              ${cryptoData.currentPrice.toLocaleString()}
            </span>
            <span style={{ color: priceChangeColor }}>
              {priceChangeIcon} {cryptoData.priceChange.toFixed(2)}%
            </span>
          </p> {/* Нижний текст с ценой и изменением */}
        </div>
      </div>
      <div className="how-it-works2">
        <p>SOON SOON SOON SOON SOON SOON SOON SOON </p>
      </div>
      <BottomMenu />
    </div>
  );
};

export default PlayPage;
