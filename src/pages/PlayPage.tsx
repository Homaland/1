import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import BottomMenu from "../components/BottomMenu";
import "./PlayPage.css";

// Регистрация компонентов Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const TaskPage: React.FC = () => {
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://api.binance.com/api/v3/klines", {
          params: {
            symbol: "BTCUSDT", // Пара торгов (например, BTC/USDT)
            interval: "1h", // Интервал (например, 1 час)
            limit: 50, // Количество данных
          },
        });

        const prices = response.data.map((item: any) => ({
          time: new Date(item[0]).toLocaleTimeString(),
          price: parseFloat(item[4]),
        }));

        setChartData({
          labels: prices.map((p: any) => p.time),
          datasets: [
            {
              label: "BTC/USDT Price",
              data: prices.map((p: any) => p.price),
              borderColor: "rgba(75,192,192,1)",
              backgroundColor: "rgba(75,192,192,0.2)",
              borderWidth: 2,
            },
          ],
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching Binance API data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="play-page">
      <h1>Play</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div style={{ width: "80%", margin: "auto" }}>
          <Line
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: { display: true, position: "top" },
                title: { display: true, text: "BTC/USDT Price Chart" },
              },
            }}
          />
        </div>
      )}
      <BottomMenu />
    </div>
  );
};

export default TaskPage;
