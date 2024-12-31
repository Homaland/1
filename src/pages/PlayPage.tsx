import React, { useEffect, useState } from "react";
import ApexCharts from "react-apexcharts";
import BottomMenu from "../components/BottomMenu";
import "./PlayPage.css";

const TaskPage: React.FC = () => {
  const [series, setSeries] = useState([{ data: [] as { x: number; y: number }[] }]);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);

  useEffect(() => {
    const ws = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@trade");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const price = parseFloat(data.p); // Цена
      const time = new Date(data.T).getTime(); // Время в формате timestamp

      setCurrentPrice(price);

      setSeries((prev) => {
        const updatedData = [...prev[0].data, { x: time, y: price }];
        if (updatedData.length > 50) updatedData.shift(); // Удаляем старые точки
        return [{ data: updatedData }];
      });
    };

    return () => ws.close();
  }, []);

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "line",
      animations: {
        enabled: true,
        dynamicAnimation: {
          enabled: true,
          speed: 1000,
        },
      },
      toolbar: { show: false },
    },
    stroke: {
      curve: "smooth",
      width: 3,
      colors: ["#FFC107"],
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "horizontal",
        gradientToColors: ["#FF5722"],
        stops: [0, 100],
      },
    },
    xaxis: {
      type: "datetime",
      labels: {
        show: true,
        style: { colors: "#FFFFFF" },
      },
    },
    yaxis: {
      labels: {
        formatter: (value) => `$${value.toFixed(2)}`,
        style: { colors: "#FFFFFF" },
      },
    },
    grid: {
      borderColor: "rgba(255, 255, 255, 0.1)",
    },
    tooltip: {
      enabled: true,
      theme: "dark",
      x: { format: "HH:mm:ss" },
    },
    colors: ["#FFC107"],
  };
  

  return (
    <div
      className="play-page"
      style={{
        background: "linear-gradient(to bottom, #1a1a1a, #121212)",
        color: "#FFFFFF",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <h1 style={{ color: "#FFC107", textAlign: "center" }}>ГРАФИК</h1>
      <div style={{ width: "90%", margin: "auto" }}>
        <ApexCharts options={options} series={series} type="line" height={350} />
      </div>
      {currentPrice && (
        <h2 style={{ textAlign: "center", color: "#FFC107" }}>
          Текущая цена: ${currentPrice.toFixed(2)}
        </h2>
      )}
      <BottomMenu />
    </div>
  );
  
};

export default TaskPage;
