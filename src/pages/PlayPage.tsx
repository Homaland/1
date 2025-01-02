import React, { useEffect, useState } from "react";
import ApexCharts from "react-apexcharts";
import BottomMenu from "../components/BottomMenu";
import "./PlayPage.css";

// Fetch Binance data for the altcoin
const fetchAltcoinData = async (symbol: string) => {
  const binanceResponse = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`);
  const binanceData = await binanceResponse.json();
  const price = parseFloat(binanceData.price);

  const coinGeckoResponse = await fetch(
    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${symbol.toLowerCase()}`
  );
  const coinGeckoData = await coinGeckoResponse.json();
  const marketData = coinGeckoData[0];
  const priceChange = marketData.price_change_percentage_24h;
  const symbolName = marketData.name;
  const image = marketData.image;

  return { price, priceChange, symbolName, image };
};

const PlayPage: React.FC = () => {
  const [series, setSeries] = useState([{ data: [] as { x: number; y: number }[] }]);
  const [isLoading, setIsLoading] = useState(true);
  const [altcoinData, setAltcoinData] = useState<{
    price: number;
    priceChange: number;
    symbolName: string;
    image: string;
  } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { price, priceChange, symbolName, image } = await fetchAltcoinData("TONUSDT");

        setAltcoinData({ price, priceChange, symbolName, image });

        const time = new Date().getTime();
        setSeries((prev) => {
          const updatedData = [...prev[0].data, { x: time, y: price }];
          if (updatedData.length > 50) updatedData.shift();
          return [{ data: updatedData }];
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
    return <div>Loading...</div>;
  }

  const priceChangeColor = altcoinData?.priceChange > 0 ? "green" : "red";
  const priceChangeIcon = altcoinData?.priceChange > 0 ? "▲" : "▼";
  const priceChanged = altcoinData?.priceChange !== 0;

  return (
    <div className="play-page">
      <img
        src={altcoinData?.image || "https://default-image.com/altcoin.png"}
        alt={altcoinData?.symbolName || "Altcoin"}
        style={{ display: "block", margin: "0 auto", maxWidth: "100%", height: "auto" }}
      />
      <h1 style={{ textAlign: "center" }}>Earn</h1>
      <div className="earn-blok-wrapper">
        <div className="chart-container">
          <p className="chart-text top">
            {altcoinData?.symbolName || "Altcoin"} {`(${altcoinData?.price.toFixed(2)})`}{" "}
            <span style={{ color: priceChangeColor }}>
              {priceChangeIcon} {altcoinData?.priceChange.toFixed(2)}%
            </span>
          </p>
          <div className={`earn-blok1 loaded`}>
            <div style={{ width: "100%", margin: "auto" }}>
              <ApexCharts options={options} series={series} type="line" />
            </div>
          </div>
          <p className="chart-text bottom">Bot Trading</p>
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
