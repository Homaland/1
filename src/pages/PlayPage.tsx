import React, { useEffect, useState } from "react";
import ApexCharts from "react-apexcharts";
import BottomMenu from "../components/BottomMenu";
import "./PlayPage.css";

// Function to fetch altcoin data from Binance API
const fetchBinanceAltcoinData = async (symbol: string) => {
  const response = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`);
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  return response.json();
};

// Function to fetch price change from CoinGecko
const fetchCoinGeckoPriceChange = async (id: string) => {
  const response = await fetch(
    `https://api.coingecko.com/api/v3/coins/${id}?localization=false`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch price change data from CoinGecko");
  }
  const data = await response.json();
  return data.market_data.price_change_percentage_24h;
};

const PlayPage: React.FC = () => {
  const [altcoin, setAltcoin] = useState<any>(null); // Store altcoin data
  const [priceChange, setPriceChange] = useState<number>(0); // Store price change
  const [price, setPrice] = useState<number>(0); // Store price
  const [isLoading, setIsLoading] = useState(true);

  const altcoinSymbol = "TONUSDT"; // Example for TON
  const altcoinId = "the-alternative-coin-id"; // Replace with the correct CoinGecko ID for the altcoin

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from Binance for the price
        const binanceData = await fetchBinanceAltcoinData(altcoinSymbol);
        const binancePrice = parseFloat(binanceData.price);
        setPrice(binancePrice);

        // Fetch price change data from CoinGecko
        const priceChangeData = await fetchCoinGeckoPriceChange(altcoinId);
        setPriceChange(priceChangeData);

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const priceChangeColor = priceChange > 0 ? "green" : "red"; // Determine color based on price change
  const priceChangeIcon = priceChange > 0 ? "▲" : "▼"; // Up or down icon

  const series = [
    {
      data: [] as { x: number; y: number }[], // Example empty series for the chart
    },
  ];

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
            {/* Displaying altcoin details */}
            <p className="chart-text top" style={{ color: priceChangeColor }}>
              <img
                src={`https://raw.githubusercontent.com/HODRLAND/HODR/refs/heads/main/HODR.png`} // Example altcoin icon
                alt={altcoinSymbol}
                className="altcoin-icon"
                style={{ width: "20px", marginRight: "10px" }}
              />
              {altcoinSymbol.replace("USDT", "")} ${price.toLocaleString()}{" "}
              <span style={{ color: priceChangeColor }}>
                {priceChangeIcon} {priceChange.toFixed(2)}%
              </span>
            </p>
            <div className={`earn-blok1 loaded`}>
              <div style={{ width: "100%", margin: "auto" }}>
                <ApexCharts options={options} series={series} type="line" />
              </div>
            </div>
            <p className="chart-text bottom">Bot Trading</p>
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
