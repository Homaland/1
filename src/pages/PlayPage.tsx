import React, { useEffect, useState } from "react"; 
import ApexCharts from "react-apexcharts";
import BottomMenu from "../components/BottomMenu";
import "./PlayPage.css";

const TaskPage: React.FC = () => {
  const [series, setSeries] = useState([{ data: [] as { x: number; y: number }[] }]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://api.binance.com/api/v3/ticker/price?symbol=TONUSDT");
        const data = await response.json();
        const price = parseFloat(data.price);
        const time = new Date().getTime();

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
      <h1 style={{ textAlign: "center" }}>Earn</h1>
      <div className="earn-blok-wrapper">
        {isLoading ? (
          <div className="spinner"></div>
        ) : (
          <div className={`earn-blok loaded`}>
            <div style={{ width: "100%", margin: "auto" }}>
              <ApexCharts options={options} series={series} type="line" />
            </div>
          </div>
        )}
      </div>
      <BottomMenu />
    </div>
  );
};

export default TaskPage;
