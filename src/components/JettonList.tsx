import React, { useEffect, useState } from "react";
import ApexCharts from "react-apexcharts";
import BottomMenu from "../components/BottomMenu";
import "./PlayPage.css";

const PlayPage: React.FC = () => {
  const [series, setSeries] = useState([{ data: [] as { x: number; y: number }[] }]);
  const [isLoading, setIsLoading] = useState(true);
  const [price, setPrice] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://api.binance.com/api/v3/ticker/price?symbol=TONUSDT");
        const data = await response.json();
        const currentPrice = parseFloat(data.price);
        setPrice(currentPrice); // Store the current price
        const time = new Date().getTime();

        setSeries((prev) => {
          const updatedData = [...prev[0].data, { x: time, y: currentPrice }];
          if (updatedData.length > 50) updatedData.shift();
          return [{ data: updatedData }];
        });

        setIsLoading(false); // Снимаем флаг загрузки
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

  return (
    <div className="play-page">
      {/* Добавляем картинку перед заголовком */}
      <img
        src="https://raw.githubusercontent.com/HODRLAND/HODR/refs/heads/main/img/IMG_0189.png"
        alt="Earn"
        style={{ width: "20px", height: "20px", borderRadius: "50%" }}
      />
      <h1 style={{ textAlign: "center" }}>Earn</h1>
      <div className="earn-blok-wrapper">
        {isLoading ? (
          <div className="skeleton-loader"></div>
        ) : (
          <div className="chart-container">
            <div className="chart-text top" style={{ display: "flex", alignItems: "center" }}>
              {/* TON Logo and Current Price */}
              <img
                src="https://ton.org/download/ton_symbol.svg"
                alt="TON"
                className="jetton-image"
                style={{ width: "20px", height: "20px", borderRadius: "50%" }}
              />
              TON {price !== null ? `$${price.toFixed(2)}` : "Loading..."}
            </div>
            <div className="earn-blok1 loaded">
              <div style={{ width: "100%", margin: "auto" }}>
                <ApexCharts options={options} series={series} type="line" />
              </div>
            </div>
            <p className="chart-text bottom">Bot Trading</p> {/* Нижний текст */}
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
