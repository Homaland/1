import React, { useEffect, useState } from "react";
import ApexCharts from "react-apexcharts";
import BottomMenu from "../components/BottomMenu";
import "./PlayPage.css";

const TaskPage: React.FC = () => {
  const [series, setSeries] = useState([{ data: [] as { x: number; y: number }[] }]);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Флаг загрузки данных
  const [bufferedData, setBufferedData] = useState<{ x: number; y: number }[]>([]); // Буфер для данных

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://api.binance.com/api/v3/ticker/price?symbol=TONUSDT");
        const data = await response.json();
        const price = parseFloat(data.price);
        const time = new Date().getTime(); // Текущая метка времени

        setCurrentPrice(price);

        setBufferedData((prev) => {
          const updatedData = [...prev, { x: time, y: price }];
          if (updatedData.length > 50) updatedData.shift(); // Ограничение длины графика
          return updatedData;
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const interval = setInterval(fetchData, 2000); // Запрос каждые 2 секунды
    fetchData(); // Первый вызов без ожидания

    return () => clearInterval(interval); // Очистка интервала при размонтировании
  }, []);

  useEffect(() => {
    // Показываем график, когда данные загружены
    if (bufferedData.length > 0 && isLoading) {
      setSeries([{ data: bufferedData }]);
      setIsLoading(false); // Отключаем спиннер
    } else if (!isLoading) {
      // Обновляем график в реальном времени
      setSeries((prev) => {
        const updatedData = [...prev[0].data, bufferedData[bufferedData.length - 1]];
        if (updatedData.length > 50) updatedData.shift();
        return [{ data: updatedData }];
      });
    }
  }, [bufferedData, isLoading]);

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
        style: { colors: "#0000F5" },
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
    <div
      className="play-page"
      style={{
        color: "#0000F5",
        minHeight: "100vh",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h1 style={{ color: "#0000F5", textAlign: "center" }}>ГРАФИК</h1>
      <div style={{ width: "90%", margin: "auto" }}>
        {isLoading ? (
          <div className="spinner"></div>
        ) : (
          <ApexCharts options={options} series={series} type="line" height={350} />
        )}
      </div>
      {currentPrice && !isLoading && (
        <h2 style={{ textAlign: "center", color: "#0000F5" }}>
          Текущая цена: ${currentPrice.toFixed(2)}
        </h2>
      )}
      <BottomMenu />
    </div>
  );
};

export default TaskPage;
