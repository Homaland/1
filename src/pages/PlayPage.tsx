import React, { useEffect, useState } from "react";
import ApexCharts from "react-apexcharts";
import BottomMenu from "../components/BottomMenu";
import "./PlayPage.css";

const TaskPage: React.FC = () => {
  const [series, setSeries] = useState([{ data: [] as { x: number; y: number }[] }]);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("https://api.binance.com/api/v3/ticker/price?symbol=TONUSDT");
      const data = await response.json();
      const price = parseFloat(data.price);
      const time = new Date().getTime(); // Текущая метка времени

      setCurrentPrice(price);

      setSeries((prev) => {
        const updatedData = [...prev[0].data, { x: time, y: price }];
        if (updatedData.length > 50) updatedData.shift(); // Ограничение длины графика
        return [{ data: updatedData }];
      });
    };

    const interval = setInterval(fetchData, 5000); // Запрос каждые 5 секунд
    fetchData(); // Первый вызов без ожидания

    return () => clearInterval(interval); // Очистка интервала при размонтировании
  }, []);

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "line",
      animations: {
        enabled: true,
        dynamicAnimation: {
          enabled: true,
          speed: 2000, // Плавное обновление графика
        },
      },
      toolbar: { show: false }, // Убираем элементы управления
      zoom: { enabled: false }, // Отключаем зум
      background: "transparent",
    },
    stroke: {
      curve: "smooth",
      width: 3,
      colors: ["#FFC107"],
    },
    xaxis: {
      type: "datetime",
      labels: {
        show: false, // Скрыть метки времени
      },
      axisTicks: { show: false },
      axisBorder: { show: false },
    },
    yaxis: {
      labels: {
        formatter: (value) => `$${value.toFixed(2)}`,
        style: { colors: "#FFFFFF" },
      },
    },
    grid: {
      show: false, // Убираем сетку
    },
    tooltip: {
      enabled: false, // Отключаем тултипы
    },
    colors: ["#FFC107"],
  };

  return (
    <div
      className="play-page"
      style={{
        
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
