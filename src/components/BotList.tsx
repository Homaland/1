import React from "react";

const data = [
  { name: "USUAL / USDT", status: "Sideways", percentage: "27.3%", trend: "positive" },
  { name: "MOVE / USDT", status: "Sideways", percentage: "21.24%", trend: "positive" },
  { name: "PENGU / USDT", status: "Sideways", percentage: "15.38%", trend: "positive" },
  { name: "OM / USDT", status: "Sideways", percentage: "14.64%", trend: "positive" },
  { name: "ENA / USDT", status: "Sideways", percentage: "14.6%", trend: "positive" },
];

const containerStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  padding: "20px"
};

const itemStyle = {
  display: "flex",
  alignItems: "center",
  backgroundColor: "#2A2A2A",
  borderRadius: "10px",
  padding: "10px 15px",
  gap: "15px"
};

const iconStyle = {
  width: "40px",
  height: "40px"
};

const detailsStyle = {
  flex: 1
};

const nameStyle = {
  fontSize: "16px",
  fontWeight: "bold",
  color: "#FFF"
};

const statusStyle = {
  fontSize: "14px",
  color: "#A3A3A3"
};

const percentageStyle = {
  fontSize: "16px",
  fontWeight: "bold",
  color: "#FFF"
};

const positiveStyle = {
  color: "#4CAF50"
};

const negativeStyle = {
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
          <div style={{...percentageStyle, ...(item.trend === "positive" ? positiveStyle : negativeStyle)}}>
            {item.percentage}
          </div>
        </div>
      ))}
    </div>
  );
};
