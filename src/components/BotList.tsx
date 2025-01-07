import React, { useState, useEffect } from "react";

const initialData = [
  { name: "USUAL / USDT", status: "Grid", percentage: "27.3%", trend: "positive" },
  { name: "MOVE / USDT", status: "Grid", percentage: "21.24%", trend: "positive" },
  { name: "PENGU / USDT", status: "Grid", percentage: "15.38%", trend: "positive" },
  { name: "OM / USDT", status: "Grid", percentage: "14.64%", trend: "positive" },
  { name: "ENA / USDT", status: "Grid", percentage: "14.6%", trend: "positive" },
];

// Функция для генерации случайных процентов в диапазоне от 2 до 40
const getRandomPercentage = (): string => {
  const min = 2;
  const max = 15;
  const randomPercentage = (Math.random() * (max - min) + min).toFixed(2); // Генерируем случайное значение от 2 до 40
  return randomPercentage;
};

const getRandomName = (): string => {
  const names = ["USUAL / USDT", "NOT / USDT", "TON / USDT", "PEPE / USDT", "MOVE / USDT", "PIXEL / USDT", "XAI / USDT", "DYDX / USDT", "ETHFI / USDT", "PENGU / USDT", "OM / USDT", "ENA / USDT"];
  const randomIndex = Math.floor(Math.random() * names.length);
  return names[randomIndex];
};

export const BotList: React.FC = () => {
  const [data, setData] = useState(initialData);

  useEffect(() => {
    const intervalId = setInterval(() => {
      // Обновляем данные каждые 5 секунд
      setData(prevData =>
        prevData.map(item => ({
          ...item,
          percentage: getRandomPercentage(), // Обновляем процент
          name: getRandomName(),             // Обновляем название
        }))
      );
    }, 5000); // Интервал в 5000 миллисекунд (5 секунд)

    // Очистка интервала при размонтировании компонента
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div style={containerStyle}>
      {data.map((item, index) => (
        <div style={itemStyle} key={index}>
          <img
            src="https://cryptologos.cc/logos/binance-coin-bnb-logo.png"
            alt="Binance Icon"
            style={iconStyle}
          />
          <div style={detailsStyle}>
            <div style={nameStyle}>{item.name}</div>
            <div style={statusStyle}>{item.status}</div>
          </div>
          <div
            style={{
              ...percentageStyle,
              ...(item.trend === "positive" ? positiveStyle : negativeStyle),
            }}
          >
            {item.percentage}%
          </div>
        </div>
      ))}
    </div>
  );
};

const containerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

const itemStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  backgroundColor: "#2A2A2A",
  borderRadius: "10px",
  padding: "10px 15px",
  gap: "15px",
};

const iconStyle: React.CSSProperties = {
  width: "40px",
  height: "40px",
};

const detailsStyle: React.CSSProperties = {
  flex: 1,
};

const nameStyle: React.CSSProperties = {
  fontSize: "16px",
  fontWeight: "bold",
  color: "#FFF",
};

const statusStyle: React.CSSProperties = {
  fontSize: "14px",
  color: "#A3A3A3",
};

const percentageStyle: React.CSSProperties = {
  fontSize: "16px",
  fontWeight: "bold",
  color: "#FFF",
};

const positiveStyle: React.CSSProperties = {
  color: "#4CAF50",
};

const negativeStyle: React.CSSProperties = {
  color: "#F44336",
};
