import React, { useEffect, useState } from "react";
import ApexCharts from "react-apexcharts";
import BottomMenu from "../components/BottomMenu";
import "./PlayPage.css";

const TaskPage: React.FC = () => {
  const [series, setSeries] = useState([{ data: [] as { x: number; y: number }[] }]);
  
  const [isLoading, setIsLoading] = useState(true); // Флаг загрузки данных

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://api.binance.com/api/v3/ticker/price?symbol=TONUSDT");
        const data = await response.json();
        const price = parseFloat(data.price);
        const time = new Date().getTime(); // Текущая метка времени

        setSeries((prev) => {
          const updatedData = [...prev[0].data, { x: time, y: price }];
          if (updatedData.length > 50) updatedData.shift(); // Ограничение длины графика
          return [{ data: updatedData }];
        });

        setIsLoading(false); // Снимаем флаг загрузки после получения первых данных
      } catch (error) {
        console.error("Error fetching data:", error);
      }
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
      colors: ["#0000F5"],
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
        style: { colors: "#FFC107" },
      },
    },
    grid: {
      show: false, // Убираем сетку
    },
    tooltip: {
      enabled: false, // Отключаем тултипы
    },
    colors: ["#0000F5"],
  };

  return (
    <div className="play-page">
      <h1 style={{ color: "#FFC107", textAlign: "center" }}>Earn</h1>
      <div className="earn-blok">
      <div style={{ width: "90%", margin: "auto" }}>
        {isLoading ? (
          <div className="spinner"></div>
        ) : (
          <ApexCharts options={options} series={series} type="line" height={350} />
        )}
      </div>
    
        </div>
      <BottomMenu />
    </div>
  );
};

export default TaskPage;
