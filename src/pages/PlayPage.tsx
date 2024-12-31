import React, { useEffect, useState } from "react";
import ApexCharts from "react-apexcharts";
import BottomMenu from "../components/BottomMenu";
import "./PlayPage.css";

const TaskPage: React.FC = () => {
  const [series, setSeries] = useState([{ data: [] as { x: number; y: number }[] }]);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Flag for data loading
  const [bufferedData, setBufferedData] = useState<{ x: number; y: number }[]>([]); // Buffer for data
  const [startTime, setStartTime] = useState<number | null>(null); // Track the start time for delay

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://api.binance.com/api/v3/ticker/price?symbol=TONUSDT");
        const data = await response.json();
        const price = parseFloat(data.price);
        const time = new Date().getTime(); // Current timestamp

        setCurrentPrice(price);

        setBufferedData((prev) => {
          const updatedData = [...prev, { x: time, y: price }];
          if (updatedData.length > 50) updatedData.shift(); // Limit the length of the chart data
          return updatedData;
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const interval = setInterval(fetchData, 2000); // Fetch data every 2 seconds
    fetchData(); // First call immediately

    return () => clearInterval(interval); // Clean up the interval on unmount
  }, []);

  useEffect(() => {
    if (startTime === null) {
      setStartTime(new Date().getTime()); // Set start time when the component mounts
    }
    // Once buffered data is available and 7 seconds have passed, show the graph
    if (bufferedData.length > 0 && isLoading) {
      const elapsedTime = new Date().getTime() - startTime!;
      if (elapsedTime >= 7000) {
        setSeries([{ data: bufferedData }]);
        setIsLoading(false); // Turn off loading spinner after 7 seconds
      }
    } else if (!isLoading) {
      // Update the chart with new data in real-time
      setSeries((prev) => {
        const updatedData = [...prev[0].data, bufferedData[bufferedData.length - 1]];
        if (updatedData.length > 50) updatedData.shift();
        return [{ data: updatedData }];
      });
    }
  }, [bufferedData, isLoading, startTime]);

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "line",
      animations: {
        enabled: true,
        dynamicAnimation: {
          enabled: true,
          speed: 2000, // Smooth chart update
        },
      },
      toolbar: { show: false },
      zoom: { enabled: false },
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
        show: false,
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
      show: false,
    },
    tooltip: {
      enabled: false,
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
