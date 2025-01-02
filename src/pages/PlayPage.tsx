import React, { useEffect, useState } from "react"; 
import ApexCharts from "react-apexcharts"; 
import BottomMenu from "../components/BottomMenu"; 
import "./PlayPage.css";

const PlayPage: React.FC = () => {
  const [series, setSeries] = useState([{ data: [] as { x: number; y: number }[] }]);
  const [isLoading, setIsLoading] = useState(true);
  const [tonPrice, setTonPrice] = useState<number | null>(null); // Состояние для цены TON

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://api.binance.com/api/v3/ticker/price?symbol=TONUSDT");
        const data = await response.json();
        const price = parseFloat(data.price);
        const time = new Date().getTime();

        setTonPrice(price); // Обновляем цену TON
        setSeries((prev) => {
          const updatedData = [...prev[0].data, { x: time, y: price }];
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
      {/* Контейнер с Flexbox для выравнивания картинки и текста "Earn" на одной строке */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <img
          src="https://raw.githubusercontent.com/HODRLAND/HODR/refs/heads/main/img/IMG_0189.png"
          alt="Earn"
          style={{ width: "40px", height: "40px", marginRight: "10px" }}
        />
        <h1>Earn</h1>
      </div>
      <div className="earn-blok-wrapper">
        {isLoading ? (
          <div className="skeleton-loader"></div>
        ) : (
          <div className="chart-container">
            {/* Контейнер для картинки и текста TON */}
            <div className="chart-text top" style={{ display: "inline-flex", alignItems: "center" }}>
              <img
                src="https://ton.org/download/ton_symbol.svg"
                alt="TON"
                className="jetton-image"
                style={{ width: "20px", height: "20px", borderRadius: "50%", marginRight: "8px" }}
              />
              <span>TON {tonPrice ? `$${tonPrice.toFixed(2)}` : "Loading..."}</span>
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
