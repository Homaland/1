
const data = [
  { name: "USUAL / USDT", status: "Sideways", percentage: "27.3%", trend: "positive" },
  { name: "MOVE / USDT", status: "Sideways", percentage: "21.24%", trend: "positive" },
  { name: "PENGU / USDT", status: "Sideways", percentage: "15.38%", trend: "positive" },
  { name: "OM / USDT", status: "Sideways", percentage: "14.64%", trend: "positive" },
  { name: "ENA / USDT", status: "Sideways", percentage: "14.6%", trend: "positive" },
];

export const BotList: React.FC = () => {
    <style>
    {`
      .container {
display: flex;
flex-direction: column;
gap: 10px;
padding: 20px;
}

.item {
display: flex;
align-items: center;
background-color: #2A2A2A;
border-radius: 10px;
padding: 10px 15px;
gap: 15px;
}

.icon {
width: 40px;
height: 40px;
}

.details {
flex: 1;
}

.name {
font-size: 16px;
font-weight: bold;
color: #FFF;
}

.status {
font-size: 14px;
color: #A3A3A3;
}

.percentage {
font-size: 16px;
font-weight: bold;
color: #FFF;
}

.percentage.positive {
color: #4CAF50;
}

.percentage.negative {
color: #F44336;
}

    `}
  </style>
  return (
    
    <div className="container">
      {data.map((item, index) => (
        <div className="item" key={index}>
          <img 
            src="https://cryptologos.cc/logos/binance-coin-bnb-logo.png" 
            alt="Binance Icon" 
            className="icon" 
          />
          <div className="details">
            <div className="name">{item.name}</div>
            <div className="status">{item.status}</div>
          </div>
          <div className={`percentage ${item.trend}`}>{item.percentage}</div>
        </div>
      ))}
    </div>
     
  );
};


