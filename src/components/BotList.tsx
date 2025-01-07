import React from "react";

const data = [
  { name: "USUAL / USDT", status: "Sideways", percentage: "27.3%", trend: "positive" },
  { name: "MOVE / USDT", status: "Sideways", percentage: "21.24%", trend: "positive" },
  { name: "PENGU / USDT", status: "Sideways", percentage: "15.38%", trend: "positive" },
  { name: "OM / USDT", status: "Sideways", percentage: "14.64%", trend: "positive" },
  { name: "ENA / USDT", status: "Sideways", percentage: "14.6%", trend: "positive" },
];

// Убедитесь, что типы стилей соответствуют типам React.CSSProperties
const containerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",  // Теперь используем правильное значение для flexDirection
  gap: "10px",
  padding: "20px"
};

const itemStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  backgroundColor: "#2A2A2A",
  borderRadius: "10px",
  padding: "10px 15px",
  gap: "15px"
};

const iconStyle: React.CSSProperties = {
  width: "40px",
  height: "40px"
};

const detailsStyle: React.CSSProperties = {
  flex: 1
};

const nameStyle: React.CSSProperties = {
  fontSize: "16px",
  fontWeight: "bold",
  color: "#FFF"
};

const statusStyle: React.CSSProperties = {
  fontSize: "14px",
  color: "#A3A3A3"
};

const percentageStyle: React.CSSProperties = {
  fontSize: "16px",
  fontWeight: "bold",
  color: "#FFF"
};

const positiveStyle: React.CSSProperties = {
  color: "#4CAF50"
};

const negativeStyle: React.CSSProperties = {
  color: "#F44336"
};

export const BotList: React.FC = () => {
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
          <div style={{ ...percentageStyle, ...(item.trend === "positive" ? positiveStyle : negativeStyle) }}>
            {item.percentage}
          </div>
        </div>
      ))}
    </div>
  );
};
