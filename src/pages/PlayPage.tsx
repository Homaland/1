import React, { useEffect, useState } from "react";
import ApexCharts from "react-apexcharts";
import BottomMenu from "../components/BottomMenu";
import "./PlayPage.css";

const TaskPage: React.FC = () => {
  const [series, setSeries] = useState([{ data: [] as { x: string; y: number }[] }]);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);

  useEffect(() => {
    // Подключение к Binance WebSocket
    const ws = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@trade");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const price = parseFloat(data.p); // Цена из WebSocket
      const time = new Date(data.T).toLocaleTimeString(); // Время

      setCurrentPrice(price);

      // Обновление графика
      setSeries((prev) => {
        const updatedData = [...prev[0].data, { x: time, y: price }];
        // Убираем старые точки, если их слишком много
        if (updatedData.length > 50) updatedData.shift();
        return [{ data: updatedData }];
      });
    };

    return () => ws.close(); // Закрываем WebSocket при размонтировании компонента
  }, []);

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "line", // Исправлено: явно указываем строгое значение
      animations: {
        enabled: true,
        speed: 800,
        dynamicAnimation: {
          enabled: true,
          speed: 500, // Установите скорость для динамической анимации
        },
      },
      toolbar: { show: false },
      background: "#f4f4f4",
    },
    colors: ["#00E396"],
    stroke: { curve: "smooth", width: 2 },
    xaxis: { type: "category", title: { text: "Time" }, labels: { rotate: -45 } },
    yaxis: {
      title: { text: "Price (USDT)" },
      labels: {
        formatter: (value: number) => `$${value.toFixed(2)}`,
      },
    },
    tooltip: { enabled: true },
    grid: { borderColor: "#e7e7e7" },
  };

  return (
    <div className="play-page">
      <h1>BTC/USDT Live Price</h1>
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        {currentPrice ? (
          <h2 style={{ color: "#00E396" }}>
            Current Price: ${currentPrice.toFixed(2)}
          </h2>
        ) : (
          <p>Loading current price...</p>
        )}
      </div>
      <div style={{ width: "80%", margin: "auto" }}>
        <ApexCharts options={options} series={series} type="line" height={350} />
      </div>
      <BottomMenu />
    </div>
  );
};

export default TaskPage;
